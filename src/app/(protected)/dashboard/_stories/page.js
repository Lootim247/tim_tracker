'use client'
import { SignedImage, ImageUpload } from "@/components/client/ui"
import { useState, useRef, useEffect, useContext } from "react"
import { CreateStory } from "@/lib/shared/db_rpcs"
import { db_client } from "@/lib/client/client_db"
import { LayoutContext } from "@/components/client/contexts"
import styles from '@/styles/Stories.module.css'


function FriendCheck({ friend_obj, set }) {
    const [used, setUsed] = useState(set.current.has(friend_obj.friend_id))

    console.log(`${friend_obj.title} is${used ? '' : ' not'} included in this story`)

    useEffect(()=>{
        if (used) {
            set.current.add(friend_obj.friend_id)
        } else if (set.current.has(friend_obj.friend_id)) {
            set.current.delete(friend_obj.friend_id);
        }
    }, [used, friend_obj, set])

    console.log(friend_obj)
    return (
        <div className={used ? styles.FriendRowActive : styles.FriendRow} onClick={()=>setUsed(!used)}>
            <p>{friend_obj.title}</p>
        </div>
    )
}

function CreateStoryComponent({}) {
    const layoutContext = useContext(LayoutContext);
    const friends = layoutContext?.friends?.accepted;

    const [title, setTitle] = useState('');
    console.log(title)
    const [selectingPeople, setSelectingPeople] = useState(false);
    const set = useRef(new Set([]));

    async function handleSubmit() {
        try {
            await CreateStory(db_client, title, set.current.keys())
        } catch (e) {
            throw e;
        }
    }

    return (
        <div>
            <label>Cover Photo</label>
            <ImageUpload type={'profile-picture'}/>
            <label>Story Title</label>
            <input type={'text'} placeholder={'What is the title?'} value={title} onChange={e=>setTitle(e.target.value)}/>
            <div>
                <button onClick={()=>setSelectingPeople(!selectingPeople)}>Select people!</button>
                {selectingPeople &&
                <div className={styles.FriendContainer}>
                    {friends.map((item, i)=>(
                        <FriendCheck key={i} friend_obj={item} set={set}/>
                    ))}
                </div>}
            </div>
            <button className={styles.AcceptButton} onClick={handleSubmit}>Create Story</button>
        </div>
    )
}


export default function StoryPage() {
    const layoutContext = useContext(LayoutContext);
    console.log(layoutContext)
    const [stories, setStories] = useState(null);
    const [creatingStory, setCreatingStory] = useState(false);
    
    /*
    * TODO: TONS!!!!
    * Features required:
    *       - Story creation (specify consumers, labels)
    *       - Story management (permissions, friend settings)
    *       - Story addition (adding photos (upload?, in browser?), descriptions?)
    */

    /*
    * Backend Pieces:
    * create story.
    * get stories.
    * edit stories. 
    */    
    return (
        <div>
            <div>Story Page</div>

            {creatingStory && <CreateStoryComponent/>}
            <button onClick={()=>{setCreatingStory(!creatingStory)}}>Create new story</button>

            {}

            <div>{}</div>
        </div>
    )
}