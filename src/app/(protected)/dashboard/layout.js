"use server"
import "server-only"
import { TabBar } from "@/components/client/ui"

export default async function MainLayout({ children }) {
    return (
        <>
            <TabBar/>
            {children}
        </>
    )
}
