"use client"

import LoginForm from "@/components/client/auth/LoginForm";
import RegisterForm from "@/components/client/auth/RegisterForm";
import ResetPasswordPage from "@/components/client/auth/ResetPassword";
import styles from '@/styles/Enter.module.css'
import { useState } from "react";

export default function UserEnter() {
    /* TODO:
        This page does not allow you to reset your password. 
        Create an auxilary page and set up the reset password email through Supabase
    */
    const [page, setPage] = useState("login")
    return (
        <div className={styles.Wrapper}>
            {page === "login"? 
            <div className={styles.Content}>
                <h1 className={styles.CenteredRow}>Login</h1>
                <LoginForm/>
                <p>Don`t have an account? <b onClick={()=>{setPage("signup")}}> Signup.</b></p>
                <p>Forgot your password? <b onClick={()=>{setPage("resetpw")}}> Reset Password.</b></p>
            </div>
            : page === "signup"? 
            <div className={styles.Content}>
                <h1 className={styles.CenteredRow}>Signup</h1>
                <RegisterForm/>
                <p>Already have an account? <b onClick={()=>{setPage("login")}}> Login.</b></p>
            </div>
            : 
            <div className={styles.Content}>
                <h1 className={styles.CenteredRow}>Reset Password</h1>
                <ResetPasswordPage/>
                <p>Already have an account? <b onClick={()=>{setPage("login")}}> Login.</b></p>
            </div>}
        </div>
    );
}