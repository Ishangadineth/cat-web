"use client";
import { motion } from "framer-motion";
import styles from "./page.module.css";
import AdContainer from "@/components/AdContainer";
import Link from "next/link";
import BreedsSection from "@/components/BreedsSection";
import ShopSection from "@/components/ShopSection";
import ContactSection from "@/components/ContactSection";
import AdminPanel from "@/components/AdminPanel";
import HealthSection from "@/components/HealthSection";
import HistorySection from "@/components/HistorySection";
import ForumSection from "@/components/ForumSection";

export default function Home() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={styles.heroContent}
        >
          <h1 className={styles.title}>
            Discover the <span className={styles.highlight}>Whiskered</span> Wonders
          </h1>
          <p className={styles.subtitle}>
            From ancient Egyptian gods to modern-day companions. Explore the history,
            behavior, and the best products for your feline royalty.
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/breeds" className={styles.primaryBtn}>Explore Breeds</Link>
            <Link href="/#forum-preview" className={styles.secondaryBtn}>Forum</Link>
            <Link href="/shop" className={styles.secondaryBtn}>Shop Favorites</Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className={styles.heroImgContainer}
        >
          <div className={styles.heroImageOverlay}></div>
          <img
            src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=2043&auto=format&fit=crop"
            alt="Majestic Cat"
            className={styles.heroImage}
          />
        </motion.div>
      </section>

      <AdContainer type="banner-468-60" />

      {/* History Section */}
      <HistorySection />

      <AdContainer type="banner-468-60" />

      {/* Breeds Section */}
      <BreedsSection limit={4} />

      <AdContainer type="banner-728-90" />

      {/* Forum Section */}
      <ForumSection displayLimit={3} />

      <AdContainer type="banner-728-90" />

      {/* Shop Section */}
      <ShopSection limit={4} />

      <AdContainer type="banner-728-90" />

      {/* Health Section */}
      <HealthSection />

      <AdminPanel />

      <AdContainer type="banner-728-90" />


      {/* Features/Values Section */}
      <section className={styles.features}>
        <div className={styles.sectionHeader}>
          <h2>Why CatUniverse?</h2>
          <p>The ultimate guide for every cat enthusiast.</p>
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>Ancient History</h3>
            <p>Trace the lineage of cats from 10,000 years ago to today.</p>
          </div>
          <div className={styles.card}>
            <h3>300+ Breeds</h3>
            <p>Detailed profiles and characteristics of every recognized breed.</p>
          </div>
          <div className={styles.card}>
            <h3>Behavior Decoded</h3>
            <p>Understand why your cat does what it does with expert insights.</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <ContactSection />

    </div>
  );
}
