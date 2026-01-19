"use client";
import { motion } from "framer-motion";
import styles from "./behavior.module.css";

const behaviors = [
    {
        title: "The Purr",
        description: "While often a sign of contentment, cats also purr to heal themselves. The frequency of a purr (25-150 Hertz) can improve bone density and speed up recovery.",
        tip: "If your cat purrs while injured, they are using it as a natural therapy."
    },
    {
        title: "Slow Blink",
        description: "The 'cat kiss'. A slow blink is a sign of extreme trust and love. In the wild, closing eyes is a vulnerable act.",
        tip: "Slow blink back at your cat to strengthen your bond."
    },
    {
        title: "Kneading (Making Biscuits)",
        description: "This behavior stems from kittenhood when they knead their mother to stimulate milk flow. In adults, it's a sign of comfort and security.",
        tip: "Always keep their claws trimmed to enjoy 'biscuit making' comfortably!"
    },
    {
        title: "Zoomies (FRAPs)",
        description: "Frenetic Random Activity Periods. This is just your cat's way of burning off pent-up energy, especially after a long nap.",
        tip: "Engage them in play during these times to help them settle."
    }
];

export default function Behavior() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.title}
                >
                    Cat <span>Behavior</span> Decoded
                </motion.h1>
                <p className={styles.subtitle}>Understand the subtle language of your feline overlords.</p>
            </header>

            <div className={styles.grid}>
                {behaviors.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={styles.behaviorCard}
                    >
                        <h2>{item.title}</h2>
                        <p>{item.description}</p>
                        <div className={styles.tip}>
                            <strong>Pro Tip:</strong> {item.tip}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
