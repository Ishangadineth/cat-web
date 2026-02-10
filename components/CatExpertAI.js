"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./CatExpertAI.module.css";

export default function CatExpertAI() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Meow! 🐾 I'm your Cat Expert AI. Ask me anything about cats, health, or our products!" }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

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

        // Simulated AI Response (Can be connected to OpenAI/Gemini later)
        setTimeout(() => {
            let response = "That's a great question! For specific health issues, I always recommend seeing a vet, but generally cats love high-protein diets and lots of vertical space! 🐱";

            const lowerInput = input.toLowerCase();
            if (lowerInput.includes("food")) response = "Cats are obligate carnivores! Check out our Shop for premium grain-free food. 🍗";
            if (lowerInput.includes("toy")) response = "Interactive laser toys and feather wands are great for keeping your cat active! 🎾";
            if (lowerInput.includes("hello") || lowerInput.includes("hi")) response = "Meow! How can I help you and your feline friend today? 🐾";

            setMessages(prev => [...prev, { role: "assistant", content: response }]);
            setIsTyping(false);
        }, 1500);
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
                                <span>🐾</span>
                                <div>
                                    <h4>Cat Expert AI</h4>
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
