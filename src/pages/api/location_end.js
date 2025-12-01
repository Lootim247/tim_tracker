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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  } 

  try {
    if (!req.body || !Array.isArray(locations) || locations.length === 0) {
      return res.status(405).json({ error: 'No locations shared' });
    }

    const data = req.body
    let location_data = []
    console.log('Received JSON:', data);
    data.map(loc => ({
      long        : loc.geometry.coordinates[0],
      lat         : loc.geometry.coordinates[1],
      timestamp   : loc.properties.timestamp,
      id          : loc.properties.device_id,
    }));


    const { error } = await supabase.from('trackings').insert(rows);
    if (error) throw error;

    // OVERLAND client expects result ok
    res.status(200).json({ result: 'ok'});
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }

}