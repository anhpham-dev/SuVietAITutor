
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';

export const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }
        setLoading(true);
        setError('');

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Create user document
            await setDoc(doc(db, "users", userCredential.user.uid), {
                email: email,
                role: 'user',
                apiKey: ''
            });
            navigate('/');
        } catch (err: any) {
            setError('Failed to create an account. ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-history-parchment/20 p-3 sm:p-4 font-serif">
            <div className="max-w-md w-full glass-panel p-6 sm:p-8 border border-history-gold/30 rounded-lg shadow-2xl relative">
                <Link to="/" className="absolute top-3 sm:top-4 left-3 sm:left-4 text-history-wood hover:text-history-ink transition-colors">
                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
                <div className="flex flex-col items-center mb-6 sm:mb-8">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-history-gold/10 rounded-full flex items-center justify-center mb-3 sm:mb-4 text-history-ink">
                        <UserPlus className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-display font-medium text-history-ink tracking-wide text-center">Scholar Registration</h2>
                    <p className="text-history-wood text-xs sm:text-sm italic mt-1 sm:mt-2 text-center">Join the archives of history</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-800 border border-red-200 rounded-lg text-sm flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-history-wood uppercase tracking-widest mb-1.5">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/50 border border-history-gold/20 rounded-md px-4 py-2.5 text-history-dark focus:outline-none focus:ring-1 focus:ring-history-gold/50 placeholder-history-wood/30"
                            required
                            placeholder="scholar@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-history-wood uppercase tracking-widest mb-1.5">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/50 border border-history-gold/20 rounded-md px-4 py-2.5 text-history-dark focus:outline-none focus:ring-1 focus:ring-history-gold/50 placeholder-history-wood/30"
                            required
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-history-wood uppercase tracking-widest mb-1.5">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-white/50 border border-history-gold/20 rounded-md px-4 py-2.5 text-history-dark focus:outline-none focus:ring-1 focus:ring-history-gold/50 placeholder-history-wood/30"
                            required
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-history-ink hover:bg-black text-history-paper py-3 rounded-md font-display font-medium text-sm tracking-widest uppercase transition-all shadow-md mt-4 flex items-center justify-center gap-2 disabled:opacity-70 active:scale-[0.98]"
                    >
                        {loading ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Creating Account...</>
                        ) : (
                            'Register'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-history-wood">
                    <p>Already a scholar? <Link to="/login" className="text-history-red hover:underline font-medium">Login</Link></p>
                </div>
            </div>
        </div>
    );
};
