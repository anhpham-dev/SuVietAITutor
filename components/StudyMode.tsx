import React, { useState, useEffect } from 'react';
import { HistoryLessonData, StudyTab, UILabels } from '../types';
import { RotateCw, HelpCircle, ChevronLeft, ChevronRight, RefreshCw, CheckCircle, XCircle, Lightbulb } from 'lucide-react';

interface StudyModeProps {
  data: HistoryLessonData;
  labels: UILabels;
}

export const StudyMode: React.FC<StudyModeProps> = ({ data, labels }) => {
  const [activeTab, setActiveTab] = useState<StudyTab>(StudyTab.FLASHCARDS);

  return (
    <div className="animate-fade-in-up max-w-4xl mx-auto pb-10">
      <div className="flex justify-center mb-10">
        <div className="inline-flex glass-panel p-1 rounded-lg shadow-inner-warm border border-history-gold/10">
          <button
            onClick={() => setActiveTab(StudyTab.FLASHCARDS)}
            className={`flex items-center gap-2 px-6 py-2 rounded font-medium text-xs uppercase tracking-widest transition-all duration-300 ${
                activeTab === StudyTab.FLASHCARDS
                ? 'bg-white text-history-ink shadow-sm'
                : 'text-history-wood/60 hover:text-history-dark hover:bg-white/40'
            }`}
          >
            <RotateCw className="w-3 h-3" />
            {labels.study.flashcardsMode}
          </button>
          <button
            onClick={() => setActiveTab(StudyTab.QUIZ)}
            className={`flex items-center gap-2 px-6 py-2 rounded font-medium text-xs uppercase tracking-widest transition-all duration-300 ${
                activeTab === StudyTab.QUIZ
                ? 'bg-white text-history-ink shadow-sm'
                : 'text-history-wood/60 hover:text-history-dark hover:bg-white/40'
            }`}
          >
            <HelpCircle className="w-3 h-3" />
            {labels.study.quizMode}
          </button>
        </div>
      </div>

      {activeTab === StudyTab.FLASHCARDS ? (
        <InteractiveFlashcards data={data} labels={labels} />
      ) : (
        <InteractiveQuiz data={data} labels={labels} />
      )}
    </div>
  );
};

