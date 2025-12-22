"use server"
import "server-only"
import { createServerSupabase } from "@/lib/server/server_db"

export const login = async (email, password) => {
    return
}

export const logout = async (params) => {
    return
}

export async function signup(email, password) {
    const db = createServerSupabase();

    return db.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: "/tim-tracker" },
    });
}
