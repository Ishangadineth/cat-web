"use client";
import { motion } from "framer-motion";
import styles from "./breeds.module.css";
import AdContainer from "@/components/AdContainer";

const breeds = [
    {
        name: "Maine Coon",
        origin: "USA",
        traits: "Gentle Giant, Friendly, Fluffy",
        image: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=1935&auto=format&fit=crop"
    },
    {
        name: "Persian",
        origin: "Iran",
        traits: "Quiet, Sweet, Dignified",
        image: "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?q=80&w=1887&auto=format&fit=crop"
    },
    {
        name: "Siamese",
        origin: "Thailand",
        traits: "Vocal, Social, Intelligent",
        image: "https://images.unsplash.com/photo-1513245543132-31f507417b26?q=80&w=1935&auto=format&fit=crop"
    },
    {
        name: "Bengal",
        origin: "USA",
        traits: "Wild-looking, Energetic, Playful",
        image: "https://images.unsplash.com/photo-1513360309081-38f0d6d95e0c?q=80&w=2070&auto=format&fit=crop"
    },
    {
        name: "Scottish Fold",
        origin: "Scotland",
        traits: "Folded Ears, Loving, Calm",
        image: "https://images.unsplash.com/photo-1548247416-ec66f4900b2e?q=80&w=1920&auto=format&fit=crop"
    },
    {
        name: "Sphynx",
        origin: "Canada",
        traits: "Hairless, Social, Attention-seeking",
        image: "https://images.unsplash.com/photo-1520315342629-6ea920342248?q=80&w=1780&auto=format&fit=crop"
    }
];

export default function Breeds() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.title}
                >
                    Explore <span>Breeds</span>
                </motion.h1>
                <p className={styles.subtitle}>Find the perfect companion from our curated list of feline royalty.</p>
            </header>

            <div className={styles.layout}>
                <div className={styles.mainContent}>
                    <div className={styles.grid}>
                        {breeds.map((breed, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className={styles.breedCard}
                            >
                                <div className={styles.imageWrapper}>
                                    <img src={breed.image} alt={breed.name} className={styles.image} />
                                </div>
                                <div className={styles.info}>
                                    <h3>{breed.name}</h3>
                                    <span className={styles.origin}>{breed.origin}</span>
                                    <p>{breed.traits}</p>
                                    <button className={styles.learnMore}>Learn More</button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <aside className={styles.sidebar}>
                    <AdContainer type="banner-160-600" />
                    <AdContainer type="banner-160-300" />
                </aside>
            </div>
            <AdContainer type="banner-728-90" />
        </div>
    );
}
