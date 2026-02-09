"use client";
import { useState, useEffect, useRef } from "react";
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

    const prevCountRef = useRef(0);

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, "notifications"),
            where("to", "==", user.uid),
            limit(20)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            let notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Sort in-memory to avoid index requirement
            notifs.sort((a, b) => {
                const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
                const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
                return dateB - dateA;
            });

            setNotifications(notifs);

            const newUnreadCount = notifs.filter(n => !n.read).length;

            // Notification Sound Logic
            if (newUnreadCount > prevCountRef.current) {
                const notifSettings = user.notificationSettings || {};
                const isSilent = notifSettings.silent;
                const isMuted = notifSettings.mutedUntil?.toDate
                    ? notifSettings.mutedUntil.toDate() > new Date()
                    : false;

                if (!isSilent && !isMuted) {
                    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3");
                    audio.play().catch(e => console.log("Sound play failed", e));
                }
            }

            setUnreadCount(newUnreadCount);
            prevCountRef.current = newUnreadCount;
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

    const handleMarkAllAsRead = async () => {
        try {
            const unread = notifications.filter(n => !n.read);
            const promises = unread.map(n => updateDoc(doc(db, "notifications", n.id), { read: true }));
            await Promise.all(promises);
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
                    <div className={styles.dropHeader}>
                        <h4>Notifications</h4>
                        {unreadCount > 0 && (
                            <button onClick={handleMarkAllAsRead} className={styles.clearBtn}>
                                Mark all as read
                            </button>
                        )}
                    </div>
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
