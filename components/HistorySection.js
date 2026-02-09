"use client";
import { motion } from "framer-motion";
import styles from "./HistorySection.module.css";

const timelineData = [
    {
        year: "10,000 BCE",
        title: "The First Bond",
        description: "Evidence of taming wildcats in the Near East. Cats began living near human settlements.",
        icon: "🏺"
    },
    {
        year: "3,100 BCE",
        title: "Egyptian Deities",
        description: "In Ancient Egypt, cats were revered as gods. Killing a cat was a capital crime.",
        icon: "🐈‍⬛"
    },
    {
        year: "1871 CE",
        title: "The First Cat Show",
        description: "The first modern cat show was held in London, marking official breed recognition.",
        icon: "🏆"
    }
];

export default function HistorySection() {
    return (
        <section id="history" className={styles.history}>
            <div className={styles.sectionHeader}>
                <h2>Journey Through <span>Time</span></h2>
                <p>Trace the ancient lineage of our feline friends.</p>
            </div>

            <div className={styles.timeline}>
                {timelineData.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className={`${styles.timelineItem} ${index % 2 === 0 ? styles.left : styles.right}`}
                    >
                        <div className={styles.content}>
                            <span className={styles.year}>{item.year}</span>
                            <h3>{item.icon} {item.title}</h3>
                            <p>{item.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
