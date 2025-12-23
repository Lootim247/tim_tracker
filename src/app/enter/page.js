"use client"

import LoginForm from "@/components/client/auth/LoginForm";
import RegisterForm from "@/components/client/auth/RegisterForm";
import ResetPasswordPage from "@/components/client/auth/ResetPassword";
import Link from "next/link";
import { useState } from "react";
import { logout } from "@/lib/client/auth";

export default function UserEnter() {
    const [page, setPage] = useState("login")
    return (
        <div>
            {page === "login"? 
            <div>
                <h1>Login here</h1>
                <LoginForm/>
                <p>Don`t have an account? <b onClick={()=>{setPage("signup")}}> signup</b></p>
                <p>Forgot your password? <b onClick={()=>{setPage("resetpw")}}> Reset Password</b></p>
            </div>
            : page === "signup"? 
            <div>
                <h1>Signup here</h1>
                <RegisterForm/>
                <p>Already have an account? <b onClick={()=>{setPage("login")}}> login</b></p>
            </div>
            : 
            <div>
                <h1>Reset Password</h1>
                <ResetPasswordPage/>
                <p>Already have an account? <b onClick={()=>{setPage("login")}}> login</b></p>
            </div>}
            <b
                onClick={async () => {
                    try {
                    console.log("starting logout")
                    await logout();
                    // Optionally reset page state or redirect
                    setPage("login"); // if you want to go back to login page
                    } catch (err) {
                    console.error("Logout failed:", err);
                    }
                }}
            >
            logout
            </b>
        </div>
    );
}