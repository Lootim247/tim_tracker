// Depends on SUPABASE trackings table
// 12/1/2025
//
// table expects:
// created_at = timestamp
// longitude  = float
// latitude   = float
// user_id    = uuid

// TODO: Apply filter to remove timestamps that are longer than an hour old

import { createNonAuthServer } from '@/lib/server/server_db'
import { AuthenticateKey } from '@/lib/shared/db_rpcs'
import { hashApiKey } from '@/lib/shared/APIkey'
import { haversine } from '@/lib/shared/points'
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);


export async function POST(req) {
  // equivalent to 10 meters
  const DIST_THRESH = 0.01
  const db = await createNonAuthServer()

  async function processOverlandRequest(req) {
    const authHeader = req.headers.get('authorization')
    const rawKey = authHeader?.split(' ')[1]
    if (!rawKey) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    const hashedKey = hashApiKey(rawKey)
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
        console.log(row.device_id)
        console.log(hashedKey)
        const user_id = await AuthenticateKey(db, row.device_id, hashedKey);
        console.log(user_id)
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
    
    console.log('hi')
    const { error } = await db.from('trackings').insert(filteredRows)
    if (error) console.error("insert error:" + error.message)
    if (error) throw error

    return Response.json({ result: 'ok' }, { status: 200 })
  }

  // Expects two things:
  // - User must put their prehashed api password in the application
  // - User must put their email in the user spot
  async function processOwntrackRequest(req) {
    const body = await req.json()
    if (body._type != "location") {
      return Response.json({ result: 'ok' }, { status: 200 })
    }
    console.log('here')

    const rawKey = req.headers.get('php-auth-pw')
    const user = req.headers.get('php-auth-user')

    console.log(rawKey)
    console.log(user)
    if (!rawKey || !user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    const hashedKey = hashApiKey(rawKey)

    const db = await createNonAuthServer();
    console.log(user)
    console.log(hashedKey)
    const user_id = await AuthenticateKey(db, user, hashedKey)

    if (!user_id) {
      console.error('Error: Authentication did not return a user_id')
      console.error(`Given user: ${user}`)
      console.error(`Given key: ${rawKey}`)
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const row = {
      longitude: body.lon,
      latitude: body.lat,
      created_at: dayjs().utc().format(),
      user_id: user_id,
    };

    const { error } = await db.from('trackings').insert(row)
    if (error) console.error("insert error:" + error.message)
    if (error) throw error
    
    console.log('after error')

    return Response.json({ result: 'ok' }, { status: 200 });
  }

  // get sender type. Support only owntracks and overland
  const agent = req.headers.get('user-agent');
  if (agent.slice(0, 8).toLowerCase() == 'overland') {
    try {
      return await processOverlandRequest(req);
    } catch (err) {
      console.error('Server error:' + err.message)
      return Response.json(
        { error: 'Server error:' + err.message },
        { status: 500 }
      )
    } 
  } else if (agent.slice(0,9).toLowerCase() == 'owntracks') {
    try {
      return await processOwntrackRequest(req);
    } catch (err) {
      console.error('Server error:' + err.message)
      return Response.json(
        { error: 'Server error:' + err.message },
        { status: 500 }
      )
    }
  } else {
    return Response.json({ error: 'Sender agent format not accepted' }, { status: 422 })
  }
}

export function GET() {
  return Response.json(
    { error: 'Method not authorized' },
    { status: 405 }
  )
}

