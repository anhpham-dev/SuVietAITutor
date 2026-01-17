'use client';

import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/components/Toast';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <link
                    rel="icon"
                    type="image/svg+xml"
                    href="https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg"
                />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>SuViet AI Tutor</title>
            </head>
            <body className="bg-history-paper min-h-screen selection:bg-history-red/20 selection:text-history-dark overflow-x-hidden">
                <ToastProvider>
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </ToastProvider>
            </body>
        </html>
    );
}
