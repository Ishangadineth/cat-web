"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../login/auth.module.css";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { user, signup, loginWithProvider, loading } = useAuth();
    const router = useRouter();

    // If user is already logged in, redirect to profile
    if (!loading && user) {
        if (typeof window !== "undefined") router.push("/profile");
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signup(email, password, username);
            router.push("/profile");
        } catch (err) {
            setError("Failed to create account. Try again.");
            console.error(err);
        }
    };

    const handleSocialLogin = async (provider) => {
        try {
            await loginWithProvider(provider);
            router.push("/profile");
        } catch (err) {
            setError(`Failed to signup with ${provider}.`);
            console.error(err);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.authBox}>
                <h1>Join <span>CatUniverse</span></h1>
                {error && <p className={styles.error}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
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
                    <button type="submit" className={styles.submitBtn}>Create Account</button>
                </form>

                <div className={styles.divider}>Or sign up with</div>

                <div className={styles.socialContainer}>
                    <button onClick={() => handleSocialLogin('google')} className={styles.socialBtn}>
                        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" /></svg>
                        Google
                    </button>
                    <button onClick={() => handleSocialLogin('facebook')} className={styles.socialBtn}>
                        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12,2C6.477,2,2,6.477,2,12c0,5.001,3.656,9.148,8.438,9.878V14.89h-2.54V12h2.54V9.797c0-2.506,1.492-3.89,3.777-3.89c1.094,0,2.238,0.195,2.238,0.195v2.46h-1.26c-1.243,0-1.63,0.771-1.63,1.562V12h2.773l-0.443,2.89h-2.33v6.988C18.344,21.148,22,17.001,22,12C22,6.477,17.523,2,12,2z" /></svg>
                        Facebook
                    </button>
                    <button onClick={() => handleSocialLogin('github')} className={styles.socialBtn}>
                        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12" /></svg>
                        GitHub
                    </button>
                    <button onClick={() => handleSocialLogin('apple')} className={styles.socialBtn}>
                        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M17.05,20.28c-0.96,0.95-2.37,2.12-4.04,2.12c-1.61,0-2.12-1.03-4.07-1.03c-1.95,0-2.58,1-4.07,1.03c-1.64,0.03-3.12-1.3-4.13-2.73C-1.3,16.89-2.09,11.51,1.04,9.15c1.55-1.17,3.58-1.55,5-1.55c1.19,0,2.3,0.39,2.83,0.57c1,0.34,2.22,0.95,3.34,0.95c0.96,0,2.02-0.57,2.86-0.84c1.13-0.34,2.37-0.74,4.22,0.2c0.31,0.17,4.01,1.55,4,5.43c-0.01,0.06-2.55,0.95-2.57,4.01C20.69,17.77,22.28,19.26,23,20C21.82,21.14,19.14,20.28,17.05,20.28z M12.03,7.25c-0.1,0-0.21-0.01-0.31-0.01c-0.08-1.34,0.55-2.75,1.25-3.53c0.77-0.89,2.07-1.53,3.31-1.71c0.1,1.43-0.5,2.77-1.25,3.61C14.24,6.48,13.11,7.18,12.03,7.25z" /></svg>
                        Apple
                    </button>
                </div>

                <p className={styles.switch}>
                    Already have an account? <Link href="/login">Login</Link>
                </p>
            </div>
        </div>
    );
}
