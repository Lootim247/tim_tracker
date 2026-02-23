"use client"
import { useState, useEffect, useTransition, useContext, useRef } from "react"
import { LayoutContext } from "@/components/client/contexts"
import { db_client } from "@/lib/client/client_db"
import { useRouter } from "next/navigation"
import { SwitchTT, Tooltip } from "@/components/client/ui"
import { addFriendEmail, UpdateSharingBatch } from "@/lib/shared/db_rpcs"
import { SignedImage } from "@/components/client/ui"
import styles from '@/styles/Friends.module.css'
import { RowingSharp } from "@mui/icons-material"
import { ListItem } from "@mui/material"

export function FriendRequest( {name, friend_id} ) {
    return (
        <div className={styles.FriendRequest}>
            {name}
            <div>
                <button className={styles.RemoveButton}>X</button>
                <button className={styles.AcceptButton}>Accept</button>
            </div>
        </div>
    )
}

export function CustomTable({rows, appendUpdate}) {
    function Row( {friend_id, title, youShare, theyShare, addUpdate } ) {
        const startRef = useRef(youShare);
        const [userShare, setUserShare] = useState(youShare);
        
        function handleChange(value) {
            setUserShare(value)
            // addUpdate(friend_id, value)
        }
        
        return (
            <div className={startRef.current === userShare ? styles.Row : styles.RowChanged}>
                <div style={{width : '40%'}} className={styles.FirstCol}>{title}</div>
                <div style={{width : '20%'}} className={styles.Col}>
                    <SwitchTT
                    value={userShare}
                    onChange={handleChange}/>
                </div>
                <div style={{width : '20%'}} className={styles.Col}>
                    {theyShare? "True" : "False"}
                </div>
                <div style={{width : '20%'}} className={styles.LastCol}>
                    Remove friend
                </div>
            </div>
        )
    }

    return (
        <div className={styles.Table}>
            <div className={styles.TableHeader}>
                <div style={{ width: "40%" }}>Username <Tooltip width={30} height={30} tip={'hi'}/></div>
                <div style={{ width: "20%" }}>Share Location</div>
                <div style={{ width: "20%" }}>Receive Location</div>
                <div style={{ width: "20%" }}></div>
            </div>
            {rows.map((row, i)=> (
                <Row
                key={i}
                title={row.title}
                friend_id={row.friend_id}
                addUpdate={appendUpdate}
                youShare={row.user_shares}
                theyShare={row.friend_shares}/>
            ))}
        </div>
    ) 
}

export default function FriendPage() {
    /*
    * TODO:
    *   - Users should be able to toggle settings as needed (currently switches do nothing)
    *   - Users should be able to remove friends
    *   - Friends should be arranged in a simple card format that labels each column and setting
    *   - Label row should stick to the top of the screen on scroll. Info tips should be included
    */
    const router = useRouter();
    const context = useContext(LayoutContext)
    console.log(context)
    

    // test context:
    // const context = {
    //     user : null,
    //     friends : {
    //         accepted : [
    //             {
    //                 title : "tim",
    //                 friend_id : 1,
    //                 user_shares : true,
    //                 friend_shares : true
    //             },
    //             {
    //                 title : "ray",
    //                 friend_id : 2,
    //                 user_shares : true,
    //                 friend_shares : true
    //             }
    //         ],
    //         received : [
    //             {
    //                 title : 'guy',
    //                 friend_id : 3
    //             }
    //         ]
    //     }
    // }
    const [email, setEmail] = useState("")
    const [error, setError] = useState(null);
    const [isPending, startTransition] = useTransition();
    const [updates, setUpdates] = useState(()=> new Map());

    function appendUpdate(friendId, status) {
        setUpdates(prev => {
            const next = new Map(prev);
            next.set(friendId, status);
            return next;
        });
    }

    async function flushUpdates() {
        if (updates.size === 0) return;

        const payload = Array.from(updates.entries()).map(
            ([friend_id, status]) => ({ friend_id, status })
        );

        const res = await UpdateSharingBatch(db_client, payload);
        
        if (res.length === 0) {
            setUpdates(()=> new Map())
        }
    }


    useEffect(() => {
        return () => {
            flushUpdates();
        };
    }, []);

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (updates.size !== 0) {
                flushUpdates();
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
    }, [updates])

    function handleAddFriend(e) {
        e.preventDefault();
        setError(null);
        startTransition(async () => {
            const res = await addFriendEmail(db_client, context.user, email);
            if (res?.error) {
                setError(res.error);
            } else {
                router.refresh();
            }
        });
    }

    return (
        <div className={styles.Wrapper}>
        
        <div className={styles.Content}>
            {context.friends?.accepted?.length > 0  && <CustomTable rows={context.friends.accepted} appendUpdate={appendUpdate}/>}

            {(context.friends?.accepted?.length == 0 || !context.friends?.accepted) &&
            <div className={styles.NotificationBox}>No friends yet! Add some using email!</div>}

            {context.friends?.received?.length > 0  && 
            context.friends.received.map((friend, i) => (
                <FriendRequest
                    key={i}
                    name={friend.title}
                    friend_id={friend.friend_id}
                />
            ))}

            {(context.friends?.received?.length == 0 || !context.friends?.received) &&
            <div className={styles.NotificationBox}>No friend requests.</div>}
        </div>
        <div className={styles.BottomBar}>
            <form onSubmit={handleAddFriend}>
                {error && <div>{error}</div>}
                <label>Add your friend!</label>
                <input 
                    name="email"
                    placeholder="Enter their email" 
                    onChange={(e)=>{setEmail(e.target.value)}}
                    required
                />
                <button type="submit">add</button>
            </form>
            <button onClick={flushUpdates} disabled={updates.size === 0}>
                Save changes
            </button>
        </div>

        
        </div>
    )
}