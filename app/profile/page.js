"use client";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import styles from "./profile.module.css";
import { useRouter } from "next/navigation";

export default function Profile() {
    const { user, logout, loading } = useAuth();
    const [uploading, setUploading] = useState(false);
    const router = useRouter();

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
            // ImgBB Upload
            const formData = new FormData();
            formData.append("image", file);

            const response = await fetch(`https://api.imgbb.com/1/upload?key=ba07f575ffe3acd13b49729eb4554b02`, {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                const url = data.data.url;

                // Update Firestore
                await updateDoc(doc(db, "users", user.uid), {
                    avatar: url
                });

                window.location.reload();
            } else {
                throw new Error("ImgBB upload failed");
            }
        } catch (err) {
            console.error("Upload error:", err);
            alert("Upload failed. Please check your connection.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.profileCard}>
                <div className={styles.avatarWrapper}>
                    <img
                        src={user.avatar || "/default-avatar.png"}
                        alt="Profile"
                        className={styles.avatar}
                    />
                    <label className={styles.uploadBtn}>
                        {uploading ? "..." : "📸"}
                        <input type="file" hidden onChange={handleImageUpload} disabled={uploading} />
                    </label>
                </div>

                <h1>{user.username}</h1>
                <p className={styles.email}>{user.email}</p>

                <div className={styles.stats}>
                    <div className={styles.stat}>
                        <h4>0</h4>
                        <p>Posts</p>
                    </div>
                </div>

                <button onClick={logout} className={styles.logoutBtn}>Sign Out</button>
            </div>
        </div>
    );
}
