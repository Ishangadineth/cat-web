"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, updateDoc, doc, deleteDoc } from "firebase/firestore";
import styles from "./AdminPanel.module.css";
import { useAuth } from "@/context/AuthContext";

export default function AdminPanel() {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [product, setProduct] = useState({
        name: "",
        price: "",
        image: "",
        link: "",
        platform: "amazon",
        category: ""
    });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);

    // Only authorized emails can see this (you can change this to your email)
    const isAdmin = user?.email === "ishanga20051223@gmail.com";

    useEffect(() => {
        if (!isAdmin) return;
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, [isAdmin]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);
        try {
            if (editingId) {
                await updateDoc(doc(db, "products", editingId), product);
                setStatus("success_updated");
                setEditingId(null);
            } else {
                await addDoc(collection(db, "products"), {
                    ...product,
                    createdAt: serverTimestamp()
                });
                setStatus("success_added");
            }
            setProduct({ name: "", price: "", image: "", link: "", platform: "amazon", category: "" });
        } catch (err) {
            console.error(err);
            setStatus("error");
        }
        setLoading(false);
    };

    const handleEdit = (p) => {
        setProduct({
            name: p.name,
            price: p.price,
            image: p.image,
            link: p.link,
            platform: p.platform || "amazon",
            category: p.category || ""
        });
        setEditingId(p.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this product?")) {
            try {
                await deleteDoc(doc(db, "products", id));
            } catch (err) {
                console.error(err);
            }
        }
    };

    if (!isAdmin) return null;

    return (
        <div className={styles.adminContainer}>
            <div className={styles.adminBox}>
                <h3>{editingId ? "Edit Product" : "Add New Product"}</h3>
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
                        <label className={product.platform === 'amazon' ? styles.activeLabel : ''}>
                            <input
                                type="radio"
                                name="platform"
                                value="amazon"
                                checked={product.platform === "amazon"}
                                onChange={(e) => setProduct({ ...product, platform: e.target.value })}
                            /> Amazon
                        </label>
                        <label className={product.platform === 'aliexpress' ? styles.activeLabel : ''}>
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
                    <div className={styles.btnRow}>
                        <button type="submit" disabled={loading} className={styles.submitBtn}>
                            {loading ? "Saving..." : (editingId ? "Update Product" : "Add Product")}
                        </button>
                        {editingId && (
                            <button type="button" onClick={() => {
                                setEditingId(null);
                                setProduct({ name: "", price: "", image: "", link: "", platform: "amazon", category: "" });
                            }} className={styles.cancelBtn}>Cancel Edit</button>
                        )}
                    </div>
                    {status === "success_added" && <p className={styles.msgS}>Added successfully!</p>}
                    {status === "success_updated" && <p className={styles.msgS}>Updated successfully!</p>}
                    {status === "error" && <p className={styles.msgE}>Error occurred.</p>}
                </form>
            </div>

            <div className={styles.manageBox}>
                <h3>Manage Products</h3>
                <div className={styles.prodList}>
                    {products.map(p => (
                        <div key={p.id} className={styles.prodItem}>
                            <img src={p.image} alt={p.name} />
                            <div className={styles.prodInfo}>
                                <h4>{p.name}</h4>
                                <p>{p.platform} - {p.price}</p>
                            </div>
                            <div className={styles.actions}>
                                <button onClick={() => handleEdit(p)} className={styles.editBtn}>Edit</button>
                                <button onClick={() => handleDelete(p.id)} className={styles.deleteBtn}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
