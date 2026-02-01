"use client";
import { useEffect } from "react";

export default function AdManager() {
    useEffect(() => {
        // --- Social Bar ---
        const socialBarScript = document.createElement("script");
        socialBarScript.src = "https://pl28623492.effectivegatecpm.com/19/2a/fb/192afb51fd558ef663991ce5ca9c3547.js";
        socialBarScript.async = true;
        document.body.appendChild(socialBarScript);

        // --- Popunder with 2-minute interval ---
        const POPUNDER_COOLDOWN = 120000; // 2 minutes in milliseconds
        const now = Date.now();
        const lastPop = localStorage.getItem("last_popunder_show");

        if (!lastPop || (now - parseInt(lastPop)) > POPUNDER_COOLDOWN) {
            const popunderScript = document.createElement("script");
            popunderScript.src = "https://pl28623520.effectivegatecpm.com/65/8e/f7/658ef78aec5c6e4a79e0b0b46de443f6.js";
            popunderScript.async = true;
            document.body.appendChild(popunderScript);

            localStorage.setItem("last_popunder_show", now.toString());
        }

        return () => {
            // Cleanup scripts if needed (optional for Adsterra)
        };
    }, []);

    return null; // This component doesn't render anything visible
}
