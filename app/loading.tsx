import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-history-paper/80 backdrop-blur-sm z-50">
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <div className="absolute inset-0 bg-history-gold/20 rounded-full blur-xl animate-pulse"></div>
                    <Loader2 className="w-12 h-12 text-history-gold animate-spin relative z-10" />
                </div>
                <p className="font-display font-medium text-history-wood text-lg animate-pulse tracking-widest uppercase">
                    Loading...
                </p>
            </div>
        </div>
    );
}
