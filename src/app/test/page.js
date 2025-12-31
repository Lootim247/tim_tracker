"use client"
import { ButtonTT } from "@/components/client/ui"

export default function ComponentTestPage() {
    return (
        <ButtonTT
            onclick={()=>{alert('hi')}}
            text='hi'/>
    )
}