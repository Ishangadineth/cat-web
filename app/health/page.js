"use client";
import { motion } from "framer-motion";
import styles from "./health.module.css";

const healthTips = [
    {
        title: "Nutrition & Diet",
        icon: "🥣",
        description: "A balanced diet is crucial for a long life. Cats are obligate carnivores and require specific nutrients like taurine.",
        checklist: ["High-protein wet food", "Fresh water always available", "Avoid hazardous foods (onions, chocolate)"]
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
        checklist: ["Daily play sessions", "Vertical spaces (Cat towers)", "Puzzle feeders"]
    },
    {
        title: "Grooming Essentials",
        icon: "✂️",
        description: "While cats are clean animals, they benefit from regular grooming to reduce shedding and hairballs.",
        checklist: ["Regular brushing", "Nail trimming (every 2-3 weeks)", "Ear cleaning when necessary"]
    }
];

export default function Health() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.title}
                >
                    Cat <span>Care & Health</span>
                </motion.h1>
                <p className={styles.subtitle}>Essential tips to keep your feline companion thriving.</p>
            </header>

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
                        <h2>{tip.title}</h2>
                        <p>{tip.description}</p>
                        <ul className={styles.checklist}>
                            {tip.checklist.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
