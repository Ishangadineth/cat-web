"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "./ForumSection.module.css";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import Link from "next/link";

export default function ForumSection({ displayLimit = 3 }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(displayLimit));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPosts(postsData);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [displayLimit]);

    return (
        <section id="forum-preview" className={styles.forumSection}>
            <div className={styles.sectionHeader}>
                <h2>Community <span>Discussions</span></h2>
                <p>Latest topics from our feline-loving community.</p>
            </div>

            <div className={styles.postsContainer}>
                {loading ? (
                    <p className={styles.loading}>Loading discussions...</p>
                ) : posts.length === 0 ? (
                    <p className={styles.empty}>No discussions yet. Be the first!</p>
                ) : (
                    posts.map((post, index) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={styles.postCard}
                        >
                            <Link href="/forum" className={styles.postLink}>
                                <div className={styles.postHeader}>
                                    <span className={styles.author}>@{post.author || "Anonymous"}</span>
                                    <span className={styles.date}>
                                        {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : "Just now"}
                                    </span>
                                </div>
                                <h3>{post.title || "Untitled Post"}</h3>
                                <p>{post.content?.substring(0, 120)}...</p>
                                <div className={styles.postFooter}>
                                    <span>💬 {post.comments?.length || 0} Comments</span>
                                    <span>❤️ {Object.values(post.reactions || {}).flat().length} Reactions</span>
                                </div>
                            </Link>
                        </motion.div>
                    ))
                )}
            </div>

            <div className={styles.viewMoreContainer}>
                <Link href="/forum" className={styles.viewMoreBtn}>
                    Visit the Community Forum <span>→</span>
                </Link>
            </div>
        </section>
    );
}
