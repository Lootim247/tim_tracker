"use client"
import { useState } from "react"
import { ButtonTT, SwitchTT } from "./ui"

export function FriendCard( {friend_id, youShare, theyShare} ) {
    const [userShare, setUserShare] = useState(youShare)
    const [friendShare, setFriendShare] = useState(theyShare)

    // TODO: needs functunality to change sharing permission

    return (
        <div>
            {friend_id},
            Share Location?
            <SwitchTT
                value={userShare}
                onChange={setUserShare}/>
            {theyShare? "receiving" : "not receiving"} location
            <ButtonTT
                text={"remove friend"}/>
        </div>
    )
}