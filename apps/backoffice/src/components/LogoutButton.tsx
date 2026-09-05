"use client";

import { logout } from "@/lib/auth/logout";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
    const router = useRouter()
    const handleLogOut = async() =>{
        await logout()
        router.push('/login')
    }
  return (
    <button onClick={handleLogOut}>
      Log out
    </button>
  )
}
export default LogoutButton