"use client";
import ShopSection from "@/components/ShopSection";
import styles from "./shop.module.css";
import AdminPanel from "@/components/AdminPanel";

export default function ShopPage() {
    return (
        <div className={styles.container}>
            <div className={styles.pageHeader}>
                <h1>Full <span>Shop</span></h1>
                <p>Browse our entire collection of handpicked cat products.</p>
            </div>

            <AdminPanel />

            <ShopSection /> {/* No limit here */}
        </div>
    );
}
