"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./funzone.module.css";
import AdContainer from "@/components/AdContainer";

const names = {
    white: ["Snowball", "Pearl", "Casper", "Luna", "Yuki", "Ivory", "Marshmallow"],
    black: ["Shadow", "Midnight", "Salem", "Eclipse", "Nyx", "Raven", "Onyx"],
    ginger: ["Simba", "Leo", "Ginger", "Oliver", "Milo", "Pumpkin", "Cheddar"],
    grey: ["Smokey", "Misty", "Ash", "Gracie", "Storm", "Dusty", "Blue"],
    calico: ["Patches", "Callie", "Dot", "Marble", "Pixel", "Truffle"],
    other: ["Mittens", "Coco", "Bella", "Lucky", "Whiskers", "Toffee", "Pixel"]
};

export default function FunZone() {
    const [color, setColor] = useState("");
    const [generatedName, setGeneratedName] = useState("");

    const handleGenerate = () => {
        const category = color || "other";
        const list = names[category];
        const randomName = list[Math.floor(Math.random() * list.length)];
        setGeneratedName(randomName);
    };

    return (
        <div className={styles.container}>
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className={styles.title}
            >
                Cat <span>Fun Zone</span>
            </motion.h1>

            <AdContainer type="banner-468-60" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={styles.generatorBox}
            >
                <h3>✨ Magic Name Generator</h3>
                <p className={styles.label}>Select your cat's primary color to find the perfect name:</p>

                <select
                    className={styles.inputField}
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                >
                    <option value="">-- Choose Color --</option>
                    <option value="white">White</option>
                    <option value="black">Black</option>
                    <option value="ginger">Ginger / Orange</option>
                    <option value="grey">Grey / Blue</option>
                    <option value="calico">Calico / Tortie</option>
                    <option value="other">Other / Mixed</option>
                </select>

                <button className={styles.generateBtn} onClick={handleGenerate}>
                    Generate Name
                </button>

                <AnimatePresence>
                    {generatedName && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className={styles.result}
                        >
                            <p>Your Cat's Name Should Be:</p>
                            <h2>{generatedName}</h2>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
            <AdContainer type="banner-300-250" />
            <AdContainer type="banner-728-90" />
        </div>
    );
}
