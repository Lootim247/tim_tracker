"use server"
import "server-only"
import { createServerSupabase } from "./server_db";
import { newAPIkey } from "../shared/APIkey";
import { getAuthenticatedUser } from "./auth";

// server action
export async function newAPIkeyAction() {
    try {  
        const user = await getAuthenticatedUser();
        if (!user) throw new Error("No user signed in");

        const server_db = await createServerSupabase();

        const result = await newAPIkey(user.id, server_db);
        return result;
    } catch (err) {
        console.error("newAPIkeyAction error:", err);
        throw err;
    }
}
