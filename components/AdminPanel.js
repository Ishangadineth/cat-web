"use client";
import { useState, useEffect } from "react";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import styles from "./AdminPanel.module.css";
import { useAuth } from "@/context/AuthContext";

export default function AdminPanel() {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [product, setProduct] = useState({
        name: "",
        price: "",
        images: [""],
        link: "",
        platform: "amazon",
        category: ""
    });
    const [imageFiles, setImageFiles] = useState({});
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

    const handleAddImageField = () => {
        if (product.images.length < 10) {
            setProduct({ ...product, images: [...product.images, ""] });
        }
    };

    const handleRemoveImageField = (index) => {
        const newImages = [...product.images];
        newImages.splice(index, 1);
        const newFiles = { ...imageFiles };
        delete newFiles[index];
        setProduct({ ...product, images: newImages });
        setImageFiles(newFiles);
    };

    const handleFileChange = (index, file) => {
        if (!file) return;
        setImageFiles({ ...imageFiles, [index]: file });
        const newImages = [...product.images];
        newImages[index] = "file_upload:" + file.name;
        setProduct({ ...product, images: newImages });
    };

    const uploadAllFiles = async () => {
        const finalUrls = [...product.images];
        for (const index in imageFiles) {
            const file = imageFiles[index];
            const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const url = await getDownloadURL(snapshot.ref);
            finalUrls[index] = url;
        }
        return finalUrls.filter(url => url && !url.startsWith("file_upload:"));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);
        try {
            const finalizedImages = await uploadAllFiles();
            const productData = {
                ...product,
                images: finalizedImages,
                image: finalizedImages[0] || ""
            };

            if (editingId) {
                await updateDoc(doc(db, "products", editingId), productData);
                setStatus("success_updated");
                setEditingId(null);
            } else {
                await addDoc(collection(db, "products"), {
                    ...productData,
                    createdAt: serverTimestamp()
                });
                setStatus("success_added");
            }
            setProduct({ name: "", price: "", images: [""], link: "", platform: "amazon", category: "" });
            setImageFiles({});
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
            images: p.images || [p.image] || [""],
            link: p.link || "",
            platform: p.platform || "amazon",
            category: p.category || ""
        });
        setEditingId(p.id);
        setImageFiles({});
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
                    <div className={styles.imageSection}>
                        <h4>Images ({product.images.length}/10)</h4>
                        {product.images.map((img, idx) => (
                            <div key={idx} className={styles.imageInputRow}>
                                <div className={styles.inputFlex}>
                                    <input
                                        placeholder="Image URL"
                                        value={img.startsWith("file_upload:") ? "" : img}
                                        onChange={(e) => {
                                            const nextImages = [...product.images];
                                            nextImages[idx] = e.target.value;
                                            setProduct({ ...product, images: nextImages });
                                        }}
                                        disabled={img.startsWith("file_upload:")}
                                    />
                                    <span>OR</span>
                                    <label className={styles.fileLabel}>
                                        📁 Upload
                                        <input
                                            type="file"
                                            hidden
                                            onChange={(e) => handleFileChange(idx, e.target.files[0])}
                                        />
                                    </label>
                                </div>
                                {img.startsWith("file_upload:") && <p className={styles.fileName}>Selected: {img.replace("file_upload:", "")}</p>}
                                {product.images.length > 1 && (
                                    <button type="button" onClick={() => handleRemoveImageField(idx)} className={styles.removeImgBtn}>×</button>
                                )}
                            </div>
                        ))}
                        {product.images.length < 10 && (
                            <button type="button" onClick={handleAddImageField} className={styles.addImgBtn}>+ Add More Images</button>
                        )}
                    </div>
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
                                setProduct({ name: "", price: "", images: [""], link: "", platform: "amazon", category: "" });
                                setImageFiles({});
                            }} className={styles.cancelBtn}>Cancel Edit</button>
                        )}
                    </div>
                    {status === "success_added" && <p className={styles.msgS}>Added successfully!</p>}
                    {status === "success_updated" && <p className={styles.msgS}>Updated successfully!</p>}
                    {status === "error" && <p className={styles.msgE}>Error occurred during save.</p>}
                </form>
            </div>

            <div className={styles.manageBox}>
                <h3>Manage Products</h3>
                <div className={styles.prodList}>
                    {products.map(p => (
                        <div key={p.id} className={styles.prodItem}>
                            <img src={p.images?.[0] || p.image} alt={p.name} />
                            <div className={styles.prodInfo}>
                                <h4>{p.name}</h4>
                                <p>{p.platform} - {p.price}</p>
                                <p className={styles.imgCount}>{p.images?.length || 1} Images</p>
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
