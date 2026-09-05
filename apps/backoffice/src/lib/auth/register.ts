"use client"

import { createClient } from "@/utils/supabase/client"

export const registerWithPassword = async(fullName:string,email:string,password:string)=>{
    const supabase = createClient()
    return supabase.auth.signUp({
        email,
        password,
        options:{
            data:{fullName},
            emailRedirectTo:`${window.location.origin}/auth/callback`
        }
    })
}