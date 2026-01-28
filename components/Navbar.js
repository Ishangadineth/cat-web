"use client";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import styles from "./Navbar.module.css";

export default function Navbar() {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className={styles.header}>
            <nav className={styles.navContainer}>
                <Link href="/" className={styles.logo}>
                    Cat<span>Universe</span>
                </Link>

                <ul className={`${styles.navLinks} ${isMenuOpen ? styles.active : ''}`}>
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/forum">Forum</Link></li>
                    <li><Link href="/history">History</Link></li>
                    <li><Link href="/breeds">Breeds</Link></li>
                    <li><Link href="/health">Health</Link></li>
                    <li><Link href="/fun-zone">Fun Zone</Link></li>
                    <li><Link href="/shop">Shop</Link></li>

                    {user ? (
                        <li className={styles.authLinks}>
                            <Link href="/profile" className={styles.profileBtn}>Profile</Link>
                            <button onClick={logout} className={styles.logoutBtn}>Logout</button>
                        </li>
                    ) : (
                        <li className={styles.authLinks}>
                            <Link href="/login" className={styles.loginBtn}>Login</Link>
                        </li>
                    )}
                </ul>

                <button className={styles.mobileMenu} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </nav>
        </header>
    );
}
