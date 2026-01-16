
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../services/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';

export interface UserProfile {
    email: string;
    role: string;
    apiKey?: string;
}

interface AuthContextType {
    currentUser: User | null;
    userProfile: UserProfile | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    currentUser: null,
    userProfile: null,
    loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            if (user) {
                // Subscribe to user profile updates
                const unsubProfile = onSnapshot(doc(db, "users", user.uid), (doc) => {
                    if (doc.exists()) {
                        setUserProfile(doc.data() as UserProfile);
                    } else {
                        setUserProfile(null);
                    }
                    setLoading(false);
                }, (error) => {
                    console.error("Error fetching user profile:", error);
                    setLoading(false);
                });
                return () => unsubProfile();
            } else {
                setUserProfile(null);
                setLoading(false);
            }
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        userProfile,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
