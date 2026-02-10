"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import styles from "./ContactSection.module.css";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function ContactSection() {
    const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
    const [status, setStatus] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "feedback"), {
                ...formData,
                createdAt: serverTimestamp()
            });
            setStatus("success");
            setFormData({ name: "", email: "", subject: "", message: "" });
        } catch (err) {
            console.error(err);
            setStatus("error");
        }
    };

    return (
        <section id="contact" className={styles.contact}>
            <div className={styles.sectionHeader}>
                <h2>Get in <span>Touch</span></h2>
                <p>Have questions, feedback, or found a bug? We'd love to hear from you.</p>
            </div>

            <div className={styles.container}>
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className={styles.info}
                >
                    <div className={styles.infoCard}>
                        <h3>Contact Info</h3>
                        <p>Feel free to reach out to us. We typically respond within 24 hours.</p>
                        <div className={styles.item}>
                            <span>📧</span>
                            <p>contact@petgoofy.ishangadineth.online</p>
                        </div>
                        <div className={styles.item}>
                            <span>📍</span>
                            <p>Global Cat Community</p>
                        </div>
                    </div>
                </motion.div>

                <motion.form
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    onSubmit={handleSubmit}
                    className={styles.form}
                >
                    {status === "success" && <p className={styles.success}>Message sent successfully!</p>}
                    {status === "error" && <p className={styles.error}>Failed to send message. Please try again.</p>}

                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <input
                        type="text"
                        placeholder="Subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                    />
                    <textarea
                        placeholder="Your Message"
                        rows="5"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                    ></textarea>
                    <button type="submit" className={styles.submitBtn}>Send Message</button>
                </motion.form>
            </div>
        </section>
    );
}
