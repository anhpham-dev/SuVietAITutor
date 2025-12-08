

import React, { useEffect, useState } from 'react';
import { UILabels } from '../types';
import { X, Key, Save, Trash2, Shield, Eye, EyeOff } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  labels: UILabels;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, labels }) => {
  const [geminiKey, setGeminiKey] = useState('');
  const [veoKey, setVeoKey] = useState('');
  const [showGemini, setShowGemini] = useState(false);
  const [showVeo, setShowVeo] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      const storedGemini = localStorage.getItem('GEMINI_API_KEY') || '';
      const storedVeo = localStorage.getItem('VEO_API_KEY') || '';
      setGeminiKey(storedGemini);
      setVeoKey(storedVeo);
      setStatusMsg('');
    }
  }, [isOpen]);

  const handleSave = () => {
    localStorage.setItem('GEMINI_API_KEY', geminiKey);
    localStorage.setItem('VEO_API_KEY', veoKey);
    setStatusMsg(labels.settings.saved);
    setTimeout(() => setStatusMsg(''), 2000);
  };

  const handleClear = () => {
    localStorage.removeItem('GEMINI_API_KEY');
    localStorage.removeItem('VEO_API_KEY');
    setGeminiKey('');
    setVeoKey('');
    setStatusMsg(labels.settings.clear);
    setTimeout(() => setStatusMsg(''), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-history-ink/40 backdrop-blur-sm p-4 animate-fade-in no-print">
      <div className="glass-panel rounded-lg shadow-2xl max-w-md w-full overflow-hidden flex flex-col animate-fade-in-up border border-history-gold/20">
        
        {/* Header */}
        <div className="bg-white/80 px-6 py-4 border-b border-history-gold/10 flex justify-between items-center backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-history-red" />
            <h3 className="text-lg font-display font-medium text-history-ink tracking-wide">
              {labels.settings.title}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-black/5 rounded-full text-history-wood transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
            <div className="mb-6">
                <h4 className="text-sm font-bold uppercase tracking-widest text-history-wood mb-2 border-b border-history-gold/10 pb-2">
                    {labels.settings.apiSection}
                </h4>
                <p className="text-history-ink font-serif text-sm leading-relaxed mb-4">
                    {labels.settings.apiDesc}
                </p>
                
                <div className="space-y-5">
                    {/* Gemini Key Input */}
                    <div>
                        <label className="block text-xs font-bold text-history-wood uppercase tracking-widest mb-2">
                            {labels.settings.geminiKeyLabel}
                        </label>
                        <div className="relative group">
                            <input
                                type={showGemini ? "text" : "password"}
                                value={geminiKey}
                                onChange={(e) => setGeminiKey(e.target.value)}
                                placeholder={labels.settings.placeholder}
                                className="w-full bg-white/60 border border-history-gold/20 rounded px-4 py-2 text-sm text-history-dark focus:outline-none focus:border-history-gold focus:ring-1 focus:ring-history-gold/30 font-mono tracking-wide"
                            />
                            <button 
                                onClick={() => setShowGemini(!showGemini)}
                                className="absolute right-3 top-2.5 text-history-wood/50 hover:text-history-dark"
                            >
                                {showGemini ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Veo Key Input */}
                    <div>
                        <label className="block text-xs font-bold text-history-wood uppercase tracking-widest mb-2">
                            {labels.settings.veoKeyLabel}
                        </label>
                        <div className="relative group">
                            <input
                                type={showVeo ? "text" : "password"}
                                value={veoKey}
                                onChange={(e) => setVeoKey(e.target.value)}
                                placeholder={labels.settings.placeholder}
                                className="w-full bg-white/60 border border-history-gold/20 rounded px-4 py-2 text-sm text-history-dark focus:outline-none focus:border-history-gold focus:ring-1 focus:ring-history-gold/30 font-mono tracking-wide"
                            />
                            <button 
                                onClick={() => setShowVeo(!showVeo)}
                                className="absolute right-3 top-2.5 text-history-wood/50 hover:text-history-dark"
                            >
                                {showVeo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex flex-col items-center gap-2">
                    <div className="flex gap-3 w-full">
                         <button
                            onClick={handleClear}
                            className="flex-1 px-4 py-2 border border-history-red/30 text-history-red rounded-[4px] font-medium hover:bg-history-red/5 transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                        >
                            <Trash2 className="w-3 h-3" /> {labels.settings.clear}
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex-1 px-4 py-2 bg-history-ink text-history-paper rounded-[4px] font-medium shadow-sm hover:bg-black transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                        >
                            <Save className="w-3 h-3" /> {labels.settings.save}
                        </button>
                    </div>
                    {statusMsg && (
                        <span className="text-xs text-green-700 font-medium animate-fade-in flex items-center gap-1 mt-2">
                            <Shield className="w-3 h-3" /> {statusMsg}
                        </span>
                    )}
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-history-parchment/20 border-t border-history-gold/10 flex justify-end backdrop-blur-sm">
          <button 
            onClick={onClose}
            className="px-6 py-2 text-history-wood hover:text-history-dark font-medium transition-colors text-xs uppercase tracking-widest"
          >
            {labels.settings.close}
          </button>
        </div>

      </div>
    </div>
  );
};
