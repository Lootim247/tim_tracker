// Depends on SUPABASE trackings table
// 12/1/2025 

// table expects:
// created_at = timestamp
// longitude  = float
// latitude   = float
// user_id    = integer

import { db } from '@/lib/db/server'

export default async function handler(req, res) { 
  const DIST_THRESH = 0.01;

  
  // Calculates distance between two points "as the crow flies"
  // returns distance in kilometers
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers

    // Helper function to convert degrees to radians
    function degToRad(deg) {
      return deg * (Math.PI / 180);
    }

    const dLat = degToRad(lat2 - lat1);
    const dLon = degToRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  }



  const apiKey = req.headers['authorization']?.split(' ')[1];
  console.log(apiKey)
  if (apiKey !== process.env.LOCATION_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    try {
      const data = req.body.locations
      const num_data = req.body.locations.length

      if (!data || !Array.isArray(data) || data.length === 0) {
        return res.status(400).json({ error: 'No locations shared' });
      }

      let filteredRows = data.reduce((acc, loc, i) => {
        const row = {
          longitude: loc.geometry.coordinates[0],
          latitude: loc.geometry.coordinates[1],
          created_at: loc.properties.timestamp,
          user_id: parseInt(loc.properties.device_id || 0)
        };

        const last = acc[acc.length - 1];
        if (last) {
          if (DIST_THRESH <= calculateDistance(row.latitude, row.longitude, last.latitude, last.longitude)) {
            return acc;
          }
        }

        acc.push(row);
        return acc;
      }, []);

      const { error } = await db.from('trackings').insert(filteredRows);
      console.error(error)
      if (error) throw error;

      // OVERLAND client expects result ok
      res.status(200).json({ result: 'ok'});
    } catch (err) {
      console.error('Server error:' + err.message)
      res.status(500).json({ error: 'Server error:' + err.message });
    }
  }

  return res.status(405).json({ error: `Method not authorized` });

  
}