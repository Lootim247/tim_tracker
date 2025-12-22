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
        if (map.getSource("points-source")) {
          map.getSource("points-source").setData(geoJSON);
          map.getSource("line-source").setData(geoJSON);
        } else {
          map.addSource("points-source", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: geoJSON.features.filter(f => f.geometry.type === "Point")
            },
            cluster: true,
            clusterRadius: 30,
          });

          map.addSource('line-source', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: geoJSON.features.filter(f => f.geometry.type === "LineString")
            }
          });

          map.addLayer({
            id: "line-layer",
            type: "line",
            source: "line-source",
            filter: ["==", ["geometry-type"], "LineString"],
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#ff0000",
              "line-width": 4,
            },
          });

          map.addLayer({
            'id': 'circle-layer',
            'type': 'circle',
            'filter': ["all", ["has", "point_count"], ['>', 'point_count', 4]],
            'source': 'points-source',
            'paint': {
              'circle-radius': 15,
              'circle-color': '#007cbf'
            }
          });

          map.addLayer({
            id: 'cluster-count',
            type: 'symbol',
            source: 'points-source',
            'filter': ["all", ["has", "point_count"], ['>', 'point_count', 4]],
            layout: {
                'text-field': ['get', 'point_count_abbreviated'],
                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                'text-size': 12
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
