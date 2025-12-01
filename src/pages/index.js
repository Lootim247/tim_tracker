import { useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";

export default function Home() {
  useEffect(() => {
    const sendLocation = async () => {
      try {
        const res = await fetch('tim-tracker/api/location_end', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer qwertyuiopasdfghjkl'
          },
          body: JSON.stringify({
            locations: [
              {
                geometry: { type: 'Point', coordinates: [-122.03, 37.33] },
                properties: { timestamp: '2025-12-01T14:00:00Z', device_id: '0' }
              }
            ]
          })
        });

        const data = await res.json();
        console.log('API response:', data);
      } catch (err) {
        console.error('Error sending location:', err);
      }
    };

    sendLocation();
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Home</title>
      </Head>
      <h1>Home Page</h1>
      <p>Sending test location to API...</p>
    </div>
  );
}
