"use client"
import { useState, useEffect, useTransition, useContext } from "react"
import { LayoutContext } from "@/components/client/contexts"
import { db_client } from "@/lib/client/client_db"
import { useRouter } from "next/navigation"
import { SwitchTT, Tooltip } from "@/components/client/ui"
import { addFriendEmail, UpdateSharingBatch } from "@/lib/shared/db_rpcs"
import styles from '@/styles/Friends.module.css'

export function FriendCard( {friend_id, youShare, theyShare, addUpdate} ) {
    const [userShare, setUserShare] = useState(youShare);

    function handleChange(value) {
        setUserShare(value)
        addUpdate(friend_id, value)
    }

    return (
        <tr className={styles.FriendRow}>
            <td>{friend_id}</td>
            <td>
                <SwitchTT
                    value={userShare}
                    onChange={handleChange}/>
            </td>
            <td>{theyShare? "True" : "False"}</td>
            <td><button>Remove friend</button></td>
        </tr>
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



    // TODO: Make it so flipping a switch is not an immediate database entry and instead saves on page exits

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
            {context.friends.accepted.length > 0  && 
                <table className={styles.FriendTable}>
                <colgroup>
                <col style={{ width: "30%" }}/><col style={{ width: "15%" }}/><col style={{ width: "20%" }}/><col style={{ width: "15%" }}/>
                </colgroup>
                <thead>
                    <tr className={styles.FriendRow}>
                        <th>Username</th>
                        <th>Share Location</th>
                        <th>Receiving Location</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {context.friends.accepted.map((friend, i) => (
                        <FriendCard 
                            key={i}
                            friend_id={friend.friend_id}
                            addUpdate={appendUpdate}
                            youShare={friend.user_shares}
                            theyShare={friend.friend_shares}
                        />
                    ))}
                </tbody></table>}

            {context.friends.received.length > 0  && 
            <div>hi</div>}

            <Tooltip tip={'gh'} width={100} height={100}/>
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