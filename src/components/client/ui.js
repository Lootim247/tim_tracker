"use client"
import { usePathname } from 'next/navigation';
import styles from '@/styles/Components.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { Switch } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { useState, useEffect } from 'react';
import { image_LRUCache } from '@/lib/client/image_cache';

const pathMapping = {
    'home' : '/dashboard',
    'settings' : '/dashboard/settings',
    'friends' : '/dashboard/friends',
    'stories' : '/dashboard/stories'
}

function StyledTab({pathKey, title, curr_path}) {
    let tab_style = styles.Tab
    if (curr_path == pathMapping[pathKey]) {
        tab_style = styles.ActiveTab
    }
    
    return (
        <div className={tab_style}>
            <Link href={pathMapping[pathKey]}>
                <div>{title}</div>
            </Link>
        </div>
    )
}

export function TabBar() {
    const pathname = usePathname()
    return(
        <div className={styles.TabContainer}>
            {/* Navigation menu */}
            <div className={styles.NavigationGroup}>
                {/* Tabs */}
                <StyledTab pathKey={'home'} title={'Map'} curr_path={pathname}/>
                <StyledTab pathKey={'friends'} title={'Friends'} curr_path={pathname}/>
                <StyledTab pathKey={'stories'} title={'Stories'} curr_path={pathname}/>
            </div>

            {/* Logo */}
            <div className={styles.Logo}>Website Logo</div>

            {/* Settings */}
            <Link
                href={pathMapping['settings']}
            >
                <Image 
                src={'icons/settings.svg'}
                alt='Settings'
                width={50}
                height={50}/>
            </Link>
            
        </div>
    )
}

export function DateSelectorTT({value, onChange }) {
    return (
        <DatePicker
            views={["year", "month", "day"]}
            value={value}
            onChange={onChange}
        />
    )
}

export function Tooltip({tip, width, height}) {    
    return (
        <div className={styles.Tooltip}>
            <div className={styles.TooltipText}> {tip} </div>
            <Image 
            src={'icons/info.svg'}
            width={width}
            height={height}
            alt='tip'/>
        </div>
    )
}

export function SignedImage({ owner, type, width, height }) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    let alive = true;

    image_LRUCache.get(owner, type).then((u) => {
      if (alive) setUrl(u);
    });

    return () => {
      alive = false;
    };
  }, [owner, type]);

  if (!url) return <div style={{ width, height, background: "#eee" }} />;

  return (
    <Image
      src={url}
      width={width}
      height={height}
      alt=""
      unoptimized
    />
  );
}

// export function ProfilePhoto({ owner, type, width, height }) {
//     return (
//         <div className={styles.ImageWrapper}>
//             <SignedImage
//             owner={owner}
//             type={type}
//             width={width}
//             height={height}/>
//         </div>
        
//     )
// }

export function ButtonTT({onclick, text}){
    return (<button className={styles.button} onClick={()=>{onclick()}}>{text}</button>)
}

export function SwitchTT({ value, onChange, disabled = false }) {
    return (
        <Switch
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        />
    )
}