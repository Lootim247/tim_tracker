"use client"
import { useState, useEffect } from "react";
import MapboxMap from "../components/MapBox";
import {styles} from "@/styles/Home.module.css"

export default function MapPage() {
  const [geoJSON, setJSON] = useState({type : "FeatureCollection", features: []})
  const [date, setDate] = useState(new Date().toDateString())

  useEffect(()=> {
    async function fetchTrackings() {
      const { getTrackingsByTimeUID } = await import("@/lib/db/trackings");
      const { db_client } = await import("@/lib/db/client_db");

      const startTime = `${date} 00:00:00+00`;
      const endTime   = `${date} 23:59:59+00`;
      const UID = 0

      try {
        const data = await getTrackingsByTimeUID(db_client, startTime, endTime, UID);
        console.log(data)

        if (!data || !Array.isArray(data)) {
          console.error("No data returned!")
          setJSON({type : "FeatureCollection", features: []})
          return
        }

        const json_feat = data.map((element) => ({
          type : "Feature",
          geometry : {
            type        : "Point",
            coordinates : [element.longitude, element.latitude]
          }
        }));

        setJSON({type : "FeatureCollection", features: json_feat})
      } catch (err) {
        console.error(err)
        setJSON({type : "FeatureCollection", features: []})
      }
    }

    fetchTrackings()
  }, [date])

  function changeDay(change) {
    const d = new Date(date);
    d.setDate(d.getDate() + change);
    setDate(d.toDateString())
  }

  return (
    <div>
      <div>
        <div onClick={() => {changeDay(-1)}}>{'<'}</div>
        <div>{date}</div>
        <div onClick={() => {changeDay(1)}}>{'>'}</div>
      </div>
      <MapboxMap geoJSON={geoJSON}/>
    </div>
    
  ) 
  
  
}
