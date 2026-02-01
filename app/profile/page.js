"use client";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, updateDoc, getDoc, collection, query, where, getDocs, arrayRemove, orderBy } from "firebase/firestore";
import styles from "./profile.module.css";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Profile() {
    const { user, logout, loading } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [savedPosts, setSavedPosts] = useState([]);
    const [userPosts, setUserPosts] = useState([]);
    const [loadingSaved, setLoadingSaved] = useState(false);
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [sortBy, setSortBy] = useState("newest");
    const [totalReactions, setTotalReactions] = useState(0);
    const router = useRouter();

    useEffect(() => {
        if (user) {
            if (user.savedPosts?.length > 0) fetchSavedPosts();
            fetchUserPosts();
        }
    }, [user, sortBy]);

    const fetchSavedPosts = async () => {
        setLoadingSaved(true);
        try {
            const postsRef = collection(db, "posts");
            const q = query(postsRef, where("__name__", "in", user.savedPosts.slice(0, 30)));
            const querySnapshot = await getDocs(q);
            const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSavedPosts(posts);
        } catch (err) {
            console.error("Error fetching saved posts:", err);
        } finally {
            setLoadingSaved(false);
        }
    };

    const fetchUserPosts = async () => {
        setLoadingPosts(true);
        try {
            const postsRef = collection(db, "posts");
            // Simple query without orderBy to avoid index requirement
            const q = query(postsRef, where("authorId", "==", user.uid));
            const querySnapshot = await getDocs(q);
            let posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Sort in memory
            posts.sort((a, b) => {
                const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
                const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
                return sortBy === "newest" ? dateB - dateA : dateA - dateB;
            });

            setUserPosts(posts);

            // Calculate total reactions
            let total = 0;
            posts.forEach(post => {
                if (post.reactions) {
                    Object.values(post.reactions).forEach(uids => {
                        total += uids.length;
                    });
                }
            });
            setTotalReactions(total);
        } catch (err) {
            console.error("Error fetching user posts:", err);
        } finally {
            setLoadingPosts(false);
        }
    };

    const handleUnsave = async (e, postId) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                savedPosts: arrayRemove(postId)
            });
            // Result will sync via AuthContext listener
        } catch (err) {
            console.error("Unsave error:", err);
        }
    };

    if (loading) {
        return <div className={styles.container}><h1>Loading...</h1></div>;
    }

    if (!user) {
        if (typeof window !== "undefined") router.push("/login");
        return null;
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("image", file);
            const response = await fetch(`https://api.imgbb.com/1/upload?key=ba07f575ffe3acd13b49729eb4554b02`, {
                method: "POST",
                body: formData
            });
            const data = await response.json();
            if (data.success) {
                const url = data.data.url;
                await updateDoc(doc(db, "users", user.uid), { avatar: url });
                window.location.reload();
            }
        } catch (err) {
            console.error("Upload error:", err);
            alert("Upload failed.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.profileSection}>
                <div className={styles.profileCard}>
                    <div className={styles.avatarWrapper}>
                        <img src={user.avatar || "/default-avatar.png"} alt="Profile" className={styles.avatar} />
                        <label className={styles.uploadBtn}>
                            {uploading ? "..." : "📸"}
                            <input type="file" hidden onChange={handleImageUpload} disabled={uploading} />
                        </label>
                    </div>
                    <h1>{user.username}</h1>
                    <p className={styles.email}>{user.email}</p>
                    <div className={styles.stats}>
                        <div className={styles.stat}>
                            <h4>{userPosts.length}</h4>
                            <p>Posts</p>
                        </div>
                        <div className={styles.stat}>
                            <h4>{totalReactions}</h4>
                            <p>Reactions</p>
                        </div>
                        <div className={styles.stat}>
                            <h4>{user.savedPosts?.length || 0}</h4>
                            <p>Saved</p>
                        </div>
                    </div>
                    <button onClick={logout} className={styles.logoutBtn}>Sign Out</button>
                </div>

                <div className={styles.contentColumn}>
                    <div className={styles.postsSection}>
                        <div className={styles.sectionHeader}>
                            <h2>📝 My Posts</h2>
                            <select
                                className={styles.sortSelect}
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                            </select>
                        </div>

                        {loadingPosts ? <p>Loading posts...</p> : (
                            <div className={styles.postsGrid}>
                                {userPosts.length > 0 ? userPosts.map(post => (
                                    <Link href="/forum" key={post.id} className={styles.postItem}>
                                        <h3>{post.title}</h3>
                                        <div className={styles.postMeta}>
                                            <span>📅 {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : 'Just now'}</span>
                                            <span>❤️ {Object.values(post.reactions || {}).reduce((a, b) => a + b.length, 0)}</span>
                                        </div>
                                    </Link>
                                )) : (
                                    <p className={styles.noData}>You haven't posted anything yet.</p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className={styles.savedSection}>
                        <h2>🔖 Saved Posts</h2>
                        {loadingSaved ? <p>Loading saved content...</p> : (
                            <div className={styles.savedGrid}>
                                {savedPosts.length > 0 ? savedPosts.map(post => (
                                    <div key={post.id} className={styles.savedWrapper}>
                                        <Link href="/forum" className={styles.savedItem}>
                                            <h3>{post.title}</h3>
                                            <p>by @{post.author}</p>
                                        </Link>
                                        <button className={styles.unsaveBtn} onClick={(e) => handleUnsave(e, post.id)}>
                                            ❌
                                        </button>
                                    </div>
                                )) : (
                                    <p className={styles.noData}>No saved posts yet.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
