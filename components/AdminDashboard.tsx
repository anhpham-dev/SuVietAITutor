
import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, LogOut, ArrowLeft, Download, Plus, Trash2, Users, Save, Key, X, Loader2, Copy, Check, QrCode, Eye, EyeOff } from 'lucide-react';
import { auth, db } from '../services/firebase';
import { collection, getDocs, updateDoc, doc, Timestamp, setDoc, deleteDoc } from 'firebase/firestore';
import { UserProfile } from '../contexts/AuthContext';
import { useToast } from './Toast';
import { config } from '../services/config';

interface LoginToken {
    id: string;
    userId: string;
    email: string;
    password: string;
    name: string;
    createdAt: Date;
    createdBy: string;
    used: boolean;
}

interface UserWithId extends UserProfile {
    id: string;
}

export const AdminDashboard: React.FC = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [referralLink, setReferralLink] = useState('');
    const [inviteeName, setInviteeName] = useState('');

    const [users, setUsers] = useState<UserWithId[]>([]);
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [newKey, setNewKey] = useState('');
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [savingKey, setSavingKey] = useState(false);
    const [copied, setCopied] = useState(false);
    const { showToast } = useToast();

    // In a real app, this would come from Firestore
    // For now, simpler state to demonstrate generation
    const [generatedCodes, setGeneratedCodes] = useState<{ name: string, code: string, date: string }[]>([]);

    // QR Login Token State
    const [loginTokens, setLoginTokens] = useState<LoginToken[]>([]);
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [tokenPassword, setTokenPassword] = useState('');
    const [tokenName, setTokenName] = useState('');
    const [generatingToken, setGeneratingToken] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [generatedQRLink, setGeneratedQRLink] = useState('');
    const [copiedQR, setCopiedQR] = useState(false);

    // View/Download QR Modal State
    const [viewingToken, setViewingToken] = useState<LoginToken | null>(null);

    const downloadQRCode = () => {
        const canvas = document.getElementById('qr-modal-canvas') as HTMLCanvasElement;
        if (canvas) {
            const pngUrl = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.href = pngUrl;
            downloadLink.download = `qr-login-${viewingToken?.name || 'token'}.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }
    };

    React.useEffect(() => {
        const fetchUsers = async () => {
            setLoadingUsers(true);
            try {
                const querySnapshot = await getDocs(collection(db, "users"));
                const userList: UserWithId[] = [];
                querySnapshot.forEach((doc) => {
                    userList.push({ id: doc.id, ...doc.data() } as UserWithId);
                });
                setUsers(userList);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoadingUsers(false);
            }
        };

        const fetchLoginTokens = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "loginTokens"));
                const tokenList: LoginToken[] = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    tokenList.push({
                        id: doc.id,
                        ...data,
                        createdAt: data.createdAt?.toDate?.() || new Date()
                    } as LoginToken);
                });
                setLoginTokens(tokenList.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
            } catch (error) {
                console.error("Error fetching login tokens:", error);
            }
        };

        if (currentUser) {
            fetchUsers();
            fetchLoginTokens();
        }
    }, [currentUser]);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    const handleUpdateKey = async (userId: string) => {
        setSavingKey(true);
        try {
            await updateDoc(doc(db, "users", userId), { apiKey: newKey });
            setUsers(users.map(u => u.id === userId ? { ...u, apiKey: newKey } : u));
            setEditingKey(null);
            setNewKey('');
            showToast('API Key updated successfully!', 'success');
        } catch (error) {
            console.error("Error updating API key:", error);
            showToast('Failed to update API key.', 'error');
        } finally {
            setSavingKey(false);
        }
    };

    const startEditingKey = (user: UserWithId) => {
        setEditingKey(user.id);
        setNewKey(user.apiKey || '');
    };

    const generateCode = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteeName) return;

        // Generate a random code or ID
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        const link = `${window.location.origin}/register?ref=${code}`;

        setReferralLink(link);
        setGeneratedCodes([{ name: inviteeName, code, date: new Date().toLocaleDateString() }, ...generatedCodes]);
        setInviteeName('');
    };

    const generateQRLoginToken = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser || !tokenPassword) {
            showToast('Please select a user and enter a password.', 'error');
            return;
        }

        setGeneratingToken(true);
        try {
            const user = users.find(u => u.id === selectedUser);
            if (!user) {
                showToast('User not found.', 'error');
                return;
            }

            // Generate unique token ID
            const tokenId = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);

            const tokenData = {
                token: tokenId,
                userId: user.id,
                email: user.email,
                password: tokenPassword,
                name: tokenName || user.email.split('@')[0],
                createdAt: Timestamp.now(),
                createdBy: currentUser?.uid || '',
                used: false
            };

            await setDoc(doc(db, 'loginTokens', tokenId), tokenData);

            const link = `${window.location.origin}/qr-login/${tokenId}`;
            setGeneratedQRLink(link);

            // Add to local state
            setLoginTokens([{
                id: tokenId,
                ...tokenData,
                createdAt: new Date()
            }, ...loginTokens]);

            // Clear form
            setSelectedUser('');
            setTokenPassword('');
            setTokenName('');

            showToast('QR Login token created successfully!', 'success');
        } catch (error) {
            console.error('Error generating QR token:', error);
            showToast('Failed to create QR login token.', 'error');
        } finally {
            setGeneratingToken(false);
        }
    };

    const deleteLoginToken = async (tokenId: string) => {
        try {
            await deleteDoc(doc(db, 'loginTokens', tokenId));
            setLoginTokens(loginTokens.filter(t => t.id !== tokenId));
            showToast('Login token deleted.', 'success');
        } catch (error) {
            console.error('Error deleting token:', error);
            showToast('Failed to delete token.', 'error');
        }
    };

    // Check for specific admin email (Replace with real admin check logic)
    // For demo purposes, we will allow anyone logged in to see this, or restrict it slightly
    // in real production you'd check a custom claim or db role.
    const adminEmail = config.admin.email;
    if (!currentUser || currentUser.email !== adminEmail) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-history-parchment/20 p-6 font-serif">
                <div className="glass-panel p-8 text-center border border-history-red/30 rounded-lg max-w-md">
                    <Shield className="w-12 h-12 text-history-red mx-auto mb-4" />
                    <h2 className="font-display font-medium text-xl text-history-ink mb-2">Access Denied</h2>
                    <p className="text-history-wood text-sm mb-6">This area is restricted to the Grand Archivist only.</p>
                    <Link to="/" className="px-6 py-2 bg-history-ink text-history-paper rounded text-xs font-bold uppercase tracking-widest hover:bg-black transition-all">
                        Return Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-history-parchment/20 p-3 sm:p-6 font-serif">
            <header className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-10 pb-4 sm:pb-6 border-b border-history-gold/30 gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                    <Link to="/" className="p-2 hover:bg-black/5 rounded-full transition-colors text-history-wood">
                        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Link>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-history-red/10 rounded-full flex items-center justify-center text-history-red">
                            <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div>
                            <h1 className="font-display font-medium text-lg sm:text-xl text-history-ink tracking-wide">Admin Council</h1>
                            <p className="text-[10px] sm:text-xs text-history-wood font-medium uppercase tracking-widest truncate max-w-[150px] sm:max-w-none">{currentUser.email}</p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded border border-history-gold/30 text-history-wood hover:text-history-red hover:border-history-red/30 transition-all text-[10px] sm:text-xs font-bold uppercase tracking-widest self-end sm:self-auto"
                >
                    <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                    Logout
                </button>
            </header>

            <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
                {/* Generation Panel */}
                <div className="glass-panel p-4 sm:p-6 border border-history-gold/20 rounded-lg shadow-sm">
                    <h2 className="font-display font-medium text-base sm:text-lg text-history-dark mb-4 sm:mb-6 flex items-center gap-2">
                        <Plus className="w-4 h-4 text-history-red" />
                        Generate Referral Scroll
                    </h2>

                    <form onSubmit={generateCode} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-history-wood uppercase tracking-widest mb-1.5">Invitee Name / Identifier</label>
                            <input
                                type="text"
                                value={inviteeName}
                                onChange={(e) => setInviteeName(e.target.value)}
                                className="w-full bg-white/50 border border-history-gold/20 rounded-md px-4 py-2.5 text-history-dark focus:outline-none focus:ring-1 focus:ring-history-gold/50"
                                placeholder="Enter name..."
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!inviteeName}
                            className="w-full bg-history-ink hover:bg-black text-history-paper py-3 rounded-[4px] font-display font-medium text-sm tracking-widest uppercase transition-all shadow-md disabled:opacity-50"
                        >
                            Generate Seal (QR)
                        </button>
                    </form>

                    {referralLink && (
                        <div className="mt-8 p-6 bg-white/60 rounded border border-history-gold/10 flex flex-col items-center animate-fade-in-up">
                            <div className="mb-4 p-2 bg-white rounded shadow-sm">
                                <QRCodeCanvas value={referralLink} size={150} level={"H"} />
                            </div>
                            <p className="text-xs text-history-wood uppercase tracking-widest mb-2 font-bold">Referral Link</p>
                            <code className="text-xs bg-black/5 p-2 rounded w-full text-center break-all mb-4 text-history-dark font-mono">
                                {referralLink}
                            </code>
                            <div className="flex gap-2 w-full">
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(referralLink);
                                        setCopied(true);
                                        showToast('Link copied to clipboard!', 'success');
                                        setTimeout(() => setCopied(false), 2000);
                                    }}
                                    className="flex-1 py-2.5 text-xs font-bold uppercase tracking-widest border border-history-dark/10 rounded-md hover:bg-white transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                                >
                                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                    {copied ? 'Copied!' : 'Copy Link'}
                                </button>
                                {/* In real app, add download QR logic using canvas ref */}
                            </div>
                        </div>
                    )}
                </div>

                {/* History Panel */}
                <div className="glass-panel p-6 border border-history-gold/20 rounded-lg shadow-sm">
                    <h2 className="font-display font-medium text-lg text-history-dark mb-6">Issued Invitations</h2>

                    {generatedCodes.length === 0 ? (
                        <div className="text-center py-10 text-history-wood/50 italic text-sm border-2 border-dashed border-history-gold/10 rounded">
                            No invitations issued yet.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {generatedCodes.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-white/40 border border-history-gold/10 rounded hover:bg-white/70 transition-colors">
                                    <div>
                                        <p className="font-medium text-history-dark">{item.name}</p>
                                        <p className="text-xs text-history-wood">{item.date} • Code: <span className="font-mono text-history-ink">{item.code}</span></p>
                                    </div>
                                    <button className="text-history-red/50 hover:text-history-red p-2 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>


                {/* User Management Panel */}
                <div className="glass-panel p-6 border border-history-gold/20 rounded-lg shadow-sm md:col-span-2">
                    <h2 className="font-display font-medium text-lg text-history-dark mb-6 flex items-center gap-2">
                        <Users className="w-5 h-5 text-history-ink" />
                        Scholar Registry ({users.length})
                    </h2>

                    {loadingUsers ? (
                        <div className="text-center py-4 text-history-wood">Consulting records...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-history-gold/20">
                                        <th className="py-3 px-2 text-xs font-bold uppercase tracking-widest text-history-wood">Email / Scholar</th>
                                        <th className="py-3 px-2 text-xs font-bold uppercase tracking-widest text-history-wood">Role</th>
                                        <th className="py-3 px-2 text-xs font-bold uppercase tracking-widest text-history-wood">Gemini API Key</th>
                                        <th className="py-3 px-2 text-xs font-bold uppercase tracking-widest text-history-wood">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.id} className="border-b border-history-gold/10 hover:bg-white/40 transition-colors">
                                            <td className="py-3 px-2 text-history-dark font-medium">{user.email}</td>
                                            <td className="py-3 px-2 text-history-wood text-sm backdrop-blur-sm">
                                                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${user.role === 'admin' ? 'bg-history-red/10 text-history-red' : 'bg-history-gold/10 text-history-wood'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="py-3 px-2 font-mono text-xs text-history-wood/70">
                                                {editingKey === user.id ? (
                                                    <input
                                                        type="text"
                                                        value={newKey}
                                                        onChange={(e) => setNewKey(e.target.value)}
                                                        className="w-full bg-white border border-history-gold/30 rounded px-2 py-1 outline-none focus:border-history-gold"
                                                        placeholder="Paste API Key..."
                                                    />
                                                ) : (
                                                    user.apiKey ? `${user.apiKey.substring(0, 8)}...` : <span className="text-red-400 italic">Not set</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-2">
                                                {editingKey === user.id ? (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleUpdateKey(user.id)}
                                                            disabled={savingKey}
                                                            className="p-2 bg-history-ink text-white rounded-md hover:bg-black transition-all flex items-center gap-1 disabled:opacity-50 active:scale-[0.95]" title="Save"
                                                        >
                                                            {savingKey ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingKey(null)}
                                                            className="p-2 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 transition-all active:scale-[0.95]" title="Cancel"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => startEditingKey(user)}
                                                        className="flex items-center gap-1.5 px-3 py-2 rounded-md border border-history-gold/30 hover:bg-history-gold/10 transition-all text-xs font-medium text-history-wood active:scale-[0.98]"
                                                    >
                                                        <Key className="w-3 h-3" />
                                                        Edit Key
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* QR Login Tokens Panel */}
                <div className="glass-panel p-6 border border-history-gold/20 rounded-lg shadow-sm md:col-span-2">
                    <h2 className="font-display font-medium text-lg text-history-dark mb-6 flex items-center gap-2">
                        <QrCode className="w-5 h-5 text-history-red" />
                        QR Login Tokens
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Generate Token Form */}
                        <div className="bg-white/40 rounded-lg p-5 border border-history-gold/10">
                            <h3 className="text-sm font-bold text-history-wood uppercase tracking-widest mb-4">Generate New Token</h3>
                            <form onSubmit={generateQRLoginToken} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-history-wood uppercase tracking-widest mb-1.5">Select User</label>
                                    <select
                                        value={selectedUser}
                                        onChange={(e) => setSelectedUser(e.target.value)}
                                        className="w-full bg-white/50 border border-history-gold/20 rounded-md px-4 py-2.5 text-history-dark focus:outline-none focus:ring-1 focus:ring-history-gold/50"
                                    >
                                        <option value="">-- Select a user --</option>
                                        {users.map(user => (
                                            <option key={user.id} value={user.id}>{user.email}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-history-wood uppercase tracking-widest mb-1.5">Token Name (Optional)</label>
                                    <input
                                        type="text"
                                        value={tokenName}
                                        onChange={(e) => setTokenName(e.target.value)}
                                        className="w-full bg-white/50 border border-history-gold/20 rounded-md px-4 py-2.5 text-history-dark focus:outline-none focus:ring-1 focus:ring-history-gold/50"
                                        placeholder="e.g. Judge 1, Station A..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-history-wood uppercase tracking-widest mb-1.5">User Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={tokenPassword}
                                            onChange={(e) => setTokenPassword(e.target.value)}
                                            className="w-full bg-white/50 border border-history-gold/20 rounded-md px-4 py-2.5 pr-10 text-history-dark focus:outline-none focus:ring-1 focus:ring-history-gold/50"
                                            placeholder="Enter user's password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-history-wood/50 hover:text-history-wood"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-history-wood/60 mt-1 italic">The password is stored securely and used for auto-login.</p>
                                </div>
                                <button
                                    type="submit"
                                    disabled={generatingToken || !selectedUser || !tokenPassword}
                                    className="w-full bg-history-red hover:bg-red-700 text-white py-3 rounded-[4px] font-display font-medium text-sm tracking-widest uppercase transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {generatingToken ? (
                                        <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                                    ) : (
                                        <><QrCode className="w-4 h-4" /> Generate QR Token</>
                                    )}
                                </button>
                            </form>

                            {/* Generated QR Display */}
                            {generatedQRLink && (
                                <div className="mt-6 p-4 bg-white/60 rounded border border-history-gold/10 flex flex-col items-center animate-fade-in-up">
                                    <div className="mb-3 p-2 bg-white rounded shadow-sm">
                                        <QRCodeCanvas value={generatedQRLink} size={150} level={"H"} />
                                    </div>
                                    <p className="text-xs text-history-wood uppercase tracking-widest mb-2 font-bold">QR Login Link</p>
                                    <code className="text-[10px] bg-black/5 p-2 rounded w-full text-center break-all mb-3 text-history-dark font-mono">
                                        {generatedQRLink}
                                    </code>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(generatedQRLink);
                                            setCopiedQR(true);
                                            showToast('QR link copied!', 'success');
                                            setTimeout(() => setCopiedQR(false), 2000);
                                        }}
                                        className="w-full py-2 text-xs font-bold uppercase tracking-widest border border-history-dark/10 rounded-md hover:bg-white transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                                    >
                                        {copiedQR ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                        {copiedQR ? 'Copied!' : 'Copy Link'}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Token List */}
                        <div>
                            <h3 className="text-sm font-bold text-history-wood uppercase tracking-widest mb-4">Active Tokens ({loginTokens.length})</h3>
                            {loginTokens.length === 0 ? (
                                <div className="text-center py-10 text-history-wood/50 italic text-sm border-2 border-dashed border-history-gold/10 rounded">
                                    No QR login tokens created yet.
                                </div>
                            ) : (
                                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                                    {loginTokens.map(token => (
                                        <div key={token.id} className="flex items-center justify-between p-3 bg-white/40 border border-history-gold/10 rounded hover:bg-white/70 transition-colors cursor-pointer group" onClick={() => setViewingToken(token)}>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium text-history-dark truncate group-hover:text-history-red transition-colors">{token.name}</p>
                                                    {token.used && (
                                                        <span className="px-1.5 py-0.5 text-[8px] uppercase font-bold tracking-wider bg-green-100 text-green-700 rounded">Used</span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-history-wood truncate">{token.email}</p>
                                                <p className="text-[10px] text-history-wood/50 font-mono">{token.createdAt.toLocaleDateString()}</p>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0 ml-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const link = `${window.location.origin}/qr-login/${token.id}`;
                                                        navigator.clipboard.writeText(link);
                                                        showToast('Link copied!', 'success');
                                                    }}
                                                    className="p-2 text-history-wood/50 hover:text-history-ink hover:bg-white/50 rounded transition-colors"
                                                    title="Copy link"
                                                >
                                                    <Copy className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setViewingToken(token);
                                                    }}
                                                    className="p-2 text-history-wood/50 hover:text-history-ink hover:bg-white/50 rounded transition-colors"
                                                    title="View QR Code"
                                                >
                                                    <QrCode className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteLoginToken(token.id);
                                                    }}
                                                    className="p-2 text-history-red/50 hover:text-history-red hover:bg-red-50 rounded transition-colors"
                                                    title="Delete token"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* View QR Code Modal */}
                {viewingToken && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-history-ink/60 backdrop-blur-sm p-4 animate-fade-in">
                        <div className="glass-panel p-8 bg-white rounded-lg shadow-2xl max-w-sm w-full relative animate-fade-in-up border-2 border-history-gold/20 flex flex-col items-center">
                            <button
                                onClick={() => setViewingToken(null)}
                                className="absolute top-4 right-4 text-history-wood hover:text-black transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <h3 className="font-display font-medium text-xl text-history-dark mb-1">{viewingToken.name}</h3>
                            <p className="text-xs text-history-wood mb-6">{viewingToken.email}</p>

                            <div className="p-4 bg-white rounded-lg shadow-inner border border-history-gold/10 mb-6">
                                <QRCodeCanvas
                                    id="qr-modal-canvas"
                                    value={`${window.location.origin}/qr-login/${viewingToken.id}`}
                                    size={200}
                                    level={"H"}
                                    includeMargin={true}
                                />
                            </div>

                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={downloadQRCode}
                                    className="flex-1 bg-history-ink text-white py-2.5 rounded hover:bg-black transition-all text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5"
                                >
                                    <Download className="w-4 h-4" />
                                    Download
                                </button>
                                <button
                                    onClick={() => setViewingToken(null)}
                                    className="flex-1 bg-white border border-history-wood/20 text-history-dark py-2.5 rounded hover:bg-gray-50 transition-all text-xs font-bold uppercase tracking-widest"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main >
        </div >
    );
};
