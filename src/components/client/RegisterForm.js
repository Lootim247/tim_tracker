"use client"

import { useState, useTransition } from "react";
import { signup } from "@/lib/server/auth";

export default function RegisterForm() {
    const [pword, setPword] = useState("")
    const [confirmPW, setConfirmPW] = useState("")
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
        if (confirmPW !== pword) {
        return "Passwords do not match";
        }
        return null;
    }

    function handleSubmit(e) {
        e.preventDefault();
        console.log("submitting")
        const validationError = validate();
        if (validationError) {
        setError(validationError);
        return;
        }

        console.log("no errors")
        setError(null);

        startTransition(async () => {
            console.log("trying signup")
            const res = await signup(email, pword);
            console.log("done signup")
            if (res?.error) {
                console.log(res.error)
                setError(res.error);
            }
        });
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Email</label>
                {error && <div>{error}</div>}
                <input 
                    type="email" 
                    name="email"
                    onChange={(e)=>{setEmail(e.target.value)}}
                    placeholder="Enter your email." 
                    required
                />

                <label>password</label>
                <input 
                    type="password" 
                    name="password"
                    onChange={(e)=>{setPword(e.target.value)}}
                    placeholder="Enter your password." 
                    required
                />

                <label>Confirm Password</label>
                <input 
                    type="password" 
                    name="confirmassword"
                    onChange={(e)=>{setConfirmPW(e.target.value)}}
                    placeholder="Confirm your password." 
                    required
                />
                <button type="submit">Sign up</button>
            </div>
        </form>
    );
}