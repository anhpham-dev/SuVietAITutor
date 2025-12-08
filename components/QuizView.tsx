import React, { useState } from 'react';
import { HistoryLessonData, UILabels } from '../types';
import { HelpCircle, Brain, RotateCw, Lightbulb } from 'lucide-react';

interface QuizViewProps {
  data: HistoryLessonData;
  labels: UILabels;
}

export const QuizView: React.FC<QuizViewProps> = ({ data, labels }) => {
  return (
    <div className="space-y-12 animate-fade-in">
      
      {/* Flashcards */}
      <section>
        <h3 className="text-xl font-bold text-history-dark mb-6 flex items-center gap-2 font-serif">
          <RotateCw className="w-6 h-6 text-history-red" />
          {labels.sections.flashcards}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.flashcards.map((card, idx) => (
            <FlipCard key={idx} front={card.front} back={card.back} />
          ))}
        </div>
      </section>

      {/* MCQ */}
      <section className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-history-gold/30">
        <h3 className="text-xl font-bold text-history-dark mb-6 flex items-center gap-2 font-serif">
          <HelpCircle className="w-6 h-6 text-blue-700" />
          {labels.sections.mcq}
        </h3>
        <div className="space-y-8">
            {data.quiz.multipleChoice.map((q, idx) => (
                <div key={idx} className="border-b border-history-gold/20 last:border-0 pb-6 last:pb-0">
                    <p className="font-medium text-history-dark mb-3">{idx + 1}. {q.question}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                        {q.options.map((opt, oIdx) => (
                            <div key={oIdx} className={`text-sm p-3 rounded border ${oIdx === q.correctAnswerIndex ? 'border-green-200 bg-green-50 text-green-900 font-medium' : 'border-history-gold/30 text-history-dark/80 bg-white/50'}`}>
                                {String.fromCharCode(65 + oIdx)}. {opt}
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-3 p-4 bg-history-parchment/50 rounded-r-lg border-l-4 border-history-gold flex items-start gap-3">
                        <div className="mt-0.5 shrink-0">
                            <Lightbulb className="w-4 h-4 text-history-gold" />
                        </div>
                        <div>
                            <span className="font-bold text-history-dark text-sm block mb-1">Explanation</span>
                            <p className="text-sm text-history-wood leading-relaxed">{q.explanation}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* Thinking Questions */}
      <section className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-history-gold/30">
        <h3 className="text-xl font-bold text-history-dark mb-6 flex items-center gap-2 font-serif">
            <Brain className="w-6 h-6 text-purple-700" />
            {labels.sections.thinking}
        </h3>
        <div className="space-y-6">
            {data.quiz.thinking.map((q, idx) => (
                <div key={idx} className="bg-purple-50/50 p-4 rounded-lg border border-purple-100">
                    <p className="font-bold text-purple-900 mb-2 font-serif">Q: {q.question}</p>
                    <p className="text-sm text-purple-900/80 leading-relaxed"><span className="font-semibold">Guide:</span> {q.answerGuide}</p>
                </div>
            ))}
        </div>
      </section>
    </div>
  );
};

const FlipCard: React.FC<{ front: string; back: string }> = ({ front, back }) => {
    const [isFlipped, setIsFlipped] = useState(false);
  
    return (
      <div 
        className="group h-56 w-full cursor-pointer perspective-1000"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`relative w-full h-full transition-all duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          
          {/* Front */}
          <div className="absolute w-full h-full backface-hidden bg-history-parchment border-2 border-history-gold rounded-xl shadow-lg p-6 flex items-center justify-center text-center hover:border-history-red transition-colors">
            <p className="font-serif font-bold text-history-dark text-lg leading-snug">{front}</p>
            <span className="absolute bottom-3 right-3 text-xs text-history-gold">Click to flip</span>
          </div>
  
          {/* Back */}
          <div className="absolute w-full h-full backface-hidden bg-history-dark rounded-xl shadow-lg p-6 flex items-center justify-center text-center rotate-y-180 border-2 border-history-dark">
            <p className="text-history-parchment font-medium leading-relaxed">{back}</p>
          </div>
        </div>
      </div>
    );
  };
