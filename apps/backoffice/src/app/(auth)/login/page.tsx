"use client"

import { loginWithFacebook, loginWithGoogle, loginWithPassword } from "@/lib/auth/login";
import { useRouter } from "next/navigation"
import { useState } from "react";

const Page = () => {
    const router = useRouter();
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [error,setError] = useState<string | null>(null)


    const handleSubmit = async(e:React.FormEvent) =>{
        e.preventDefault()
        const {error} = await loginWithPassword(email,password)
        if(error){
            setError(error.message)
            return
        }
        router.push("/auth/redirect")
    }
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <p>{error}</p>}
      <button type="submit">Login</button>
      <button type="button" onClick={loginWithGoogle}>Continue with google</button>
      <button type="button" onClick={loginWithFacebook}>Continue with facebook</button>
    </form>
  )
}
export default Page