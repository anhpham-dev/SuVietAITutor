'use client';

import React from 'react';
import { redirect } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-history-wood">Loading...</div>;
    }

    if (!currentUser) {
        redirect('/login');
    }

    return <>{children}</>;
};
