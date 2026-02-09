"use client";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import styles from "./AdminPanel.module.css";
import { useAuth } from "@/context/AuthContext";

export default function AdminPanel() {
    const { user } = useAuth();
    const [product, setProduct] = useState({
        name: "",
        price: "",
        image: "",
        link: "",
        platform: "amazon", // Default
        category: ""
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);

    // Only authorized emails can see this (you can change this to your email)
    const isAdmin = user?.email === "ishanga20051223@gmail.com";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addDoc(collection(db, "products"), {
                ...product,
                createdAt: serverTimestamp()
            });
            setStatus("success");
            setProduct({ name: "", price: "", image: "", link: "", platform: "amazon", category: "" });
        } catch (err) {
            console.error(err);
            setStatus("error");
        }
        setLoading(false);
    };

    if (!isAdmin) return null;

    return (
        <div className={styles.adminBox}>
            <h3>Add New Product</h3>
            <form onSubmit={handleSubmit}>
                <input
                    placeholder="Product Name"
                    value={product.name}
                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                    required
                />
                <input
                    placeholder="Price (e.g. $19.99)"
                    value={product.price}
                    onChange={(e) => setProduct({ ...product, price: e.target.value })}
                    required
                />
                <input
                    placeholder="Image URL"
                    value={product.image}
                    onChange={(e) => setProduct({ ...product, image: e.target.value })}
                    required
                />
                <input
                    placeholder="Affiliate Link"
                    value={product.link}
                    onChange={(e) => setProduct({ ...product, link: e.target.value })}
                    required
                />
                <div className={styles.platformSelector}>
                    <label>
                        <input
                            type="radio"
                            name="platform"
                            value="amazon"
                            checked={product.platform === "amazon"}
                            onChange={(e) => setProduct({ ...product, platform: e.target.value })}
                        /> Amazon
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="platform"
                            value="aliexpress"
                            checked={product.platform === "aliexpress"}
                            onChange={(e) => setProduct({ ...product, platform: e.target.value })}
                        /> AliExpress
                    </label>
                </div>
                <input
                    placeholder="Category"
                    value={product.category}
                    onChange={(e) => setProduct({ ...product, category: e.target.value })}
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Adding..." : "Add Product"}
                </button>
                {status === "success" && <p className={styles.msgS}>Added successfully!</p>}
                {status === "error" && <p className={styles.msgE}>Error adding product.</p>}
            </form>
        </div>
    );
}
