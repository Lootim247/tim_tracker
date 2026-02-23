import { useState, useActionState, useEffect } from "react"
import { newAPIkeyAction } from "@/lib/server/actions";
import { logout } from "@/lib/client/auth";
import styles from '@/styles/Settings.module.css'
import { ImageUpload } from "./ui";


export function EditProfile() {

    // const [file, setFile] = useState(undefined);
    // console.log(file)

    const [raw, setRaw] = useState(null);
    
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setRaw(file);
        }
    };

    return (
        <div>
            <div className={styles.SettingGroup}>
                <div className={styles.big_text}>Account Settings</div>
                <div className={styles.divider}></div>
                <div className={styles.small_text}>Choose</div>
                <ImageUpload type={'profile-picture'}/>
                <button className={styles.SettingButton}>Hi</button>
            </div>
        </div>
    )
}

export function AccountSettings() {
    return (
        <div>
            <div className={styles.SettingGroup}>
                <div className={styles.big_text}>Delete your Account</div>
                <div className={styles.divider}></div>
                <div className={styles.small_text}>Warning, there is no way to undo this action.</div>
                <button className={styles.SettingButton}>Delete Account</button>
            </div>
            <button
            onClick={async () => {
                        try {
                        console.log("starting logout")
                        await logout();
                        router.push('/enter')
                        router.refresh()
                        } catch (err) {
                        console.error("Logout failed:", err);
                        }
                    }}>Log Out</button>
            
        </div>
        
    )
}

export function Location() {
    const [state, formAction] = useActionState(newAPIkeyAction, null);
    return (
        <div>
            <div className={styles.SettingGroup}>
                <div className={styles.big_text}>Location Provider</div>
                <div className={styles.divider}></div>
                <div className={styles.small_text}>Choose</div>
                <button className={styles.SettingButton}>Hi</button>
            </div>

            <div className={styles.SettingGroup}>
                <div className={styles.big_text}>Clear Application Cache</div>
                <div className={styles.divider}></div>
                <div className={styles.small_text}>Allows you to manually clear the cache of an application. Warning, any location data sent in the next 5 minutes will be ignored.</div>
                <button className={styles.SettingButton}>Clear cache data</button>
            </div>

            <div className={styles.SettingGroup}>
                <div className={styles.big_text}>Generate a new App Key</div>
                <div className={styles.divider}></div>
                <div className={styles.small_text}>Generating this new key will make the old key no longer work. After generation remember the password, there is no way to see it again.</div>
                <form action={formAction}>
                    <button type="submit">Generate New Key</button>

                    {state?.apiKey && (
                    <p>
                        <strong>New API Key:</strong> {state.apiKey}
                    </p>
                    )}

                    {state?.error && <p style={{ color: "red" }}>{state.error}</p>}
                </form>
            </div>
        </div>
    )
}

export function OtherSettings() {
    

    return (
        <div>Misc?</div>
    )
}