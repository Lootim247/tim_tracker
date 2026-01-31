'use client'
import { SignedImage } from "@/components/client/ui"
import { useState } from "react"

export default function StoryPage() {
    const [stories, setStories] = useState(null)

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
    * 
    * 
    */
    return (
        <div>
            <div>Story Page</div>
            {stories?.map((item)=>(
                <div key={item}></div>
            ))}
            <button>Create new story</button>
        </div>
    )
}