import React, { useState } from 'react';
import { HistoryLessonData, UILabels } from '../types';
import { Film, Mic, Video, Camera, Type, Music, PlayCircle, Loader2 } from 'lucide-react';
import { generateVideoFromPrompt } from '../services/geminiService';

interface StoryboardViewProps {
  data: HistoryLessonData;
  labels: UILabels;
}

export const StoryboardView: React.FC<StoryboardViewProps> = ({ data, labels }) => {
  const [generatedVideos, setGeneratedVideos] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState<Record<number, boolean>>({});

  const handleGenerateVideo = async (index: number, scene: any) => {
    if (loading[index]) return;

    if (window.aistudio && window.aistudio.hasSelectedApiKey) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
            if (window.aistudio.openSelectKey) {
                await window.aistudio.openSelectKey();
            } else {
                alert(labels.media.apiKeyRequired);
                return;
            }
        }
    }

    setLoading(prev => ({ ...prev, [index]: true }));
    const videoPrompt = `Cinematic shot, historical documentary style. ${scene.visualDescription} Action: ${scene.action}. Camera: ${scene.cameraAngle}. High quality, detailed, atmospheric.`;

    try {
        const videoUrl = await generateVideoFromPrompt(videoPrompt);
        setGeneratedVideos(prev => ({ ...prev, [index]: videoUrl }));
    } catch (error: any) {
        console.error("Failed to generate video", error);
        const errorMessage = error.message || JSON.stringify(error);
        if (errorMessage.includes("Requested entity was not found") || errorMessage.includes("404")) {
            if (window.aistudio?.openSelectKey) {
                await window.aistudio.openSelectKey();
                alert("Veo Video Generation Error: The current API key cannot access the video model. Please select a valid paid API key to continue.");
            } else {
                alert("Video generation failed (404): The Veo model was not found.");
            }
        } else {
            alert(`Failed to generate video. Error: ${errorMessage.substring(0, 100)}...`);
        }
    } finally {
        setLoading(prev => ({ ...prev, [index]: false }));
    }
  };

  return (
    <div className="space-y-12 animate-fade-in-up">
      {/* Voice Over Script */}
      <div className="glass-card p-10 rounded-sm relative transition-transform hover:-translate-y-0.5 duration-500 border-l-4 border-l-history-red">
        <h3 className="text-sm font-display font-medium mb-6 flex items-center gap-3 text-history-red uppercase tracking-widest">
          <Mic className="w-4 h-4" />
          {labels.sections.voiceover}
        </h3>
        <div className="font-serif text-xl leading-loose text-history-dark italic font-light pl-4 opacity-90">
          "{data.voiceOverScript}"
        </div>
        <div className="mt-6 text-right text-[10px] font-sans font-bold text-history-wood/40 uppercase tracking-widest">
             ~ {(data.voiceOverScript.length / 5 / 2.5).toFixed(0)} seconds est. ~
        </div>
      </div>

      {/* Storyboard Grid */}
      <div className="space-y-8">
        <h3 className="text-2xl font-display font-medium text-history-ink flex items-center gap-3 border-b border-history-gold/20 pb-4 tracking-wide">
          <Film className="w-5 h-5 text-history-red" />
          {labels.sections.storyboard}
        </h3>
        
        <div className="grid grid-cols-1 gap-10">
          {data.storyboard.map((scene, idx) => (
            <div 
                key={scene.sceneNumber} 
                className="group relative glass-panel rounded-sm overflow-hidden transition-all duration-300 hover:shadow-paper-hover border border-history-gold/10"
            >
              {/* Decorative Header */}
              <div className="h-6 bg-history-ink/5 w-full flex justify-between items-center px-3 border-b border-history-gold/10">
                 <div className="flex gap-2">
                    {[...Array(3)].map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-history-wood/20"></div>)}
                 </div>
                 <div className="text-[9px] font-sans text-history-wood/40 uppercase tracking-widest">Sequence 0{idx + 1}</div>
              </div>

              <div className="flex flex-col md:flex-row">
                  {/* Scene Number */}
                  <div className="md:w-16 bg-white/50 flex items-center justify-center border-b md:border-b-0 md:border-r border-history-gold/10 p-4 md:p-0">
                    <span className="text-xl md:text-2xl font-display font-medium text-history-wood/30 md:-rotate-90 whitespace-nowrap">SCENE {scene.sceneNumber}</span>
                  </div>
                  
                  {/* Main Content */}
                  <div className="flex-1 p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                     
                     {/* Visual & Action */}
                     <div className="lg:col-span-2 space-y-5">
                        <div className="flex justify-between items-start flex-wrap gap-4">
                            <h4 className="font-bold text-history-wood flex items-center gap-2 uppercase tracking-widest text-[10px]">
                                <Video className="w-3 h-3 text-history-red" /> {labels.sections.visual}
                            </h4>
                            
                            {!generatedVideos[idx] && (
                                <button 
                                    onClick={() => handleGenerateVideo(idx, scene)}
                                    disabled={loading[idx]}
                                    className="px-4 py-1.5 text-[10px] font-bold text-history-paper bg-history-ink hover:bg-black rounded-sm shadow-sm transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-widest hover:translate-y-[-1px]"
                                >
                                    {loading[idx] ? <Loader2 className="w-3 h-3 animate-spin" /> : <PlayCircle className="w-3 h-3" />}
                                    {loading[idx] ? labels.media.generating : labels.media.generateVideo}
                                </button>
                            )}
                        </div>
                        <p className="text-history-ink text-lg font-serif leading-relaxed font-light">{scene.visualDescription}</p>
                        
                        <div className="bg-history-parchment/40 p-5 rounded-sm border border-history-gold/10 mt-2">
                            <p className="text-[10px] text-history-wood mb-2 uppercase font-bold tracking-widest opacity-60">Action</p>
                            <p className="text-history-dark font-medium text-sm">{scene.action}</p>
                        </div>
                     </div>

                     {/* Technical Details */}
                     <div className="space-y-6 border-l border-history-gold/10 pl-8 lg:block border-t lg:border-t-0 pt-6 lg:pt-0">
                        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            <h4 className="font-bold text-history-wood mb-1 flex items-center gap-2 text-[10px] uppercase tracking-widest">
                                <Camera className="w-3 h-3" /> {labels.sections.angle}
                            </h4>
                            <p className="text-sm text-history-ink font-light">{scene.cameraAngle}</p>
                        </div>

                        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            <h4 className="font-bold text-history-wood mb-1 flex items-center gap-2 text-[10px] uppercase tracking-widest">
                                <Music className="w-3 h-3" /> {labels.sections.audio}
                            </h4>
                            <p className="text-sm text-history-ink italic font-light opacity-90">{scene.audio}</p>
                        </div>

                        {scene.textOverlay && (
                            <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                                <h4 className="font-bold text-history-wood mb-1 flex items-center gap-2 text-[10px] uppercase tracking-widest">
                                    <Type className="w-3 h-3" /> Overlay
                                </h4>
                                <p className="text-sm text-history-red font-serif font-medium border p-3 rounded-sm bg-white/40 shadow-sm border-history-red/10">
                                    "{scene.textOverlay}"
                                </p>
                            </div>
                        )}
                     </div>
                  </div>
              </div>

              {/* Video Player */}
              {(generatedVideos[idx] || loading[idx]) && (
                  <div className="bg-black p-4 animate-slide-in relative">
                      {loading[idx] && (
                          <div className="h-64 w-full flex flex-col items-center justify-center text-history-parchment gap-4">
                              <Loader2 className="w-8 h-8 animate-spin text-history-gold opacity-80" />
                              <div className="text-center">
                                <p className="font-display font-medium tracking-widest uppercase mb-1 text-sm text-history-gold/80">{labels.media.generating}</p>
                                <p className="text-[10px] opacity-40 font-mono tracking-widest">VEO MODEL PROCESSING</p>
                              </div>
                          </div>
                      )}
                      {generatedVideos[idx] && (
                          <video 
                            controls 
                            className="w-full max-h-[500px] mx-auto shadow-2xl rounded-sm border border-history-wood/30" 
                            src={generatedVideos[idx]}
                          >
                            Your browser does not support the video tag.
                          </video>
                      )}
                  </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};