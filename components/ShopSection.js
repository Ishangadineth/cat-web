"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./ShopSection.module.css";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, orderBy, addDoc, serverTimestamp } from "firebase/firestore";
import AdContainer from "./AdContainer";
import Link from "next/link";

export default function ShopSection({ limit = null }) {
    const [products, setProducts] = useState([]);
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProducts(items);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const filteredProducts = products.filter(p => {
        const matchesFilter = filter === "all" || p.platform === filter;
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const displayProducts = limit ? filteredProducts.slice(0, limit) : filteredProducts;

    return (
        <section id="shop" className={styles.shop}>
            <div className={styles.sectionHeader}>
                <h2>Feline <span>Essentials</span></h2>
                <p>Handpicked premium products for your cat.</p>
            </div>

            <div className={styles.controls}>
                <div className={styles.searchBar}>
                    <span>🔍</span>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className={styles.filters}>
                    <button
                        className={filter === "all" ? styles.active : ""}
                        onClick={() => setFilter("all")}
                    >All</button>
                    <button
                        className={filter === "amazon" ? styles.active : ""}
                        onClick={() => setFilter("amazon")}
                    >Amazon</button>
                    <button
                        className={filter === "aliexpress" ? styles.active : ""}
                        onClick={() => setFilter("aliexpress")}
                    >AliExpress</button>
                </div>
            </div>

            <div className={styles.grid}>
                {displayProducts.map((item, index) => (
                    <motion.div
                        key={item.id || index}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className={styles.productCard}
                    >
                        <div className={styles.imageWrapper}>
                            <img src={item.image} alt={item.name} className={styles.image} />
                            <span className={`${styles.platformTag} ${styles[item.platform]}`}>
                                {item.platform === 'amazon' ? 'Amazon' : 'AliExpress'}
                            </span>
                        </div>
                        <div className={styles.info}>
                            <h3>{item.name}</h3>
                            <p className={styles.price}>{item.price}</p>
                            <a href={item.link} className={styles.buyBtn} target="_blank" rel="noopener noreferrer">
                                Buy on {item.platform === 'amazon' ? 'Amazon' : 'AliExpress'}
                            </a>
                        </div>
                    </motion.div>
                ))}
            </div>

            {loading && <p className={styles.loading}>Loading products...</p>}
            {!loading && displayProducts.length === 0 && <p className={styles.empty}>No products found.</p>}

            {limit && filteredProducts.length > limit && (
                <div className={styles.viewMoreContainer}>
                    <Link href="/shop" className={styles.viewMoreBtn}>
                        View More Products <span>→</span>
                    </Link>
                </div>
            )}
        </section>
    );
}
