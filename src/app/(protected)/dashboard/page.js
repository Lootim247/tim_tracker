"use client"
import styles from '@/styles/Home.module.css'
import { LayoutContext, HomeProvider, HomeContext } from '@/components/client/contexts'
import dayjs from 'dayjs'
import { useState, useContext, useEffect, useRef } from 'react'
import { DateSelectorTT } from '@/components/client/ui'
import { UserSelector,SideBar } from '@/components/client/home_ui'
import { Button } from '@mui/material'
import { tracking_LRUCache } from '@/lib/shared/trackings_cache'

import MapView from '@/components/client/MapBox'
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { db_client } from '@/lib/client/client_db'
import { trackingsToFeatureCollection } from '@/lib/shared/points'
import { getTrackingsByTimeUID } from '@/lib/shared/db_rpcs'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function HomePage() {
    const context = useContext(LayoutContext);
    
    const mapRef = useRef(null);
    
    const [date, setDate] = useState(() => dayjs());
    const [user, setUser] = useState(context.user);
    const [barPos, setBarPos] = useState(0);
    const [sideBar, setSideBar] = useState(true);
    const [mapPos, setMapPos] = useState({longitude: 0, latitude : 0})
    const [mapLoaded, setMapLoaded] = useState(false);

    console.log("All States:")
    console.log(`
        user : ${user}
        date : ${date}
        barPos : ${barPos}
        Side Bar Open : ${sideBar}
        `)

    // Close bar when there is no user selected
    useEffect(()=>{
        if (!user) {
            setSideBar(false);
        } else {
            setSideBar(true);
        }
    },[user])

    useEffect(() => {
        mapRef.current?.onLoad(() => {
            setMapLoaded(true)
        });
    }, []);

    // update what data is shown on the map
    useEffect(() => {
        console.log("run")
        if (!mapLoaded) return;

        if (!user) {
            mapRef.current?.clearUserDate();
            return;
        }

        let cancelled = false;

        async function run() {

            function key(date, user) {
                return `${date}-${user}`
            }

            const cached = tracking_LRUCache.get(key(date, user));
            let data = cached;

            if (!data) {
                const startTime = `${date.format("YYYY-MM-DD")} 00:00:00+00`;
                const endTime   = `${date.format("YYYY-MM-DD")} 23:59:59+00`;

                try {
                    const trackings = await getTrackingsByTimeUID(
                    db_client,
                    startTime,
                    endTime,
                    user
                    );

                    data = trackingsToFeatureCollection(trackings);
                    tracking_LRUCache.set(key(date, user), data);
                } catch (err) {
                    console.error(err);
                    data = { type: "FeatureCollection", features: [] };
                }
            }

            if (!cancelled) {
                mapRef.current?.setNewUserDate(data);
            }

        }

        run();

        return () => {
            cancelled = true;
        };
    }, [user, date, mapLoaded]);


    return (
        <HomeProvider 
            value={{user : {get : user, set : setUser},
                    date : {get: date, set: setDate},
                    barPos : {get : barPos, set: setBarPos},
                    mapPos : {get : mapPos, set: mapPos}}}>
        <div className={styles.Wrapper}>
            {/* TODO: SideBar must pop out when pressing the hamburger menu. 
                It should also take in the user and date and interact smoothly with the map
                    Functions:
                        - If a user selects a user to view, that users name, profile picture, and related stories should be shown
                        - If a user thumbs through a story the map should pan to the location of each picture
                        
            (hamburger menu must be moved to bottom bar or be activated conditionally only on home page) */}
            {sideBar?<div className={styles.SideBar}>
                {sideBar? 'Sidebar Open': 'Sidebar Closed'}
                <SideBar/>
            </div> : <></>}

            {/* TODO: This column must take up the entire page */}
            <div className={styles.Column}>
                {/* TODO: The map component should receive user and appropriate date information
                    Functions:
                        - Should be well styled and pan to the selected users current position smoothly
                        - The selected users trail should be shown if allowed
                        - A users tracking information should only be kept as long as they allow (and only be shown for a chosen amount of days)
                        - When no user is selected the map should show all users current location without trails similar to find my
                */}
                <div className={styles.Map}>Map Component</div>
                {/* TODO: Bottom bar must provide the given user information and related date
                    Functions:
                        - Allow selection of date (only when a specific user is selected)
                        - Get a specific User and allow deselection of all users.
                */}
                <MapView ref={mapRef}/>
                <div className={styles.BottomBar}>
                    {sideBar && <div className={styles.sideBarPlaceholder}/>}
                    <div className={styles.SelectionComponents}>
                        <DateSelectorTT
                            value={date}
                            onChange={setDate}/>
                        <UserSelector
                            maxItems={5}/>
                        <Button onClick={()=>setUser(null)}>X</Button>
                    </div>
                </div>
            </div>
        </div>
        </HomeProvider>
    )
}