const InteractiveFlashcards: React.FC<{ data: HistoryLessonData; labels: UILabels }> = ({ data, labels }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const cards = data.flashcards;

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex((prev) => (prev + 1) % cards.length), 300);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length), 300);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === ' ' || e.key === 'Enter') setIsFlipped(prev => !prev);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cards.length]);

  return (
    <div className="max-w-xl mx-auto px-4">
      {/* Card Container */}
      <div 
        className="relative h-80 md:h-96 w-full cursor-pointer perspective-1000 mb-8 group"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          
          {/* Front */}
          <div className="absolute w-full h-full backface-hidden glass-card rounded-lg shadow-paper flex flex-col items-center justify-center p-10 text-center relative overflow-hidden group-hover:shadow-paper-hover transition-shadow duration-300 border border-history-gold/20">
            <div className="absolute top-0 w-full h-1 bg-history-red/80"></div>
            <span className="absolute top-6 right-6 text-xs font-bold text-history-wood/30 font-sans">
                #{currentIndex + 1}
            </span>
            
            <p className="font-display font-medium text-2xl md:text-3xl text-history-ink leading-snug">
                {cards[currentIndex].front}
            </p>
            
            <p className="absolute bottom-6 text-[10px] font-bold uppercase tracking-widest text-history-gold opacity-80 animate-pulse">
                {labels.study.flip}
            </p>
          </div>

          {/* Back */}
          <div className="absolute w-full h-full backface-hidden bg-history-ink rounded-lg shadow-paper p-10 flex items-center justify-center text-center rotate-y-180 relative">
             <div className="absolute inset-3 border border-history-gold/20 rounded-sm"></div>
            <p className="text-history-paper text-lg md:text-xl font-serif leading-relaxed font-light">
                {cards[currentIndex].back}
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-6 bg-white/40 backdrop-blur-sm rounded-full p-2 border border-history-gold/10 shadow-sm max-w-sm mx-auto">
        <button 
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            className="p-2 rounded-full hover:bg-white text-history-wood/70 hover:text-history-dark transition-all active:scale-95"
            title={labels.study.prev}
        >
            <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="text-xs font-bold text-history-dark font-display tracking-widest">
             CARD {currentIndex + 1} <span className="text-history-wood/30 mx-1">/</span> {cards.length}
        </div>

        <button 
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            className="p-2 rounded-full hover:bg-white text-history-wood/70 hover:text-history-dark transition-all active:scale-95"
            title={labels.study.next}
        >
            <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const InteractiveQuiz: React.FC<{ data: HistoryLessonData; labels: UILabels }> = ({ data, labels }) => {
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [submitted, setSubmitted] = useState(false);
    const questions = data.quiz.multipleChoice;

    const handleSelect = (qIdx: number, optIdx: number) => {
        if (submitted) return;
        setAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
    };

    const calculateScore = () => {
        let score = 0;
        questions.forEach((q, idx) => {
            if (answers[idx] === q.correctAnswerIndex) score++;
        });
        return score;
    };

    const resetQuiz = () => {
        setAnswers({});
        setSubmitted(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="space-y-10 px-4 md:px-0">
            {submitted && (
                <div className="bg-history-ink p-10 rounded-sm shadow-2xl text-center animate-fade-in-up border-double border-4 border-history-gold/30 relative overflow-hidden">
                    <p className="text-history-gold mb-4 font-display uppercase tracking-widest text-xs opacity-80">{labels.study.congrats}</p>
                    <p className="text-5xl font-medium text-white mb-8 font-display">
                        {calculateScore()} <span className="text-2xl opacity-50">/ {questions.length}</span>
                    </p>
                    <button 
                        onClick={resetQuiz}
                        className="inline-flex items-center gap-2 px-8 py-3 bg-history-red text-white font-medium rounded-sm hover:bg-red-900 transition-colors uppercase tracking-widest text-xs shadow-lg"
                    >
                        <RefreshCw className="w-3 h-3" /> {labels.study.retake}
                    </button>
                </div>
            )}

            <div className="space-y-6">
                {questions.map((q, qIdx) => {
                    const isCorrect = answers[qIdx] === q.correctAnswerIndex;
                    const userAnswer = answers[qIdx];
                    
                    return (
                        <div key={qIdx} className={`glass-card p-8 rounded-sm shadow-sm transition-all duration-300 ${submitted ? (isCorrect ? 'border-green-800/20 bg-green-50/30' : 'border-red-800/20 bg-red-50/30') : 'border-history-gold/10'}`}>
                            <p className="font-medium text-history-ink mb-6 text-lg font-display">
                                <span className="text-history-red mr-3 opacity-60 text-base">0{qIdx + 1}</span> {q.question}
                            </p>
                            
                            <div className="space-y-3">
                                {q.options.map((opt, oIdx) => (
                                    <button
                                        key={oIdx}
                                        onClick={() => handleSelect(qIdx, oIdx)}
                                        disabled={submitted}
                                        className={`w-full text-left p-4 rounded-sm border transition-all flex items-center justify-between group
                                            ${
                                                submitted
                                                    ? oIdx === q.correctAnswerIndex
                                                        ? 'bg-green-50 border-green-800/30 text-green-900' 
                                                        : userAnswer === oIdx
                                                            ? 'bg-red-50 border-red-800/30 text-red-900' 
                                                            : 'opacity-40 border-transparent bg-white/30'
                                                    : userAnswer === oIdx
                                                        ? 'bg-history-gold/10 border-history-gold/50 text-history-ink font-medium'
                                                        : 'bg-white/40 border-history-gold/5 hover:border-history-gold/30 hover:bg-white/60'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors shrink-0 ${
                                                submitted && oIdx === q.correctAnswerIndex ? 'bg-green-700 border-green-700 text-white' : 
                                                userAnswer === oIdx ? 'bg-history-gold border-history-gold text-white' : 'border-history-wood/20 text-history-wood/50'
                                            }`}>
                                                {String.fromCharCode(65 + oIdx)}
                                            </span>
                                            <span className="font-serif text-sm font-light leading-relaxed">{opt}</span>
                                        </div>
                                        
                                        {submitted && oIdx === q.correctAnswerIndex && <CheckCircle className="w-5 h-5 text-green-700 shrink-0" />}
                                        {submitted && userAnswer === oIdx && userAnswer !== q.correctAnswerIndex && <XCircle className="w-5 h-5 text-red-700 shrink-0" />}
                                    </button>
                                ))}
                            </div>

                            {submitted && (
                                <div className="mt-6 p-5 bg-white/50 rounded-sm border-l-2 border-history-gold flex items-start gap-4">
                                    <div className="mt-0.5 shrink-0 text-history-gold">
                                        <Lightbulb className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <span className="font-bold text-history-wood text-[10px] uppercase tracking-widest block mb-2 opacity-70">Explanation</span>
                                        <p className="text-history-ink leading-relaxed font-serif text-sm font-light italic">{q.explanation}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {!submitted && Object.keys(answers).length > 0 && (
                <div className="flex justify-center pt-8">
                     <button 
                        onClick={() => setSubmitted(true)}
                        className="px-10 py-3 bg-history-red text-white font-medium rounded-sm shadow-md hover:bg-history-ink transform transition-all active:scale-95 flex items-center gap-3 uppercase tracking-widest text-xs"
                    >
                        <CheckCircle className="w-4 h-4" /> {labels.study.submit}
                    </button>
                </div>
            )}
        </div>
    );
};