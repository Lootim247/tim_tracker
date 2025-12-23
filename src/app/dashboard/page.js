"use client"
import { useState, useEffect } from "react";
import MapboxMap from "@/components/client/MapBox";
import {styles} from "@/styles/Home.module.css"
import Link from "next/link";
import { tracking_LRUCache } from "@/lib/shared/trackings_cache";
import { getTrackingsByTimeUID } from "@/lib/shared/db_rpcs";
import { db_client } from "@/lib/client/client_db";

export default function MapPage() {
  const [geoJSON, setJSON] = useState({type : "FeatureCollection", features: []})
  const [date, setDate] = useState(new Date().toDateString())

  // loads json data based on current date. Uses cache for jsonData to prevent
  // repeated unnecessary fetches. 
  useEffect(()=> {
    async function fetchTrackings() {
      const startTime = `${date} 00:00:00+00`;
      const endTime   = `${date} 23:59:59+00`;
      const UID = 0

      try {
        const data = await getTrackingsByTimeUID(db_client, startTime, endTime, UID);

        if (!data || !Array.isArray(data)) {
          console.error("No data returned!")
          setJSON({type : "FeatureCollection", features: []})
          return
        }

        // construct a json feature array from a days points
        const json_feat = {
          type: "FeatureCollection",
          features: [
            ...data.map(element => ({
              type : "Feature",
              geometry : {
                type        : "Point",
                coordinates : [element.longitude, element.latitude]
              },
              properties: {
                kind: "point"
              }
            })),

            {type : "Feature",
            geometry: {
              type: "LineString",
              coordinates: data.map(p => [p.longitude, p.latitude])
            },
            properties: {
              kind: "path"
            }}
          ]
        }

        setJSON(json_feat)
        tracking_LRUCache.set(date, json_feat)
      } catch (err) {
        console.error(err)
        setJSON({type : "FeatureCollection", features: []})
      }
    }

    // attempt to retrieve data from cache, manually retrieve on error
    try {
      setJSON(tracking_LRUCache.get(date))
    } catch (err) {
      fetchTrackings()
    }
  }, [date])

  // Simple change function enables day changes
  function changeDay(change) {
    const d = new Date(date);
    d.setDate(d.getDate() + change);
    setDate(d.toDateString())
  }

  return (
    <div>
      <Link href="/enter">/login</Link>
      {/* Day changer component */}
      <div>
        <div onClick={() => {changeDay(-1)}}>{'<'}</div>
        <div>{date}</div>
        <div onClick={() => {changeDay(1)}}>{'>'}</div>
      </div>

      {/* Map loader */}
      <MapboxMap geoJSON={geoJSON}/>
    </div>
  )   
}
