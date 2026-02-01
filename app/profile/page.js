"use client";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { storage, db } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
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
            const storageRef = ref(storage, `profiles/${user.uid}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);

            await updateDoc(doc(db, "users", user.uid), {
                avatar: url
            });

            // Update user state locally if possible, but for now we reload 
            // to ensure context is synced from Firestore
            window.location.reload();
        } catch (err) {
            console.error("Upload error:", err);
            alert("Upload failed. Make sure Firebase Storage is enabled and rules are set.");
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
