"use client";
import { motion } from "framer-motion";
import styles from "./page.module.css";
import AdContainer from "@/components/AdContainer";
import Link from "next/link";

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

      {/* Featured Categories */}
      <section className={styles.categories}>
        <div className={styles.sectionHeader}>
          <h2>Explore the <span>Universe</span></h2>
          <p>Everything you need to know about your cat.</p>
        </div>

        <div className={styles.categoryGrid}>
          <Link href="/history" className={styles.categoryCard}>
            <img src="https://images.unsplash.com/photo-1574158622682-e40e69881006?q=80&w=2033&auto=format&fit=crop" className={styles.categoryImage} />
            <div className={styles.categoryOverlay}>
              <h3>History</h3>
              <p>10,000 years of evolution</p>
            </div>
          </Link>

          <Link href="/behavior" className={styles.categoryCard}>
            <img src="https://images.unsplash.com/photo-1511044568932-338cba0ad803?q=80&w=2070&auto=format&fit=crop" className={styles.categoryImage} />
            <div className={styles.categoryOverlay}>
              <h3>Behavior</h3>
              <p>Decode the secret language</p>
            </div>
          </Link>

          <Link href="/health" className={styles.categoryCard}>
            <img src="https://images.unsplash.com/photo-1592194996308-7b43878e84a6?q=80&w=1887&auto=format&fit=crop" className={styles.categoryImage} />
            <div className={styles.categoryOverlay}>
              <h3>Health</h3>
              <p>Tips for a thriving kitty</p>
            </div>
          </Link>
        </div>
      </section>

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

      {/* Hook / Newsletter Section */}
      <section className={styles.newsletter}>
        <div className={styles.newsletterBox}>
          <div className={styles.newsletterContent}>
            <h2>Join the <span>Pride</span></h2>
            <p>Get exclusive cat care tips and product deals.</p>
          </div>
          <div className={styles.newsletterInput}>
            <input type="email" placeholder="Enter your email" className={styles.inputField} />
            <button className={styles.primaryBtn}>Subscribe</button>
          </div>
        </div>
      </section>
    </div>
  );
}
