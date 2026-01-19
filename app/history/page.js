"use client";
import { motion } from "framer-motion";
import styles from "./history.module.css";

const timelineData = [
    {
        year: "10,000 BCE",
        title: "The First Bond",
        description: "The first evidence of taming wildcats in the Near East. Near Eastern wildcats (Felis lybica) began living near human settlements.",
        icon: "🏺"
    },
    {
        year: "3,100 BCE",
        title: "Egyptian Deities",
        description: "In Ancient Egypt, cats were revered as gods. Killing a cat was a capital crime, and they were often mummified.",
        icon: "🐈‍⬛"
    },
    {
        year: "500 BCE",
        title: "Travelers of the Silk Road",
        description: "Cats began spreading to Greece and Rome via trade routes, becoming valued for their rodent-hunting skills.",
        icon: "🗺️"
    },
    {
        year: "1871 CE",
        title: "The First Cat Show",
        description: "The first modern cat show was held at the Crystal Palace in London, marking the start of formal breed recognition.",
        icon: "🏆"
    },
    {
        year: "Modern Day",
        title: "Global Companions",
        description: "Today, there are over 600 million domestic cats worldwide, with hundreds of recognized breeds.",
        icon: "🏠"
    }
];

export default function History() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.title}
                >
                    A Journey Through <span>Time</span>
                </motion.h1>
                <p className={styles.subtitle}>Trace the ancient lineage of our feline friends.</p>
            </header>

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
        </div>
    );
}
