"use client"

import { useState, useTransition } from "react";
import { login } from "@/lib/client/auth";
import { useRouter } from "next/navigation";

export default function LoginForm() {
    const router = useRouter();
    const [pword, setPword] = useState("")
    const [email, setEmail] = useState("")
    const [error, setError] = useState(null);
    const [isPending, startTransition] = useTransition();

    function handleLogin(e) {
        e.preventDefault();
        setError(null);

        startTransition(async () => {
            const res = await login(email, pword);
            if (res?.error) {
                setError(res.error);
            } else {
                router.push("/dashboard");
                router.refresh();
            }
        });
    }

    return (
        <form onSubmit={handleLogin}>
            {error && <div>{error}</div>}
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