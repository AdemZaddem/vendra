"use client"

import { registerWithPassword } from "@/lib/auth/register";
import { loginWithFacebook, loginWithGoogle } from "@/lib/auth/login";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Page = () => {
    const router = useRouter();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await registerWithPassword(fullName, email, password);
        if (error) {
            setError(error.message);
            return;
        }
        router.push(`/register/check-email?email=${encodeURIComponent(email)}`);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="fullName">Full name</label>
                <input
                    type="text"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />
            </div>
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
            <button type="submit">Create account</button>
            <button type="button" onClick={loginWithGoogle}>Continue with Google</button>
            <button type="button" onClick={loginWithFacebook}>Continue with Facebook</button>
        </form>
    );
};
export default Page;