"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, updateDoc, arrayUnion, arrayRemove, getDoc, deleteDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import styles from "./forum.module.css";
import Link from "next/link";
import AdContainer from "@/components/AdContainer";

export default function Forum() {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState({ title: "", content: "" });
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");
    const [filter, setFilter] = useState("recent");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPosts(postsData);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + images.length > 5) {
            alert("Maximum 5 images allowed per post.");
            return;
        }
        setImages([...images, ...files]);
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return alert("Please login first!");
        if (!newPost.title) return alert("Please add a title!");
        if (!newPost.content && images.length === 0) return alert("Please add some content or an image!");

        setUploading(true);
        try {
            const uploadedUrls = [];

            for (const img of images) {
                const formData = new FormData();
                formData.append("image", img);
                const response = await fetch(`https://api.imgbb.com/1/upload?key=ba07f575ffe3acd13b49729eb4554b02`, {
                    method: "POST",
                    body: formData
                });
                const data = await response.json();
                if (data.success) {
                    uploadedUrls.push(data.data.url);
                }
            }

            await addDoc(collection(db, "posts"), {
                ...newPost,
                images: uploadedUrls,
                author: user.username,
                authorId: user.uid,
                createdAt: serverTimestamp(),
                isEdited: false,
                reactions: { like: [], heart: [], haha: [], sad: [] }
            });
            setNewPost({ title: "", content: "" });
            setImages([]);
        } catch (err) {
            console.error(err);
            alert("Failed to post. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedPosts = [...filteredPosts].sort((a, b) => {
        if (filter === "top") {
            const getReactions = (p) => Object.values(p.reactions || {}).reduce((acc, curr) => acc + curr.length, 0);
            return getReactions(b) - getReactions(a);
        }
        if (filter === "longest") {
            return (b.content?.length || 0) - (a.content?.length || 0);
        }
        if (filter === "recent") {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
            return dateB - dateA;
        }
        return 0;
    });

    const handleReaction = async (postId, type) => {
        if (!user) return alert("Please login to react!");
        const postRef = doc(db, "posts", postId);
        const post = posts.find(p => p.id === postId);

        const hasTHIS = post.reactions?.[type]?.includes(user.uid);
        const updates = {};

        ['like', 'heart', 'haha', 'sad'].forEach(t => {
            if (post.reactions?.[t]?.includes(user.uid)) {
                updates[`reactions.${t}`] = arrayRemove(user.uid);
            }
        });

        if (!hasTHIS) {
            updates[`reactions.${type}`] = arrayUnion(user.uid);
        }

        if (Object.keys(updates).length > 0) {
            await updateDoc(postRef, updates);
        }
    };

    const handleEdit = (post) => {
        setEditingId(post.id);
        setEditTitle(post.title);
        setEditContent(post.content);
    };

    const handleSaveEdit = async (postId) => {
        try {
            const postRef = doc(db, "posts", postId);
            await updateDoc(postRef, {
                title: editTitle,
                content: editContent,
                isEdited: true,
                updatedAt: serverTimestamp()
            });
            setEditingId(null);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeletePost = async (postId) => {
        if (!confirm("Are you sure you want to delete this post?")) return;
        try {
            const postRef = doc(db, "posts", postId);
            await deleteDoc(postRef);
        } catch (err) {
            console.error("Error deleting post:", err);
            alert("Failed to delete post.");
        }
    };

    const handleShare = async (post) => {
        const shareData = {
            title: post.title,
            text: post.content,
            url: window.location.href
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSavePost = async (postId) => {
        if (!user) return alert("Please login to save posts!");
        try {
            const userRef = doc(db, "users", user.uid);
            const isSaved = user.savedPosts?.includes(postId);

            await updateDoc(userRef, {
                savedPosts: isSaved ? arrayRemove(postId) : arrayUnion(postId)
            });
            alert(isSaved ? "Post removed from saves." : "Post saved to your profile!");
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
                            placeholder="Share your story or question... (Optional if image added)"
                            value={newPost.content}
                            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                        />

                        {images.length > 0 && (
                            <div className={styles.imagePreviews}>
                                {images.map((img, idx) => (
                                    <div key={idx} className={styles.previewItem}>
                                        <span>{img.name}</span>
                                        <button type="button" onClick={() => removeImage(idx)}>✕</button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className={styles.formActions}>
                            <label className={styles.imageUploadBtn}>
                                📷 {images.length > 0 ? `${images.length} Images` : "Add Images (Max 5)"}
                                <input type="file" hidden onChange={handleFileChange} accept="image/*" multiple disabled={uploading} />
                            </label>
                            <button type="submit" disabled={uploading}>
                                {uploading ? "Posting..." : "Post Topic"}
                            </button>
                        </div>
                    </form>
                </section>
            ) : (
                <div className={styles.loginPrompt}>
                    <p>Please <Link href="/login">Login</Link> to participate in the community.</p>
                </div>
            )}

            <AdContainer type="native" />

            <div className={styles.filterBar}>
                <div className={styles.searchWrapper}>
                    <input
                        type="text"
                        placeholder="🔍 Search topics, content or authors..."
                        className={styles.searchInput}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className={styles.filterBtns}>
                    <button
                        className={`${styles.filterBtn} ${filter === 'recent' ? styles.active : ''}`}
                        onClick={() => setFilter('recent')}
                    >
                        Most Recent
                    </button>
                    <button
                        className={`${styles.filterBtn} ${filter === 'top' ? styles.active : ''}`}
                        onClick={() => setFilter('top')}
                    >
                        Top Rated
                    </button>
                    <button
                        className={`${styles.filterBtn} ${filter === 'longest' ? styles.active : ''}`}
                        onClick={() => setFilter('longest')}
                    >
                        Longest
                    </button>
                </div>
            </div>

            <div className={styles.postsGrid}>
                {loading ? <p>Loading posts...</p> : (
                    sortedPosts.map((post, index) => (
                        <div key={post.id}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={styles.postCard}
                            >
                                <div className={styles.postMeta}>
                                    <div className={styles.authorInfo}>
                                        <span>@{post.author}</span>
                                        {post.isEdited && <span className={styles.edited}>(edited)</span>}
                                    </div>
                                    <span>{post.createdAt?.toDate ? post.createdAt.toDate().toLocaleString() : 'Just now'}</span>
                                </div>

                                {editingId === post.id ? (
                                    <div className={styles.editArea}>
                                        <input
                                            className={styles.editTitleInput}
                                            value={editTitle}
                                            onChange={(e) => setEditTitle(e.target.value)}
                                            placeholder="Edit title..."
                                        />
                                        <textarea
                                            className={styles.editInput}
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            placeholder="Edit content..."
                                        />
                                        <div className={styles.editControls}>
                                            <button className={styles.saveBtn} onClick={() => handleSaveEdit(post.id)}>Save</button>
                                            <button className={styles.cancelBtn} onClick={() => setEditingId(null)}>Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <h2>{post.title}</h2>
                                        {post.content && <p>{post.content}</p>}

                                        {/* Support for new multiple images array */}
                                        {post.images && post.images.length > 0 && (
                                            <div className={`${styles.postImagesContainer} ${styles[`grid${post.images.length}`]}`}>
                                                {post.images.map((img, idx) => (
                                                    <div key={idx} className={styles.postImageWrapper}>
                                                        <img src={img} alt={`${post.title}-${idx}`} className={styles.postImage} />
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Compatibility for legacy single image posts */}
                                        {post.image && !post.images && (
                                            <div className={styles.postImageWrapper}>
                                                <img src={post.image} alt={post.title} className={styles.postImage} />
                                            </div>
                                        )}
                                    </>
                                )}

                                <div className={styles.actions}>
                                    <div className={styles.reactions}>
                                        <button className={`${styles.reaction} ${post.reactions?.like?.includes(user?.uid) ? styles.active : ''}`} onClick={() => handleReaction(post.id, 'like')}>
                                            👍 <span>{post.reactions?.like?.length || 0}</span>
                                        </button>
                                        <button className={`${styles.reaction} ${post.reactions?.heart?.includes(user?.uid) ? styles.active : ''}`} onClick={() => handleReaction(post.id, 'heart')}>
                                            ❤️ <span>{post.reactions?.heart?.length || 0}</span>
                                        </button>
                                        <button className={`${styles.reaction} ${post.reactions?.haha?.includes(user?.uid) ? styles.active : ''}`} onClick={() => handleReaction(post.id, 'haha')}>
                                            😂 <span>{post.reactions?.haha?.length || 0}</span>
                                        </button>
                                        <button className={`${styles.reaction} ${post.reactions?.sad?.includes(user?.uid) ? styles.active : ''}`} onClick={() => handleReaction(post.id, 'sad')}>
                                            😢 <span>{post.reactions?.sad?.length || 0}</span>
                                        </button>
                                    </div>

                                    <div className={styles.interactionBtns}>
                                        <button className={styles.actionBtn}>💬 Reply</button>
                                        <button className={styles.actionBtn} onClick={() => handleShare(post)}>📤 Share</button>
                                        <button className={styles.actionBtn} onClick={() => handleSavePost(post.id)}>
                                            {user?.savedPosts?.includes(post.id) ? "🔖 Saved" : "🔖 Save"}
                                        </button>
                                        {user?.uid === post.authorId && (
                                            <>
                                                <button className={styles.editIconBtn} onClick={() => handleEdit(post)}>✏️ Edit</button>
                                                <button className={styles.deleteIconBtn} onClick={() => handleDeletePost(post.id)}>🗑️ Delete</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                            {/* Insert an ad every 3 posts */}
                            {index % 3 === 2 && <AdContainer type="banner-300-250" />}
                        </div>
                    ))
                )}
            </div>
            <AdContainer type="banner-728-90" />
        </div>
    );
}
