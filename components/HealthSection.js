"use client";
import { motion } from "framer-motion";
import styles from "./HealthSection.module.css";

const healthTips = [
    {
        title: "Nutrition & Diet",
        icon: "🥣",
        description: "A balanced diet is crucial for a long life. Cats are obligate carnivores and require specific nutrients like taurine.",
        checklist: ["High-protein wet food", "Fresh water always available", "Avoid hazardous foods"]
    },
    {
        title: "Preventative Care",
        icon: "💉",
        description: "Regular vet checkups and vaccinations are essential to prevent common feline diseases and parasites.",
        checklist: ["Annual vaccinations", "Flea & Tick prevention", "Dental hygiene checkups"]
    },
    {
        title: "Physical Activity",
        icon: "🧶",
        description: "Indoor cats need mental and physical stimulation to prevent obesity and behavioral issues.",
        checklist: ["Daily play sessions", "Vertical spaces", "Puzzle feeders"]
    }
];

export default function HealthSection() {
    return (
        <section id="health" className={styles.health}>
            <div className={styles.sectionHeader}>
                <h2>Cat <span>Health & Care</span></h2>
                <p>Essential tips to keep your feline companion thriving.</p>
            </div>

            <div className={styles.grid}>
                {healthTips.map((tip, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={styles.card}
                    >
                        <span className={styles.icon}>{tip.icon}</span>
                        <h3>{tip.title}</h3>
                        <p>{tip.description}</p>
                        <ul className={styles.checklist}>
                            {tip.checklist.map((item, i) => (
                                <li key={i}>✓ {item}</li>
                            ))}
                        </ul>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
