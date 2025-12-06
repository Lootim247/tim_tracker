"use client";

import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function MapboxMap( {geoJSON} ) {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null)

  useEffect(() => {
    if (!mapboxgl.accessToken) {
      console.error("Missing NEXT_PUBLIC_MAPBOX_TOKEN");
      return;
    }

    const mb = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-71.0589, 42.3601],
      zoom: 12,
    });

    mb.addControl(new mapboxgl.NavigationControl(), "top-right");

    setMap(mb)

    return () => mb.remove();
  }, []);

  useEffect(() => {
    if (!map || !mapContainerRef) return 

    // load a mapbox layer using geojson data served from my API endpoint. 
    const load_layer = async () => {
      try {
        if (map.getSource("geojson-source")) {
          map.getSource("geojson-source").setData(geoJSON);
        } else {
          map.addSource('geojson-source', {
            'type': 'geojson',
            'data': geoJSON
          });

          map.addLayer({
            'id': 'circle-layer',
            'type': 'circle',
            'source': 'geojson-source',
            'paint': {
              'circle-radius': 6,
              'circle-color': '#007cbf'
            }
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
      }
    }
    
    if (!map.loaded()) {
      map.once("load", load_layer)
    } else {
      load_layer()
    }
    
  }, [map, geoJSON]);

  return (
    <div
      ref={mapContainerRef}
      style={{ width: "100%", height: "100vh" }}
    />
  );
}
