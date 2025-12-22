"use client"

import { useState, useTransition } from "react";
// import { login } from "@/lib/server/auth";

export default function LoginForm() {
    const [pword, setPword] = useState("")
    const [email, setEmail] = useState("")
    const [error, setError] = useState(null);
    const [isPending, startTransition] = useTransition();

    // validate the users input
    function validate() {
        if (!email.includes("@")) {
        return "Invalid email address";
        }
        if (pword.length < 8) {
        return "Password must be at least 8 characters";
        }
        return null;
    }

    async function handleLogin(params) {
        return
    }

    return (
        <form onSubmit={handleLogin}>
            <label>Email</label>
            <input 
                name="email"
                placeholder="Enter your email." 
                onChange={(e)=>{setEmail(e.target.value)}}
                required
            />

            <label>Password</label>
            <input 
                type="password"
                name="password"
                onChange={(e)=>{setPword(e.target.value)}}
                placeholder="Enter your password." 
                required
            />
            <button type="submit">Login</button>
        </form>
    );
}