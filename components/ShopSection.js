"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./ShopSection.module.css";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, orderBy, addDoc, serverTimestamp } from "firebase/firestore";
import AdContainer from "./AdContainer";
import Link from "next/link";

const ProductCard = ({ item }) => {
    const images = item.images && item.images.length > 0 ? item.images : [item.image];
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        if (images.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 3000); // Change image every 3 seconds
        return () => clearInterval(interval);
    }, [images.length]);

    const nextImage = (e) => {
        e.preventDefault();
        setCurrentImage((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e) => {
        e.preventDefault();
        setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={styles.productCard}
        >
            <div className={styles.imageWrapper}>
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentImage}
                        src={images[currentImage]}
                        alt={item.name}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={styles.image}
                    />
                </AnimatePresence>

                {images.length > 1 && (
                    <>
                        <button className={styles.prevBtn} onClick={prevImage}>‹</button>
                        <button className={styles.nextBtn} onClick={nextImage}>›</button>
                        <div className={styles.imageDots}>
                            {images.map((_, i) => (
                                <span key={i} className={i === currentImage ? styles.activeDot : ""} />
                            ))}
                        </div>
                    </>
                )}

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
    );
};

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
                    <ProductCard key={item.id || index} item={item} />
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

