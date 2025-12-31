// Depends on SUPABASE trackings table
// 12/1/2025
//
// table expects:
// created_at = timestamp
// longitude  = float
// latitude   = float
// user_id    = uuid

import { createNonAuthServer } from '@/lib/server/server_db'
import { AuthenticateKey } from '@/lib/shared/db_rpcs'
import { hashApiKey } from '@/lib/shared/APIkey'
import { haversine } from '@/lib/shared/points'

export async function POST(req) {
  // equivalent to 10 meters
  const DIST_THRESH = 0.01
  const db = await createNonAuthServer()

  // --- Auth header ---
  const authHeader = req.headers.get('authorization')
  const rawKey = authHeader?.split(' ')[1]
  if (!rawKey) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const hashedKey = hashApiKey(rawKey)


  // needs to authenticate for each row. Must also not allow the user to choose the user_id
  // this should instead be given by the validation function (returning user_id)
  try {
    const body = await req.json()
    const data = body.locations
    const num_data = data?.length

    if (!data || !Array.isArray(data) || data.length === 0) {
      return Response.json(
        { error: 'No locations shared' },
        { status: 400 }
      )
    }

    const lastPerDevice = {};

    const filteredRows = data.reduce((acc, loc) => {
      const deviceId = loc.properties.device_id;
      const row = {
        longitude: loc.geometry.coordinates[0],
        latitude: loc.geometry.coordinates[1],
        created_at: loc.properties.timestamp,
        device_id: deviceId,
        user_id: null
      };

      const last = lastPerDevice[deviceId];
      if (last && haversine(row.latitude, row.longitude, last.latitude, last.longitude) < DIST_THRESH) {
        return acc;
      }

      acc.push(row);
      lastPerDevice[deviceId] = row;
      return acc;
    }, []);


    const userCache = {};
    for (const row of filteredRows) {
      if (!userCache[row.device_id]) {
        const user_id = await AuthenticateKey(db, row.device_id, hashedKey);
        if (!user_id) {
          return Response.json(
            { error: 'Unauthorized' },
            { status: 401 }
          )
        }
        userCache[row.device_id] = user_id;
      }
      row.user_id = userCache[row.device_id];
      delete row.device_id;
    }
    
    const { error } = await db.from('trackings').insert(filteredRows)

    console.error(error)
    if (error) throw error

    // OVERLAND client expects result ok
    return Response.json({ result: 'ok' }, { status: 200 })
  } catch (err) {
    console.error('Server error:' + err.message)
    return Response.json(
      { error: 'Server error:' + err.message },
      { status: 500 }
    )
  }
}

export function GET() {
  return Response.json(
    { error: 'Method not authorized' },
    { status: 405 }
  )
}

