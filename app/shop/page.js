"use client";
import { motion } from "framer-motion";
import styles from "./shop.module.css";
import AdContainer from "@/components/AdContainer";

const products = [
    {
        name: "Premium Cat Tower",
        price: "$129.99",
        category: "Furniture",
        image: "https://images.unsplash.com/photo-1545249390-6bdf99c59e7a?q=80&w=1888&auto=format&fit=crop",
        link: "#"
    },
    {
        name: "Interactive Laser Toy",
        price: "$24.99",
        category: "Toys",
        image: "https://images.unsplash.com/photo-1591768793355-74d7c8626685?q=80&w=2070&auto=format&fit=crop",
        link: "#"
    },
    {
        name: "Organic Catnip Mix",
        price: "$12.50",
        category: "Treats",
        image: "https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?q=80&w=1935&auto=format&fit=crop",
        link: "#"
    },
    {
        name: "Self-Cleaning Litter Box",
        price: "$399.00",
        category: "Essentials",
        image: "https://images.unsplash.com/photo-1516750105099-4b8a83e217ee?q=80&w=2070&auto=format&fit=crop",
        link: "#"
    }
];

export default function Shop() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={styles.title}
                >
                    Feline <span>Essentials</span>
                </motion.h1>
                <p className={styles.subtitle}>Handpicked premium products for your feline royalty.</p>
            </header>

            <AdContainer position="shop-top" />

            <div className={styles.grid}>
                {products.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={styles.productCard}
                    >
                        <div className={styles.imageWrapper}>
                            <img src={item.image} alt={item.name} className={styles.image} />
                            <span className={styles.tag}>{item.category}</span>
                        </div>
                        <div className={styles.info}>
                            <h3>{item.name}</h3>
                            <p className={styles.price}>{item.price}</p>
                            <a href={item.link} className={styles.buyBtn} target="_blank" rel="noopener noreferrer">
                                View on Amazon
                            </a>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
