"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { EditProfile, Location, OtherSettings, AccountSettings } from "@/components/client/setting_pages";
import styles from '@/styles/Settings.module.css'

const ComponentMapping = new Map([
  ['Profile' , <EditProfile key={1}/>],
  ['Location', <Location key={2}/>],
  ['Account', <AccountSettings key={4}/>],
  ['Misc', <OtherSettings key={3}/>]
])


export default function SettingsPage() {
  /*
  * TODO:
  * This page needs data deletion permissions, the user should be able to 
  * delete any tracking at any time.
  */

  const router = useRouter()
  const [value, setValue] = useState('Profile')

  const keys = Array.from(ComponentMapping.keys());

  return (
    <div className={styles.Wrapper}>
      <div className={styles.SideBar}>
        {keys.map((key, i)=>(
          <button onClick={()=>(setValue(key))} key={i}>{key}</button>
        ))}
      </div>
      <div className={styles.Content}>{ComponentMapping.get(value)}</div>
    </div>
  );  
}
