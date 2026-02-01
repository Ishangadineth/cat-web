"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, doc, updateDoc, orderBy, limit } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import styles from "./NotificationBell.module.css";
import Link from "next/link";

export default function NotificationBell() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, "notifications"),
            where("to", "==", user.uid),
            orderBy("createdAt", "desc"),
            limit(10)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setNotifications(notifs);
            setUnreadCount(notifs.filter(n => !n.read).length);
        });

        return () => unsubscribe();
    }, [user]);

    const markAsRead = async (id) => {
        try {
            await updateDoc(doc(db, "notifications", id), { read: true });
        } catch (err) {
            console.error(err);
        }
    };

    if (!user) return null;

    return (
        <div className={styles.bellWrapper}>
            <button className={styles.bellBtn} onClick={() => setIsOpen(!isOpen)}>
                🔔 {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
            </button>

            {isOpen && (
                <div className={styles.dropdown}>
                    <h4>Notifications</h4>
                    <div className={styles.list}>
                        {notifications.length === 0 ? <p className={styles.empty}>No notifications</p> : (
                            notifications.map(n => (
                                <Link
                                    href="/forum"
                                    key={n.id}
                                    className={`${styles.item} ${n.read ? '' : styles.unread}`}
                                    onClick={() => { markAsRead(n.id); setIsOpen(false); }}
                                >
                                    <p><strong>{n.fromName}</strong> commented on <strong>{n.postTitle}</strong></p>
                                    <span>{n.createdAt?.toDate ? n.createdAt.toDate().toLocaleDateString() : 'Just now'}</span>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
