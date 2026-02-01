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
                    <li><Link href="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
                    <li><Link href="/forum" onClick={() => setIsMenuOpen(false)}>Forum</Link></li>
                    <li><Link href="/history" onClick={() => setIsMenuOpen(false)}>History</Link></li>
                    <li><Link href="/breeds" onClick={() => setIsMenuOpen(false)}>Breeds</Link></li>
                    <li><Link href="/health" onClick={() => setIsMenuOpen(false)}>Health</Link></li>
                    <li><Link href="/fun-zone" onClick={() => setIsMenuOpen(false)}>Fun Zone</Link></li>
                    <li><Link href="/shop" onClick={() => setIsMenuOpen(false)}>Shop</Link></li>

                    {user ? (
                        <li className={styles.authLinks}>
                            <NotificationBell />
                            <Link href="/profile" className={styles.profileBtn} onClick={() => setIsMenuOpen(false)}>Profile</Link>
                            <button onClick={() => { logout(); setIsMenuOpen(false); }} className={styles.logoutBtn}>Logout</button>
                        </li>
                    ) : (
                        <li className={styles.authLinks}>
                            <Link href="/login" className={styles.loginBtn} onClick={() => setIsMenuOpen(false)}>Login</Link>
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
