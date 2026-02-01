"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./forum.module.css";
import Link from "next/link";
import AdContainer from "@/components/AdContainer";

export default function Forum() {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState({ title: "", content: "" });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPosts(postsData);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return alert("Please login first!");

        try {
            await addDoc(collection(db, "posts"), {
                ...newPost,
                author: user.username,
                authorId: user.uid,
                createdAt: serverTimestamp()
            });
            setNewPost({ title: "", content: "" });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Cat <span>Community</span></h1>
                <p className={styles.subtitle}>Connect with other cat lovers around the world.</p>
            </header>

            {user ? (
                <section className={styles.postForm}>
                    <h3>Post a New Topic</h3>
                    <form onSubmit={handleSubmit}>
                        <input
                            placeholder="Topic Title"
                            value={newPost.title}
                            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                            required
                        />
                        <textarea
                            placeholder="Share your story or question..."
                            value={newPost.content}
                            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                            required
                        />
                        <button type="submit">Post Topic</button>
                    </form>
                </section>
            ) : (
                <div className={styles.loginPrompt}>
                    <p>Please <Link href="/login">Login</Link> to participate in the community.</p>
                </div>
            )}

            <AdContainer type="native" />

            <div className={styles.postsGrid}>
                {loading ? <p>Loading posts...</p> : (
                    posts.map((post, index) => (
                        <>
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={styles.postCard}
                            >
                                <div className={styles.postMeta}>
                                    <span>@{post.author}</span>
                                    <span>{post.createdAt?.toDate().toLocaleDateString()}</span>
                                </div>
                                <h2>{post.title}</h2>
                                <p>{post.content}</p>
                            </motion.div>
                            {/* Insert an ad every 3 posts */}
                            {index % 3 === 2 && <AdContainer type="banner-300-250" />}
                        </>
                    ))
                )}
            </div>
            <AdContainer type="banner-728-90" />
        </div>
    );
}
