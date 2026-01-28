"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./auth.module.css";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            router.push("/profile");
        } catch (err) {
            setError("Failed to login. Check your credentials.");
            console.error(err);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.authBox}>
                <h1>Login to <span>Paws</span></h1>
                {error && <p className={styles.error}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className={styles.submitBtn}>Login</button>
                </form>
                <p className={styles.switch}>
                    Don't have an account? <Link href="/signup">Sign Up</Link>
                </p>
            </div>
        </div>
    );
}
