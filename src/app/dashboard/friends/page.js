"use client"
import { useState, useEffect, useTransition, useContext } from "react"
import { LayoutContext } from "@/components/client/layout-context"
import { db_client } from "@/lib/client/client_db"
import { getUser } from "@/lib/client/auth"
import { FriendCard } from "@/components/client/cards"
import { useRouter } from "next/navigation"
import { getRelatedUsers, addFriendEmail } from "@/lib/shared/db_rpcs"

export default function FriendPage() {
    const router = useRouter();
    const context = useContext(LayoutContext)
    console.log(context)
    const [email, setEmail] = useState("")
    const [error, setError] = useState(null);
    const [shares, setShares] = useState(false);
    const [isPending, startTransition] = useTransition();

    function handleLogin(e) {
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
        <div>
        {context.friends.received.length > 0  && 
        <div>hi</div>}
        {context.friends.accepted.length > 0  && 
        <div>
        {context.friends.accepted.map((friend, i) => (
            <FriendCard 
                key={i}
                friend_id={friend.friend_id}
                youShare={friend.user_shares}
                theyShare={friend.friend_shares}
            />
        ))}
        </div>}


        <form onSubmit={handleLogin}>
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
        </div>
    )
}