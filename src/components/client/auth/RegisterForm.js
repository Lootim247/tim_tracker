"use client"

import { useState, useTransition } from "react";
import { signup } from "@/lib/client/auth";
import { TooltipText } from "../ui";
import { useRouter } from "next/navigation";
import styles from '@/styles/Enter.module.css'
import { LabelOff } from "@mui/icons-material";

export default function RegisterForm({setEnterPage}) {
    const [pword, setPword] = useState("")
    const [confirmPW, setConfirmPW] = useState("")
    const [email, setEmail] = useState("")
    const [title, setTitle] = useState("")
    const [error, setError] = useState(null);
    const [isPending, startTransition] = useTransition();

    const router = useRouter();

    // validate the users input
    function validate() {
        if (!email.includes("@")) {
        return "Invalid email address.";
        }
        if (pword.length < 8) {
        return "Password must be at least 8 characters.";
        }
        if (confirmPW !== pword) {
        return "Passwords do not match.";
        }
        return null;
    }

    function handleSubmit(e) {
        setError(null);
        e.preventDefault();
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        startTransition(async () => {
            const res = await signup(title, email, pword);
            if (res?.error) {
                console.log(res.error)
                setError(res.error);
            } else {
                setEnterPage('confirm_email')
            }
        });
    }

    return (
        <form className={styles.Form} onSubmit={handleSubmit}>
            {error && <div className={styles.Error}>{error}</div>}
            <label>Email:</label>
            <input 
                name="email"
                onChange={(e)=>{setEmail(e.target.value)}}
                placeholder="Enter your email." 
                required
            />

            <TooltipText
                text={'Title:'}
                tip={'Other users will see this title.'}
                width={10}
                height={10}
            />
            <input 
                className={styles.Input}
                type="name" 
                name="title"
                onChange={(e)=>{setTitle(e.target.value)}}
                placeholder="Enter your preferred title." 
                required
            />

            <label>Password:</label>
            <input 
                type="password" 
                name="password"
                onChange={(e)=>{setPword(e.target.value)}}
                placeholder="Enter your password." 
                required
            />

            <label>Confirm Password:</label>
            <input 
                type="password" 
                name="confirmPassword"
                onChange={(e)=>{setConfirmPW(e.target.value)}}
                placeholder="Confirm your password." 
                required
            />
            <button className={styles.SubmitButton} type="submit">Sign up</button>
        </form>
    );
}