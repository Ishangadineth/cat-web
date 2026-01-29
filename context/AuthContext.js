"use client";
import { createContext, useContext, useEffect, useState } from "react";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    signInWithPopup
} from "firebase/auth";
import { auth, db, googleProvider, facebookProvider, githubProvider, appleProvider } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const userDocRef = doc(db, "users", firebaseUser.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    setUser({ ...firebaseUser, ...userDoc.data() });
                } else {
                    // This handles cases where user logs in via social but no firestore doc exists yet
                    const userData = {
                        username: firebaseUser.displayName || firebaseUser.email.split('@')[0],
                        email: firebaseUser.email,
                        uid: firebaseUser.uid,
                        avatar: firebaseUser.photoURL || null,
                        createdAt: new Date().toISOString()
                    };
                    await setDoc(userDocRef, userData);
                    setUser({ ...firebaseUser, ...userData });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
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

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loginWithProvider, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
