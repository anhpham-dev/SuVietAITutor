import React from 'react';
import { HistoryLessonData, UILabels, PdfSection } from '../types';

interface PrintLayoutProps {
  data: HistoryLessonData;
  labels: UILabels;
  sections: PdfSection[];
}

export const PrintLayout: React.FC<PrintLayoutProps> = ({ data, labels, sections }) => {
  return (
    <div className="hidden print:block print:p-8 bg-white text-black font-serif">
       
       {/* Document Header */}
       <div className="text-center border-b-2 border-black pb-6 mb-8 break-inside-avoid">
          <h1 className="text-4xl font-display font-black mb-2 text-black uppercase tracking-wide">{data.title}</h1>
          <p className="text-sm text-gray-600 font-sans tracking-widest uppercase">SuViet AI Tutor - Historical Archive</p>
       </div>

       {/* Summary Section */}
       {sections.includes('overview') && (
         <section className="mb-10 break-inside-avoid">
            <h2 className="text-xl font-display font-bold mb-4 border-b border-gray-400 pb-1 text-black flex items-center gap-2">
                1. {labels.sections.summary}
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-justify">
               {data.summaryPoints.map((point, i) => (
                   <li key={i} className="leading-relaxed text-black">{point}</li>
               ))}
            </ul>
         </section>
       )}

       {/* Timeline Section */}
       {sections.includes('overview') && (
         <section className="mb-10 break-inside-avoid">
            <h2 className="text-xl font-display font-bold mb-4 border-b border-gray-400 pb-1 text-black flex items-center gap-2">
                2. {labels.sections.timeline}
            </h2>
            <div className="border-l-2 border-gray-300 ml-2 pl-4 space-y-4">
                {data.timeline.map((item, i) => (
                    <div key={i} className="flex gap-4">
                        <span className="font-bold font-sans text-sm w-16 shrink-0 pt-0.5">{item.year}</span>
                        <p className="text-black leading-relaxed">{item.event}</p>
                    </div>
                ))}
            </div>
         </section>
       )}

       {/* Analysis Section */}
       {sections.includes('analysis') && (
         <section className="mb-10 break-inside-avoid">
            <h2 className="text-xl font-display font-bold mb-4 border-b border-gray-400 pb-1 text-black flex items-center gap-2">
                3. {labels.sections.analysis}
            </h2>
            <div className="grid grid-cols-2 gap-8">
                <div>
                    <h3 className="font-bold uppercase text-sm mb-2 border-b border-gray-200">{labels.sections.characters}</h3>
                    <ul className="list-disc pl-4 text-sm space-y-1">
                        {data.analysis.keyCharacters.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold uppercase text-sm mb-2 border-b border-gray-200">{labels.sections.causes}</h3>
                    <ul className="list-disc pl-4 text-sm space-y-1">
                        {data.analysis.causes.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold uppercase text-sm mb-2 border-b border-gray-200">{labels.sections.development}</h3>
                    <ul className="list-disc pl-4 text-sm space-y-1">
                        {data.analysis.developments.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold uppercase text-sm mb-2 border-b border-gray-200">{labels.sections.effects}</h3>
                    <ul className="list-disc pl-4 text-sm space-y-1">
                        {data.analysis.effects.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                </div>
            </div>
         </section>
       )}

       {/* Storyboard Section */}
       {sections.includes('storyboard') && (
         <section className="mb-10 break-before-auto">
            <h2 className="text-xl font-display font-bold mb-4 border-b border-gray-400 pb-1 text-black flex items-center gap-2">
                4. {labels.sections.storyboard} & {labels.sections.voiceover}
            </h2>
            
            <div className="mb-6 p-4 border border-gray-200 rounded bg-gray-50/50 italic break-inside-avoid">
                <span className="block font-bold not-italic text-xs uppercase mb-1">{labels.sections.voiceover}:</span>
                "{data.voiceOverScript}"
            </div>

            <div className="space-y-6">
                {data.storyboard.map((scene, i) => (
                    <div key={i} className="border border-gray-300 p-4 break-inside-avoid rounded">
                        <div className="flex justify-between border-b border-gray-200 pb-2 mb-2">
                            <h3 className="font-bold font-display">SCENE {scene.sceneNumber}</h3>
                            <span className="text-sm font-sans text-gray-600">{scene.cameraAngle}</span>
                        </div>
                        <div className="grid grid-cols-1 gap-2 text-sm">
                            <p><span className="font-bold">Visual:</span> {scene.visualDescription}</p>
                            <p><span className="font-bold">Action:</span> {scene.action}</p>
                            <p><span className="font-bold">Audio:</span> {scene.audio}</p>
                            {scene.textOverlay && <p><span className="font-bold">Overlay:</span> "{scene.textOverlay}"</p>}
                        </div>
                    </div>
                ))}
            </div>
         </section>
       )}

       {/* Assets Section */}
       {sections.includes('assets') && (
         <section className="mb-10 break-inside-avoid">
            <h2 className="text-xl font-display font-bold mb-4 border-b border-gray-400 pb-1 text-black flex items-center gap-2">
                5. {labels.sections.prompts}
            </h2>
            <ul className="list-decimal pl-5 space-y-3">
                {data.imagePrompts.map((prompt, i) => (
                    <li key={i} className="text-sm leading-relaxed border-b border-gray-100 pb-2 last:border-0">{prompt}</li>
                ))}
            </ul>
         </section>
       )}

       {/* Quiz Section */}
       {sections.includes('quiz') && (
         <section className="mb-10 break-before-auto">
            <h2 className="text-xl font-display font-bold mb-4 border-b border-gray-400 pb-1 text-black flex items-center gap-2">
                6. {labels.sections.mcq} & {labels.sections.flashcards}
            </h2>
            
            <div className="mb-8">
                <h3 className="font-bold uppercase text-sm mb-3">Questions</h3>
                <div className="space-y-4">
                    {data.quiz.multipleChoice.map((q, i) => (
                        <div key={i} className="break-inside-avoid mb-4">
                            <p className="font-bold text-sm mb-1">{i + 1}. {q.question}</p>
                            <ul className="pl-4 text-sm mb-2 grid grid-cols-2 gap-x-4">
                                {q.options.map((opt, oIdx) => (
                                    <li key={oIdx} className={`${oIdx === q.correctAnswerIndex ? 'font-bold underline' : ''}`}>
                                        {String.fromCharCode(65 + oIdx)}. {opt}
                                    </li>
                                ))}
                            </ul>
                            <p className="text-xs bg-gray-100 p-2 border-l-2 border-black">
                                <span className="font-bold">Note:</span> {q.explanation}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="break-inside-avoid">
                <h3 className="font-bold uppercase text-sm mb-3">{labels.sections.thinking}</h3>
                {data.quiz.thinking.map((q, i) => (
                    <div key={i} className="mb-3">
                        <p className="font-bold text-sm">Q: {q.question}</p>
                        <p className="text-sm italic text-gray-700">Guide: {q.answerGuide}</p>
                    </div>
                ))}
            </div>
         </section>
       )}
       
       <div className="text-center text-xs text-gray-400 mt-10 border-t border-gray-200 pt-4 font-sans uppercase tracking-widest">
          Generated on {new Date().toLocaleDateString()} • SuViet AI Tutor
       </div>
    </div>
  );
};