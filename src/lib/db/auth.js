"use server"
import { createServerSupabase } from "@/lib/db/server"

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
