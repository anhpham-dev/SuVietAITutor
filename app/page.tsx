'use client';

import { Home } from '@/components/Home';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function HomePage() {
    return (
        <ProtectedRoute>
            <Home />
        </ProtectedRoute>
    );
}
