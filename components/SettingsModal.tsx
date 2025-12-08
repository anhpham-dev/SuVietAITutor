
import React, { useEffect, useState } from 'react';
import { UILabels } from '../types';
import { X, Key, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  labels: UILabels;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, labels }) => {
  const [hasKey, setHasKey] = useState<boolean>(false);

  const checkKeyStatus = async () => {
    if (window.aistudio && window.aistudio.hasSelectedApiKey) {
      try {
        const status = await window.aistudio.hasSelectedApiKey();
        setHasKey(status);
      } catch (e) {
        console.error("Error checking key status", e);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkKeyStatus();
    }
  }, [isOpen]);

  const handleSelectKey = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
      try {
        await window.aistudio.openSelectKey();
        await checkKeyStatus();
      } catch (e) {
        console.error("Error opening key selector", e);
      }
    } else {
        alert("API Key selection is not supported in this environment.");
    }
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
                
                <div className="bg-history-parchment/50 p-4 rounded border border-history-gold/10 mb-6 flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-history-gold shrink-0 mt-0.5" />
                    <div className="text-xs text-history-wood leading-relaxed">
                        This application uses a unified Google Cloud Project key for both <strong>Gemini 2.5</strong> (Text/Image) and <strong>Veo</strong> (Video) models.
                    </div>
                </div>

                <div className="flex items-center justify-between bg-white/60 p-4 rounded border border-history-gold/10">
                    <div className="flex items-center gap-2">
                        {hasKey ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                        )}
                        <span className={`text-sm font-medium ${hasKey ? 'text-green-700' : 'text-amber-700'}`}>
                            {hasKey ? labels.settings.statusConnected : labels.settings.statusNotConnected}
                        </span>
                    </div>
                    
                    <button
                        onClick={handleSelectKey}
                        className="px-4 py-2 bg-history-ink text-history-paper rounded-[4px] font-medium shadow-sm hover:bg-black transition-all text-xs uppercase tracking-widest"
                    >
                        {labels.settings.configureBtn}
                    </button>
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
