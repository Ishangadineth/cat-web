"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, updateDoc, arrayUnion, arrayRemove, getDoc, deleteDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./forum.module.css";
import Link from "next/link";
import AdContainer from "@/components/AdContainer";

export default function Forum() {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState({ title: "", content: "" });
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");
    const [editImages, setEditImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [replyingId, setReplyingId] = useState(null);
    const [replyingToCommentId, setReplyingToCommentId] = useState(null);
    const [replyContent, setReplyContent] = useState("");
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

    const togglePostNotifications = async (postId, currentState) => {
        if (!user) return alert("Please login first!");
        try {
            const postRef = doc(db, "posts", postId);
            await updateDoc(postRef, {
                [`notificationSettings.${user.uid}`]: !currentState
            });
        } catch (err) {
            console.error(err);
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + images.length > 5) {
            alert("Maximum 5 images allowed per post.");
            return;
        }
        const newImages = [...images, ...files];
        setImages(newImages);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews([...previews, ...newPreviews]);
    };

    const removeImage = (index) => {
        URL.revokeObjectURL(previews[index]);
        setImages(images.filter((_, i) => i !== index));
        setPreviews(previews.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return alert("Please login first!");
        if (!newPost.title.trim() && !newPost.content.trim() && images.length === 0) {
            return alert("Please add a title, content or an image!");
        }

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
                if (data.success) uploadedUrls.push(data.data.url);
            }

            await addDoc(collection(db, "posts"), {
                ...newPost,
                images: uploadedUrls,
                author: user.username,
                authorId: user.uid,
                createdAt: serverTimestamp(),
                isEdited: false,
                reactions: { like: [], heart: [], haha: [], sad: [] },
                comments: [],
                notificationSettings: { [user.uid]: true }
            });

            previews.forEach(url => URL.revokeObjectURL(url));
            setNewPost({ title: "", content: "" });
            setImages([]);
            setPreviews([]);
        } catch (err) {
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const filteredPosts = posts.filter(post =>
        (post.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (post.content?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (post.author?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    );

    const sortedPosts = [...filteredPosts].sort((a, b) => {
        if (filter === "top") {
            const getReactions = (p) => Object.values(p.reactions || {}).reduce((acc, curr) => acc + curr.length, 0);
            return getReactions(b) - getReactions(a);
        }
        if (filter === "longest") return (b.content?.length || 0) - (a.content?.length || 0);
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
            if (post.reactions?.[t]?.includes(user.uid)) updates[`reactions.${t}`] = arrayRemove(user.uid);
        });
        if (!hasTHIS) updates[`reactions.${type}`] = arrayUnion(user.uid);
        if (Object.keys(updates).length > 0) await updateDoc(postRef, updates);
    };

    const handleReply = async (postId, parentCommentId = null) => {
        if (!user) return alert("Please login to reply!");
        if (!replyContent.trim()) return;

        try {
            const postRef = doc(db, "posts", postId);
            const post = posts.find(p => p.id === postId);
            const newReply = {
                id: Date.now().toString(),
                author: user.username,
                authorId: user.uid,
                content: replyContent,
                createdAt: new Date().toISOString(),
                parentCommentId: parentCommentId,
                reactions: { like: [] }
            };

            await updateDoc(postRef, { comments: arrayUnion(newReply) });

            if (post.authorId !== user.uid) {
                const authorSnap = await getDoc(doc(db, "users", post.authorId));
                const authorData = authorSnap.data();
                const isMuted = authorData?.notificationSettings?.mutedUntil?.toDate() > new Date();
                const isSilent = authorData?.notificationSettings?.silent;

                if (!isMuted && post.notificationSettings?.[post.authorId] !== false) {
                    await addDoc(collection(db, "notifications"), {
                        to: post.authorId,
                        from: user.uid,
                        fromName: user.username,
                        postId: postId,
                        postTitle: post.title || "your post",
                        type: "comment",
                        read: false,
                        silent: isSilent,
                        createdAt: serverTimestamp()
                    });
                }
            }

            setReplyContent("");
            setReplyingId(null);
            setReplyingToCommentId(null);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCommentReaction = async (postId, commentId) => {
        if (!user) return alert("Please login to react!");
        try {
            const postRef = doc(db, "posts", postId);
            const post = posts.find(p => p.id === postId);
            const updatedComments = post.comments.map(c => {
                if (c.id === commentId) {
                    const reactions = c.reactions || { like: [] };
                    const hasLiked = reactions.like?.includes(user.uid);
                    reactions.like = hasLiked ? reactions.like.filter(id => id !== user.uid) : [...(reactions.like || []), user.uid];
                    return { ...c, reactions };
                }
                return c;
            });
            await updateDoc(postRef, { comments: updatedComments });
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (post) => {
        setEditingId(post.id);
        setEditTitle(post.title || "");
        setEditContent(post.content || "");
        setEditImages(post.images || (post.image ? [post.image] : []));
    };

    const handleSaveEdit = async (postId) => {
        try {
            const postRef = doc(db, "posts", postId);
            await updateDoc(postRef, {
                title: editTitle,
                content: editContent,
                images: editImages,
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
            console.error(err);
        }
    };

    const handleShare = async (post) => {
        try {
            if (navigator.share) {
                await navigator.share({ title: post.title, text: post.content, url: window.location.href });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                alert("Link copied!");
            }
        } catch (err) { console.error(err); }
    };

    const handleSavePost = async (postId) => {
        if (!user) return alert("Please login to save posts!");
        try {
            const userRef = doc(db, "users", user.uid);
            const isSaved = user.savedPosts?.includes(postId);
            await updateDoc(userRef, { savedPosts: isSaved ? arrayRemove(postId) : arrayUnion(postId) });
        } catch (err) { console.error(err); }
    };

    return (
        <div className={styles.container}>
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={styles.lightbox}
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.img
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            src={selectedImage}
                            alt="Full view"
                        />
                        <button className={styles.closeLightbox}>✕</button>
                    </motion.div>
                )}
            </AnimatePresence>

            <header className={styles.header}>
                <h1 className={styles.title}>Cat <span>Community</span></h1>
                <p className={styles.subtitle}>Connect with other cat lovers around the world.</p>
            </header>

            {user ? (
                <section className={styles.postForm}>
                    <h3>Post a New Topic</h3>
                    <form onSubmit={handleSubmit}>
                        <input
                            placeholder="Topic Title (Optional)"
                            value={newPost.title}
                            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                        />
                        <textarea
                            placeholder="Share your story or question..."
                            value={newPost.content}
                            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                        />
                        {previews.length > 0 && (
                            <div className={styles.imagePreviews}>
                                {previews.map((url, idx) => (
                                    <div key={idx} className={styles.previewItem}>
                                        <img src={url} alt="Preview" className={styles.previewThumb} />
                                        <button type="button" onClick={() => removeImage(idx)} className={styles.removePreview}>✕</button>
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
                        placeholder="🔍 Search topics..."
                        className={styles.searchInput}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className={styles.filterBtns}>
                    {['recent', 'top', 'longest'].map(f => (
                        <button key={f} className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`} onClick={() => setFilter(f)}>
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.postsGrid}>
                {loading ? <p>Loading posts...</p> : (
                    sortedPosts.map((post, index) => (
                        <div key={post.id} className={styles.postCardWrapper}>
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={styles.postCard}>
                                <div className={styles.postMeta}>
                                    <div className={styles.authorInfo}>
                                        <span>@{post.author}</span>
                                        {post.isEdited && <span className={styles.edited}>(edited)</span>}
                                    </div>
                                    <div className={styles.postSettings}>
                                        <button
                                            className={`${styles.notifToggle} ${post.notificationSettings?.[user?.uid] !== false ? styles.active : ''}`}
                                            onClick={() => togglePostNotifications(post.id, post.notificationSettings?.[user?.uid] !== false)}
                                            title="Toggle Notifications"
                                        >
                                            {post.notificationSettings?.[user?.uid] !== false ? "🔔" : "🔕"}
                                        </button>
                                        <span>{post.createdAt?.toDate ? post.createdAt.toDate().toLocaleString() : 'Just now'}</span>
                                    </div>
                                </div>

                                {editingId === post.id ? (
                                    <div className={styles.editArea}>
                                        <input className={styles.editTitleInput} value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                                        <textarea className={styles.editInput} value={editContent} onChange={(e) => setEditContent(e.target.value)} />
                                        <div className={styles.editImagePreviews}>
                                            {editImages.map((img, idx) => (
                                                <div key={idx} className={styles.editPreviewItem}>
                                                    <img src={img} alt="Preview" />
                                                    <button onClick={() => setEditImages(editImages.filter((_, i) => i !== idx))}>✕</button>
                                                </div>
                                            ))}
                                        </div>
                                        <div className={styles.editControls}>
                                            <button className={styles.saveBtn} onClick={() => handleSaveEdit(post.id)}>Save</button>
                                            <button className={styles.cancelBtn} onClick={() => setEditingId(null)}>Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {post.title && <h2>{post.title}</h2>}
                                        {post.content && <p>{post.content}</p>}
                                        {(post.images || (post.image ? [post.image] : [])).length > 0 && (
                                            <div className={`${styles.postImagesContainer} ${styles[`grid${(post.images || [post.image]).length}`]}`}>
                                                {(post.images || [post.image]).map((img, idx) => (
                                                    <div key={idx} className={styles.postImageWrapper} onClick={() => setSelectedImage(img)}>
                                                        <img src={img} alt="Post" className={styles.postImage} />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}

                                <div className={styles.actions}>
                                    <div className={styles.reactions}>
                                        {['like', 'heart', 'haha', 'sad'].map(type => (
                                            <button key={type} className={`${styles.reaction} ${post.reactions?.[type]?.includes(user?.uid) ? styles.active : ''}`} onClick={() => handleReaction(post.id, type)}>
                                                {type === 'like' ? '👍' : type === 'heart' ? '❤️' : type === 'haha' ? '😂' : '😢'}
                                                <span>{post.reactions?.[type]?.length || 0}</span>
                                            </button>
                                        ))}
                                    </div>
                                    <div className={styles.interactionBtns}>
                                        <button className={styles.actionBtn} onClick={() => setReplyingId(replyingId === post.id ? null : post.id)}>
                                            💬 {post.comments?.length || 0}
                                        </button>
                                        <button className={styles.actionBtn} onClick={() => handleShare(post)}>📤</button>
                                        <button className={styles.actionBtn} onClick={() => handleSavePost(post.id)}>
                                            {user?.savedPosts?.includes(post.id) ? "🔖" : "📑"}
                                        </button>
                                        {user?.uid === post.authorId && (
                                            <div className={styles.ownerActions}>
                                                <button onClick={() => handleEdit(post)}>✏️</button>
                                                <button onClick={() => handleDeletePost(post.id)}>🗑️</button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {replyingId === post.id && (
                                    <div className={styles.commentsSection}>
                                        <div className={styles.commentsList}>
                                            {post.comments?.filter(c => !c.parentCommentId).map(comment => (
                                                <div key={comment.id} className={styles.commentContainer}>
                                                    <div className={styles.commentItem}>
                                                        <div className={styles.commentHeader}>
                                                            <span className={styles.commentAuthor}>@{comment.author}</span>
                                                            <span className={styles.commentDate}>{new Date(comment.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                        <p>{comment.content}</p>
                                                        <div className={styles.commentActions}>
                                                            <button onClick={() => handleCommentReaction(post.id, comment.id)}>
                                                                👍 {comment.reactions?.like?.length || 0}
                                                            </button>
                                                            <button onClick={() => setReplyingToCommentId(replyingToCommentId === comment.id ? null : comment.id)}>
                                                                Reply
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Threaded Replies */}
                                                    <div className={styles.repliesList}>
                                                        {post.comments?.filter(c => c.parentCommentId === comment.id).map(child => (
                                                            <div key={child.id} className={styles.commentItem}>
                                                                <div className={styles.commentHeader}>
                                                                    <span className={styles.commentAuthor}>@{child.author}</span>
                                                                    <span className={styles.commentDate}>{new Date(child.createdAt).toLocaleDateString()}</span>
                                                                </div>
                                                                <p>{child.content}</p>
                                                                <button className={styles.commentReactBtn} onClick={() => handleCommentReaction(post.id, child.id)}>
                                                                    👍 {child.reactions?.like?.length || 0}
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {replyingToCommentId === comment.id && (
                                                        <div className={styles.replyInputSmall}>
                                                            <input
                                                                type="text"
                                                                placeholder={`Replying to @${comment.author}...`}
                                                                value={replyContent}
                                                                onChange={(e) => setReplyContent(e.target.value)}
                                                            />
                                                            <button onClick={() => handleReply(post.id, comment.id)}>Send</button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        {user ? (
                                            <div className={styles.replyInput}>
                                                <input placeholder="Write a comment..." value={replyContent} onChange={(e) => setReplyContent(e.target.value)} />
                                                <button onClick={() => handleReply(post.id)}>Post</button>
                                            </div>
                                        ) : <p className={styles.loginPromptSmall}>Login to comment</p>}
                                    </div>
                                )}
                            </motion.div>
                            {index % 3 === 2 && <AdContainer type="banner-300-250" />}
                        </div>
                    ))
                )}
            </div>
            <AdContainer type="banner-728-90" />
        </div>
    );
}
