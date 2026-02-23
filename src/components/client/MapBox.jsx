"use client";

import { forwardRef, useImperativeHandle, useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const MapView = forwardRef(function MapView(props, ref) {
  const containerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    const mb = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-71.0589, 42.3601],
      zoom: 12,
    });

    mb.addControl(new mapboxgl.NavigationControl(), "top-right");

    function initial_load() {
      mb.addSource("points-source", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: []
        },
        cluster: true,
        clusterRadius: 30,
      });

      mb.addSource('line-source', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });

      mb.addLayer({
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

      mb.addLayer({
        'id': 'circle-layer',
        'type': 'circle',
        'source': 'points-source',
        'paint': {
          'circle-radius': 15,
          'circle-color': '#007cbf'
        }
      });

      mb.addLayer({
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

    mapInstanceRef.current = mb;

    if (!mb.loaded()) {
      mb.once("load", initial_load)
    } else {
      load_layer()
    }

    return () => {
      mb.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      onLoad(cb) {
        if (!mapInstanceRef.current) return;

        if (mapInstanceRef.current.loaded()) {
          cb(mapInstanceRef.current);
        } else {
          mapInstanceRef.current.once("load", () => {
            cb(mapInstanceRef.current);
          });
        }
      },
      
      flyTo(coords, zoom) {
        mapInstanceRef.current?.flyTo({
          center: coords,
          zoom,
        });
      },

      setZoom(zoom) {
        mapInstanceRef.current?.setZoom(zoom);
      },

      getCenter() {
        return mapInstanceRef.current?.getCenter();
      },

      resize() {
        mapInstanceRef.current?.resize();
      },

      removeSource(id) {
        mapInstanceRef.current?.removeSource();
      },

      addSource(id, source) {
        mapInstanceRef.current?.addSource(id, source)
      },

      clearUserDate() {
        const lineSource = mapInstanceRef.current.getSource("line-source");
        const pointSource = mapInstanceRef.current.getSource("points-source");

        lineSource.setData({
          type: "FeatureCollection",
          features: []
        })

        pointSource.setData({
          type: "FeatureCollection",
          features: []
        })
      },

      setNewUserDate(geoJson) {
        if (!mapInstanceRef.current) return;

        const lineSource = mapInstanceRef.current.getSource("line-source");
        const pointSource = mapInstanceRef.current.getSource("points-source");

        if (!lineSource || !pointSource) return;

        lineSource.setData({
          type: "FeatureCollection",
          features: geoJson?.features.filter(
            f => f.geometry.type === "LineString"
          ),
        });

        pointSource.setData({
          type: "FeatureCollection",
          features: geoJson?.features.filter(
            f => f.geometry.type === "Point"
          ),
        });
      }

    }),
    []
  );

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
});

export default MapView;