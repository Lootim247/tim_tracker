'use client'
import { SignedImage } from "@/components/client/ui"

export default function StoryPage() {
    /*
    * TODO: TONS!!!!
    * Features required:
    *       - Story creation (specify consumers, labels)
    *       - Story management (permissions, friend settings)
    *       - Story addition (adding photos (upload?, in browser?), descriptions?)
    */
    return (
        <div>
            <div>Story Page</div>
            <SignedImage owner={'e6826392-a369-457d-a38f-bc1cd56c700e'} type={'profile-picture'} width={100} height={100}/>
        </div>
    )
}