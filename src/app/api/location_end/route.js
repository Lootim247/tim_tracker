// Depends on SUPABASE trackings table
// 12/1/2025
//
// table expects:
// created_at = timestamp
// longitude  = float
// latitude   = float
// user_id    = integer

import { createNonAuthServer } from '@/lib/server/server_db'
import { haversine } from '@/lib/shared/points'

export async function POST(req) {
  // equivalent to 10 meters
  const DIST_THRESH = 0.01

  // --- Auth header ---
  const authHeader = req.headers.get('authorization')
  const apiKey = authHeader?.split(' ')[1]
  console.log(apiKey)

  if (apiKey !== process.env.LOCATION_API_KEY) {
    return Response.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

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

    const filteredRows = data.reduce((acc, loc) => {
      const row = {
        longitude: loc.geometry.coordinates[0],
        latitude: loc.geometry.coordinates[1],
        created_at: loc.properties.timestamp,
        user_id: parseInt(loc.properties.device_id || 0),
      }

      const last = acc[acc.length - 1]
      if (
        last &&
        haversine(
          row.latitude,
          row.longitude,
          last.latitude,
          last.longitude
        ) < DIST_THRESH
      ) {
        return acc
      }

      acc.push(row)
      return acc
    }, [])

    const db = await createNonAuthServer()
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

