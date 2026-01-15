"use client"

import LoginForm from "@/components/client/auth/LoginForm";
import RegisterForm from "@/components/client/auth/RegisterForm";
import ResetPasswordPage from "@/components/client/auth/ResetPassword";
import { useState } from "react";

export default function UserEnter() {
    /* TODO:
        This page does not allow you to reset your password. 
        Create an auxilary page and set up the reset password email through Supabase
    */
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
        </div>
    );
}