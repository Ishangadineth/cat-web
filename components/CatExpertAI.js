"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./CatExpertAI.module.css";

export default function CatExpertAI() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Meow! 🐾 I'm Goofy, your Cat Expert AI. Ask me anything about cats, health, or our products!" }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    const OPENAI_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { role: "user", content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${OPENAI_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        { role: "system", content: "You are 'Goofy', an expert cat AI for the website 'CatUniverse'. Your personality is friendly and feline-like. IMPORTANT: You only answer questions related to cats (breeds, health, care, behavior) and the CatUniverse website (shop, forum, breeds section). If a user asks about anything else (e.g., math, history of other animals, programming, politics), politely decline and say you only talk about cat-related things. Keep answers helpful but concise." },
                        ...messages.map(m => ({ role: m.role, content: m.content })),
                        userMsg
                    ]
                })
            });

            const data = await response.json();
            const aiContent = data.choices[0].message.content;
            setMessages(prev => [...prev, { role: "assistant", content: aiContent }]);
        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I'm feeling a bit sleepy (API error). Meow again later!" }]);
        }
        setIsTyping(false);
    };

    return (
        <div className={styles.aiWrapper}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className={styles.chatWindow}
                    >
                        <div className={styles.header}>
                            <div className={styles.headerTitle}>
                                <span>😺</span>
                                <div>
                                    <h4>Goofy (Cat Expert)</h4>
                                    <p>Online & Purring</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)}>×</button>
                        </div>

                        <div className={styles.messages} ref={scrollRef}>
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`${styles.message} ${styles[msg.role]}`}>
                                    <div className={styles.bubble}>{msg.content}</div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className={`${styles.message} ${styles.assistant}`}>
                                    <div className={`${styles.bubble} ${styles.typing}`}>
                                        <span>.</span><span>.</span><span>.</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleSend} className={styles.inputArea}>
                            <input
                                type="text"
                                placeholder="Ask about cats..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <button type="submit">➤</button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={styles.fab}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? "✕" : "💬"}
                {!isOpen && <span className={styles.badge}>1</span>}
            </motion.button>
        </div>
    );
}
