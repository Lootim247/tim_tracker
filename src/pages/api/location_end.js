// Depends on SUPABASE trackings table
// 12/1/2025 table expects:
// created_at = timestamp
// longitude  = integer
// latitude   = integer
// user_id    = integer

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.DATABASE_URL,
  process.env.DATABASE_KEY
);

export default async function handler(req, res) {
  const apiKey = req.headers['authorization']?.split(' ')[1];
  if (apiKey !== process.env.LOCATION_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  } 

  try {
    if (!req.body || !Array.isArray(req.body) || locations.length === 0) {
      return res.status(405).json({ error: 'No locations shared' });
    }

    const data = req.body
    console.log('Received JSON:', data);

    let rows = data.map(loc => ({
      longitude   : loc.geometry.coordinates[0],
      latitude    : loc.geometry.coordinates[1],
      created_at  : loc.properties.timestamp,
      user_id     : parseInt(loc.properties.device_id || 0)
    }));


    const { error } = await supabase.from('trackings').insert(rows);
    if (error) throw error;

    // OVERLAND client expects result ok
    res.status(200).json({ result: 'ok'});
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }

}