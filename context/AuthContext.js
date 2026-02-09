"use client";
import { createContext, useContext, useEffect, useState } from "react";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    signInWithPopup,
    sendPasswordResetEmail
} from "firebase/auth";
import { auth, db, googleProvider, facebookProvider, githubProvider, appleProvider } from "@/lib/firebase";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribeDoc = null;

        const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
            if (unsubscribeDoc) unsubscribeDoc(); // Cleanup previous listener

            if (firebaseUser) {
                const userDocRef = doc(db, "users", firebaseUser.uid);

                unsubscribeDoc = onSnapshot(userDocRef, (docSnap) => {
                    if (docSnap.exists()) {
                        setUser({ ...firebaseUser, ...docSnap.data() });
                    } else {
                        // Handle new user creation as before
                        const userData = {
                            username: firebaseUser.displayName || firebaseUser.email.split('@')[0],
                            email: firebaseUser.email,
                            uid: firebaseUser.uid,
                            avatar: firebaseUser.photoURL || null,
                            savedPosts: [],
                            createdAt: new Date().toISOString()
                        };
                        setDoc(userDocRef, userData);
                        setUser({ ...firebaseUser, ...userData });
                    }
                    setLoading(false);
                });
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeDoc) unsubscribeDoc();
        };
    }, []);

    const signup = async (email, password, username) => {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", res.user.uid), {
            username,
            email,
            uid: res.user.uid,
            createdAt: new Date().toISOString()
        });
        return res;
    };

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const loginWithProvider = async (providerName) => {
        let provider;
        switch (providerName) {
            case 'google': provider = googleProvider; break;
            case 'facebook': provider = facebookProvider; break;
            case 'github': provider = githubProvider; break;
            case 'apple': provider = appleProvider; break;
            default: throw new Error("Invalid provider");
        }
        return signInWithPopup(auth, provider);
    };

    const logout = () => {
        return signOut(auth);
    };

    const resetPassword = (email) => {
        return sendPasswordResetEmail(auth, email);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loginWithProvider, resetPassword, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
