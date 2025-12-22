"use client"

import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";
import Link from "next/link";
import { useState } from "react";

export default function UserEnter() {
    const [page, setPage] = useState("login")
    return (
        <div>
            {page === "login"? 
            <div>
                <h1>Login here</h1>
                <LoginForm/>
                <p>Don`t have an account? <b onClick={()=>{setPage("signup")}}> signup</b></p>
            </div>
            : 
            <div>
                <h1>Signup here</h1>
                <RegisterForm/>
                <p>Already have an account? <b onClick={()=>{setPage("login")}}> login</b></p>
            </div>}
            
        </div>
    );
}