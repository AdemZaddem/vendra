"use client"
import { createClient } from "@/utils/supabase/client"

export const logout = async()=>{
    const supabase = createClient()
    return supabase.auth.signOut()
}