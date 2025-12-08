import React, { useState } from 'react';
import { HistoryLessonData, UILabels } from '../types';
import { Image, Copy, Wand2, Loader2, Maximize2 } from 'lucide-react';
import { generateImageFromPrompt } from '../services/geminiService';

interface AssetsViewProps {
  data: HistoryLessonData;
  labels: UILabels;
}

export const AssetsView: React.FC<AssetsViewProps> = ({ data, labels }) => {
  const [generatedImages, setGeneratedImages] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState<Record<number, boolean>>({});

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleGenerateImage = async (index: number, prompt: string) => {
    if (loading[index]) return;
    
    setLoading(prev => ({ ...prev, [index]: true }));
    try {
        const imageUrl = await generateImageFromPrompt(prompt);
        setGeneratedImages(prev => ({ ...prev, [index]: imageUrl }));
    } catch (error) {
        console.error("Failed to generate image", error);
        alert("Failed to generate image. Please try again.");
    } finally {
        setLoading(prev => ({ ...prev, [index]: false }));
    }
  };

  return (
    <div className="animate-fade-in-up pb-8">
       <div className="flex items-center justify-between mb-8 border-b border-history-gold/20 pb-4">
            <h3 className="text-2xl font-display font-medium text-history-ink flex items-center gap-3 tracking-wide">
                <Image className="w-5 h-5 text-history-red" />
                {labels.sections.prompts}
            </h3>
            <span className="text-xs font-serif text-history-wood/50 italic hidden sm:inline">Gemini 2.5 Image Generation</span>
       </div>
       
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.imagePrompts.map((prompt, idx) => (
                <div 
                    key={idx} 
                    className="glass-card p-6 rounded-sm hover:shadow-paper-hover transition-all duration-300 flex flex-col h-full hover:-translate-y-1 group border border-history-gold/10"
                >
                    {/* Image Preview Area */}
                    <div className="aspect-video w-full bg-white/50 rounded-sm mb-5 border border-history-gold/10 overflow-hidden relative shadow-inner flex items-center justify-center">
                        {generatedImages[idx] ? (
                            <>
                                <img src={generatedImages[idx]} alt="Generated content" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                                    <a 
                                        href={generatedImages[idx]} 
                                        download={`history-image-${idx}.png`}
                                        className="p-3 bg-white rounded-full text-history-dark hover:scale-110 transition-transform shadow-lg"
                                        title="Download"
                                    >
                                        <Maximize2 className="w-4 h-4" />
                                    </a>
                                </div>
                            </>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-history-wood/10 group-hover:text-history-wood/20 transition-colors">
                                {loading[idx] ? (
                                    <Loader2 className="w-6 h-6 animate-spin text-history-gold" />
                                ) : (
                                    <Image className="w-10 h-10" />
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex-1 flex flex-col">
                        <p className="font-serif text-history-dark/90 mb-5 flex-1 text-sm leading-relaxed font-light">
                            {prompt}
                        </p>
                        
                        <div className="flex gap-3 pt-4 border-t border-history-gold/10">
                            <button 
                                onClick={() => handleCopy(prompt)}
                                className="flex-1 px-3 py-2 text-[10px] font-bold text-history-wood hover:text-history-dark border border-history-gold/20 hover:bg-white rounded-sm transition-colors flex items-center justify-center gap-2 uppercase tracking-widest"
                            >
                                <Copy className="w-3 h-3" /> Copy
                            </button>
                            <button 
                                onClick={() => handleGenerateImage(idx, prompt)}
                                disabled={loading[idx]}
                                className="flex-1 px-3 py-2 text-[10px] font-bold text-white bg-history-red hover:bg-history-dark rounded-sm shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-widest hover:shadow-md"
                            >
                                <Wand2 className="w-3 h-3" /> {labels.media.generateImage}
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};