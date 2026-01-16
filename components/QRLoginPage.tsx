
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Loader2, AlertCircle, CheckCircle2, ArrowLeft, QrCode } from 'lucide-react';

interface LoginToken {
    token: string;
    userId: string;
    email: string;
    password: string;
    name?: string;
    used: boolean;
    createdAt: any;
    expiresAt?: any;
}

type LoginStatus = 'loading' | 'success' | 'error' | 'expired' | 'used';

export const QRLoginPage: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const [status, setStatus] = useState<LoginStatus>('loading');
    const [message, setMessage] = useState('Validating login token...');
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const processLogin = async () => {
            if (!token) {
                setStatus('error');
                setMessage('No login token provided.');
                return;
            }

            try {
                // Fetch token document from Firestore
                const tokenDoc = await getDoc(doc(db, 'loginTokens', token));

                if (!tokenDoc.exists()) {
                    setStatus('error');
                    setMessage('Invalid or expired login token.');
                    return;
                }

                const tokenData = tokenDoc.data() as LoginToken;
                setUserName(tokenData.name || tokenData.email);

                // Check if token has been used
                if (tokenData.used) {
                    setStatus('used');
                    setMessage('This login token has already been used.');
                    return;
                }

                // Check if token has expired
                if (tokenData.expiresAt && tokenData.expiresAt.toDate() < new Date()) {
                    setStatus('expired');
                    setMessage('This login token has expired.');
                    return;
                }

                setMessage('Signing you in...');

                // Sign in the user
                await signInWithEmailAndPassword(auth, tokenData.email, tokenData.password);

                // Mark token as used
                await updateDoc(doc(db, 'loginTokens', token), {
                    used: true,
                    usedAt: new Date()
                });

                setStatus('success');
                setMessage('Login successful! Redirecting...');

                // Redirect to home after a brief moment
                setTimeout(() => {
                    navigate('/');
                }, 1500);

            } catch (error: any) {
                console.error('QR Login error:', error);
                setStatus('error');
                if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                    setMessage('Invalid credentials. Please contact the administrator.');
                } else if (error.code === 'auth/invalid-credential') {
                    setMessage('Invalid login credentials. The password may have changed.');
                } else {
                    setMessage('Failed to sign in. Please try again or contact the administrator.');
                }
            }
        };

        processLogin();
    }, [token, navigate]);

    const getStatusIcon = () => {
        switch (status) {
            case 'loading':
                return <Loader2 className="w-12 h-12 text-history-gold animate-spin" />;
            case 'success':
                return <CheckCircle2 className="w-12 h-12 text-green-500" />;
            case 'error':
            case 'expired':
            case 'used':
                return <AlertCircle className="w-12 h-12 text-history-red" />;
        }
    };

    const getStatusTitle = () => {
        switch (status) {
            case 'loading':
                return 'Processing...';
            case 'success':
                return 'Welcome!';
            case 'error':
                return 'Login Failed';
            case 'expired':
                return 'Token Expired';
            case 'used':
                return 'Token Already Used';
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-history-parchment/20 p-3 sm:p-4 font-serif">
            <div className="max-w-md w-full glass-panel p-6 sm:p-8 border border-history-gold/30 rounded-lg shadow-2xl text-center">
                <div className="flex flex-col items-center mb-4 sm:mb-6">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-history-gold/10 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                        {getStatusIcon()}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-display font-medium text-history-ink tracking-wide">
                        {getStatusTitle()}
                    </h2>
                    {userName && status === 'success' && (
                        <p className="text-history-wood text-xs sm:text-sm mt-1 sm:mt-2">
                            Signed in as <span className="font-medium text-history-ink">{userName}</span>
                        </p>
                    )}
                </div>

                <div className={`p-4 rounded-lg mb-6 ${status === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : status === 'loading'
                        ? 'bg-history-gold/10 text-history-wood border border-history-gold/20'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                    <div className="flex items-center justify-center gap-2">
                        {status === 'loading' && <QrCode className="w-4 h-4" />}
                        <span className="text-sm">{message}</span>
                    </div>
                </div>

                {(status === 'error' || status === 'expired' || status === 'used') && (
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-history-ink text-history-paper rounded-md font-display font-medium text-sm tracking-widest uppercase hover:bg-black transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go to Login
                    </Link>
                )}

                {status === 'success' && (
                    <div className="flex items-center justify-center gap-2 text-history-wood text-sm">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Redirecting to home...</span>
                    </div>
                )}
            </div>
        </div>
    );
};
