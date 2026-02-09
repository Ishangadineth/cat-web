"use client";
import { motion } from "framer-motion";
import styles from "./BreedsSection.module.css";
import AdContainer from "./AdContainer";

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
    }
];

export default function BreedsSection({ limit = null }) {
    const displayBreeds = limit ? breeds.slice(0, limit) : breeds;

    return (
        <section id="breeds" className={styles.breeds}>
            <div className={styles.sectionHeader}>
                <h2>Explore <span>Breeds</span></h2>
                <p>Find the perfect companion from our curated list of feline royalty.</p>
            </div>

            <div className={styles.grid}>
                {displayBreeds.map((breed, index) => (
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
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
