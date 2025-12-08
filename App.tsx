

import React, { useState } from 'react';
import { generateHistoryContent } from './services/geminiService';
import { HistoryLessonData, SectionTab, Language, UILabels, ViewMode, PdfSection } from './types';
import { ExploreMode } from './components/ExploreMode';
import { StudyMode } from './components/StudyMode';
import { PrintLayout } from './components/PrintLayout';
import { SettingsModal } from './components/SettingsModal';
import { BookOpen, Sparkles, AlertCircle, Globe, Compass, GraduationCap, Download, X, CheckSquare, Square, Search, Feather, Settings } from 'lucide-react';

const UI_TEXT: Record<Language, {
  title: string;
  subtitle: string;
  placeholder: string;
  teachBtn: string;
  teachingBtn: string;
  error: string;
  welcome: string;
  welcomeSub: string;
  tabs: Record<string, string>;
  labels: UILabels;
  steps: { title: string; desc: string }[];
}> = {
  en: {
    title: "SuViet AI Tutor",
    subtitle: "History Education Reimagined",
    placeholder: "Which historical event shall we uncover today?",
    teachBtn: "Begin Journey",
    teachingBtn: "Consulting Archives...",
    error: "Failed to generate content. Please check your API key or try a different topic.",
    welcome: "Unlock the Past",
    welcomeSub: "Journey through history with immersive AI narratives, visual storyboards, and interactive learning tools.",
    tabs: {
      [SectionTab.OVERVIEW]: "Overview",
      [SectionTab.ANALYSIS]: "Analysis",
      [SectionTab.STORYBOARD]: "Visuals",
      [SectionTab.ASSETS]: "Assets",
    },
    labels: {
      sections: {
        summary: "Key Takeaways",
        timeline: "Chronicle of Events",
        characters: "Historical Figures",
        causes: "Roots & Origins",
        development: "The Unfolding",
        effects: "Legacy & Impact",
        voiceover: "Narration Script",
        storyboard: "Visual Storyboard",
        prompts: "Asset Generation",
        flashcards: "Knowledge Deck",
        mcq: "Assessment",
        thinking: "Critical Inquiry",
        visual: "Visual Description",
        angle: "Cinematography",
        audio: "Soundscape",
        analysis: "Deep Analysis"
      },
      study: {
        flashcardsMode: "Flashcards",
        quizMode: "Quiz Mode",
        next: "Next Card",
        prev: "Previous",
        flip: "Reveal Answer",
        submit: "Submit Assessment",
        score: "Final Score",
        retake: "Retake Assessment",
        correct: "Correct",
        incorrect: "Incorrect",
        question: "Query",
        of: "of",
        downloadPdf: "Export PDF",
        exploreLabel: "Explore",
        studyLabel: "Study",
        congrats: "Assessment Complete"
      },
      pdfModal: {
        title: "Export Document",
        description: "Select the archives you wish to include in your dossier.",
        selectAll: "Select All",
        deselectAll: "Deselect All",
        cancel: "Return",
        print: "Print / Save"
      },
      media: {
        generateImage: "Manifest Image",
        generateVideo: "Manifest Video",
        generating: "Crafting...",
        view: "View Artifact",
        download: "Download",
        videoDisclaimer: "Video generation typically takes 1-2 minutes.",
        selectKey: "Select API Key",
        apiKeyRequired: "API Key Required. Please set it in Settings."
      },
      settings: {
        title: "Settings",
        apiSection: "API Credentials",
        apiDesc: "Enter your Google AI Studio API Keys. Keys are stored locally in your browser cache.",
        geminiKeyLabel: "Gemini API Key (Text & Image)",
        veoKeyLabel: "Veo API Key (Video)",
        placeholder: "Enter API Key...",
        save: "Save Keys",
        saved: "Saved!",
        clear: "Clear All",
        close: "Close"
      }
    },
    steps: [
      { title: "Explore", desc: "Access comprehensive summaries and timelines." },
      { title: "Visualize", desc: "Generate storyboards and assets for media." },
      { title: "Master", desc: "Solidify knowledge with quizzes and flashcards." }
    ]
  },
  vi: {
    title: "Sử Việt AI Tutor",
    subtitle: "Tái hiện Lịch sử sống động",
    placeholder: "Hôm nay chúng ta sẽ tìm hiểu sự kiện nào?",
    teachBtn: "Bắt đầu",
    teachingBtn: "Đang tra cứu...",
    error: "Không thể tạo nội dung. Vui lòng kiểm tra API key hoặc thử chủ đề khác.",
    welcome: "Khám Phá Lịch Sử",
    welcomeSub: "Hành trình xuyên thời gian với phân tích chuyên sâu, hình ảnh trực quan và công cụ học tập thông minh.",
    tabs: {
      [SectionTab.OVERVIEW]: "Tổng quan",
      [SectionTab.ANALYSIS]: "Phân tích",
      [SectionTab.STORYBOARD]: "Hình ảnh",
      [SectionTab.ASSETS]: "Tài nguyên",
    },
    labels: {
      sections: {
        summary: "Cốt lõi",
        timeline: "Niên biểu",
        characters: "Nhân vật lịch sử",
        causes: "Nguyên nhân",
        development: "Diễn biến",
        effects: "Hệ quả & Ý nghĩa",
        voiceover: "Lời bình",
        storyboard: "Kịch bản phân cảnh",
        prompts: "Gợi ý AI",
        flashcards: "Thẻ ghi nhớ",
        mcq: "Trắc nghiệm",
        thinking: "Tư duy phản biện",
        visual: "Mô tả hình ảnh",
        angle: "Góc máy & Hành động",
        audio: "Âm thanh",
        analysis: "Phân tích chuyên sâu"
      },
      study: {
        flashcardsMode: "Thẻ học",
        quizMode: "Bài thi",
        next: "Tiếp theo",
        prev: "Quay lại",
        flip: "Lật thẻ",
        submit: "Nộp bài",
        score: "Kết quả",
        retake: "Làm lại",
        correct: "Chính xác",
        incorrect: "Chưa đúng",
        question: "Câu hỏi",
        of: "trên",
        downloadPdf: "Xuất PDF",
        exploreLabel: "Khám phá",
        studyLabel: "Học tập",
        congrats: "Hoàn thành!"
      },
      pdfModal: {
        title: "Xuất Tài Liệu",
        description: "Chọn các nội dung bạn muốn lưu trữ.",
        selectAll: "Chọn tất cả",
        deselectAll: "Bỏ chọn",
        cancel: "Hủy",
        print: "In / Tải về"
      },
      media: {
        generateImage: "Tạo Hình ảnh",
        generateVideo: "Tạo Video",
        generating: "Đang tạo...",
        view: "Xem Media",
        download: "Tải về",
        videoDisclaimer: "Việc tạo video có thể mất 1-2 phút.",
        selectKey: "Chọn API Key",
        apiKeyRequired: "Cần API Key. Vui lòng nhập trong Cài đặt."
      },
      settings: {
        title: "Cài đặt",
        apiSection: "Thông tin API",
        apiDesc: "Nhập khóa API Google AI Studio của bạn. Khóa sẽ được lưu cục bộ trên trình duyệt.",
        geminiKeyLabel: "Gemini API Key (Văn bản & Ảnh)",
        veoKeyLabel: "Veo API Key (Video)",
        placeholder: "Nhập API Key...",
        save: "Lưu Khóa",
        saved: "Đã Lưu!",
        clear: "Xóa Tất Cả",
        close: "Đóng"
      }
    },
    steps: [
      { title: "Khám phá", desc: "Tổng hợp kiến thức và niên biểu lịch sử." },
      { title: "Sáng tạo", desc: "Dựng lại bối cảnh với AI và storyboard." },
      { title: "Lĩnh hội", desc: "Ghi nhớ sâu sắc qua bài tập tương tác." }
    ]
  }
};

const ALL_PDF_SECTIONS: PdfSection[] = ['overview', 'analysis', 'storyboard', 'assets', 'quiz'];

const App: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState<Language>('vi');
  const [data, setData] = useState<HistoryLessonData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('explore');
  
  // PDF Modal State
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfSections, setPdfSections] = useState<PdfSection[]>(ALL_PDF_SECTIONS);

  // Settings Modal State
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const t = UI_TEXT[language];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await generateHistoryContent(topic, language);
      setData(result);
      setViewMode('explore');
      setPdfSections(ALL_PDF_SECTIONS);
    } catch (err) {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'vi' : 'en');
  };

  const handleOpenPdfModal = () => {
    setIsPdfModalOpen(true);
  };

  const handleClosePdfModal = () => {
    setIsPdfModalOpen(false);
  };

  const togglePdfSection = (section: PdfSection) => {
    setPdfSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section) 
        : [...prev, section]
    );
  };

  const toggleAllPdfSections = () => {
    if (pdfSections.length === ALL_PDF_SECTIONS.length) {
      setPdfSections([]);
    } else {
      setPdfSections(ALL_PDF_SECTIONS);
    }
  };

  const executePrint = async () => {
    setIsPdfModalOpen(false);
    // Ensure fonts are loaded before printing to prevent default font fallback
    try {
        await document.fonts.ready;
    } catch (e) {
        console.warn("Font loading check failed, proceeding to print.");
    }
    
    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <div className="min-h-screen pb-20 font-serif">
      
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-history-gold/20 shadow-sm no-print transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => { setData(null); setTopic(''); }}
          >
             <div className="w-8 h-8 rounded-sm border border-history-dark/10 flex items-center justify-center text-history-red bg-white/50 group-hover:bg-history-red group-hover:text-white transition-colors duration-500">
               <BookOpen className="w-4 h-4" />
             </div>
             <span className="font-display font-medium text-lg text-history-dark tracking-widest uppercase hidden sm:block">
               {t.title}
             </span>
             <span className="font-display font-bold text-lg text-history-dark tracking-widest uppercase sm:hidden">
               SuViet
             </span>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/40 hover:bg-white/80 border border-history-gold/20 text-xs tracking-widest transition-all duration-300"
            >
                <Globe className="w-3 h-3 text-history-wood" />
                <span className={`transition-colors duration-300 ${language === 'vi' ? 'text-history-ink font-bold' : 'text-history-wood/50'}`}>VN</span>
                <span className="text-history-wood/30">|</span>
                <span className={`transition-colors duration-300 ${language === 'en' ? 'text-history-ink font-bold' : 'text-history-wood/50'}`}>EN</span>
            </button>

            <button
                onClick={() => setIsSettingsModalOpen(true)}
                className="p-2 text-history-wood hover:text-history-dark hover:bg-white/50 rounded-full transition-all duration-300"
                title={t.labels.settings.title}
            >
                <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="pt-24 max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* Landing Hero Section */}
        {!data && !loading && (
          <section className="flex flex-col items-center justify-center min-h-[70vh] text-center no-print">
            <div className="mb-10 relative animate-float opacity-90">
                <div className="absolute -inset-4 bg-history-gold/10 rounded-full blur-3xl opacity-50"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-history-red to-history-ink rounded-full flex items-center justify-center shadow-lg border-4 border-white/20">
                    <Feather className="w-8 h-8 text-history-paper" />
                </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-display font-medium text-history-ink mb-6 drop-shadow-sm tracking-wide animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              {t.welcome}
            </h1>
            <p className="text-history-wood text-lg md:text-xl max-w-2xl mb-12 font-serif italic font-light leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              {t.welcomeSub}
            </p>
            
            <form onSubmit={handleGenerate} className="w-full max-w-xl relative group z-10 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-history-gold/50 to-history-red/50 rounded-lg blur opacity-10 group-hover:opacity-30 transition duration-1000"></div>
                <div className="relative flex items-center bg-white/80 rounded-lg shadow-paper p-1.5 transition-all duration-300 focus-within:ring-1 focus-within:ring-history-gold/30 border border-history-gold/20">
                    <Search className="w-5 h-5 text-history-wood ml-4 opacity-50 shrink-0" />
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder={t.placeholder}
                        className="w-full bg-transparent border-none focus:ring-0 text-history-dark placeholder-history-wood/40 px-4 py-3 text-base font-serif outline-none"
                    />
                    <button
                        type="submit"
                        disabled={!topic.trim()}
                        className="bg-history-ink hover:bg-black text-history-paper px-6 py-3 rounded-[4px] font-display font-medium text-xs tracking-widest uppercase transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shrink-0"
                    >
                        <Sparkles className="w-3 h-3" />
                        <span className="hidden sm:inline">{t.teachBtn}</span>
                    </button>
                </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full max-w-5xl border-t border-history-gold/10 pt-10">
                {t.steps.map((step, idx) => (
                <div 
                    key={idx} 
                    className="flex flex-col items-center p-4 hover:-translate-y-1 transition-transform duration-500 animate-fade-in-up group"
                    style={{ animationDelay: `${0.4 + (idx * 0.1)}s` }}
                >
                    <span className="text-history-red/30 font-display font-medium text-4xl mb-3 group-hover:text-history-red/60 transition-colors">0{idx + 1}</span>
                    <h3 className="text-history-dark font-medium mb-2 uppercase tracking-widest text-xs">{step.title}</h3>
                    <p className="text-history-wood text-sm leading-relaxed max-w-xs font-light">{step.desc}</p>
                </div>
                ))}
            </div>

            {error && (
              <div className="mt-8 p-4 glass-panel bg-red-50/50 text-red-900 border-red-200 rounded-lg flex items-center gap-2 animate-pulse font-serif text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
          </section>
        )}

        {/* Loading State */}
        {loading && (
          <div className="min-h-[60vh] flex flex-col items-center justify-center text-center no-print">
            <div className="relative">
                <div className="w-16 h-16 border-2 border-history-parchment border-t-history-red rounded-full animate-spin mb-8"></div>
                <div className="absolute inset-0 flex items-center justify-center mb-8">
                    <Feather className="w-5 h-5 text-history-red animate-pulse" />
                </div>
            </div>
            <h2 className="text-xl font-display font-medium text-history-dark mb-2 animate-pulse tracking-widest uppercase">{t.teachingBtn}</h2>
            <p className="text-history-wood font-serif italic text-sm">Consulting the archives...</p>
          </div>
        )}

        {/* Content View */}
        {!loading && data && (
          <div className="animate-fade-in-up pb-12">
            
            {/* Header / Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 border-b border-history-gold/20 pb-8 no-print">
                <div className="flex-1">
                   <div className="inline-block px-2 py-0.5 bg-history-gold/10 text-history-wood text-[10px] font-bold uppercase tracking-widest rounded mb-3 border border-history-gold/20">Historical Archive</div>
                   <h1 className="text-3xl md:text-5xl font-display font-medium text-history-ink leading-tight">{data.title}</h1>
                </div>

                <div className="flex flex-col items-end gap-4 w-full md:w-auto">
                    <div className="flex p-1 bg-history-parchment/50 rounded-lg border border-history-gold/10 w-full md:w-auto">
                        <button
                            onClick={() => setViewMode('explore')}
                            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-md font-medium text-xs uppercase tracking-wider transition-all duration-300 ${
                                viewMode === 'explore' 
                                ? 'bg-white text-history-ink shadow-sm border border-history-gold/10' 
                                : 'text-history-wood/70 hover:text-history-dark hover:bg-white/30'
                            }`}
                        >
                            <Compass className="w-3 h-3" />
                            {t.labels.study.exploreLabel}
                        </button>
                        <button
                            onClick={() => setViewMode('study')}
                            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-md font-medium text-xs uppercase tracking-wider transition-all duration-300 ${
                                viewMode === 'study' 
                                ? 'bg-history-red text-white shadow-sm' 
                                : 'text-history-red hover:bg-history-red/5'
                            }`}
                        >
                            <GraduationCap className="w-3 h-3" />
                            {t.labels.study.studyLabel}
                        </button>
                    </div>

                    <button 
                        onClick={handleOpenPdfModal}
                        className="text-[10px] font-bold text-history-wood/60 hover:text-history-red flex items-center gap-2 px-2 transition-colors uppercase tracking-widest"
                    >
                        <Download className="w-3 h-3" />
                        {t.labels.study.downloadPdf}
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="no-print min-h-[500px]">
                {viewMode === 'explore' ? (
                    <ExploreMode data={data} labels={t.labels} tabLabels={t.tabs} />
                ) : (
                    <StudyMode data={data} labels={t.labels} />
                )}
            </div>
            
            {/* Hidden Print Layout */}
            <PrintLayout data={data} labels={t.labels} sections={pdfSections} />
          </div>
        )}
      </main>

      {/* PDF Modal */}
      {isPdfModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-history-ink/40 backdrop-blur-sm p-4 animate-fade-in no-print">
          <div className="glass-panel rounded-lg shadow-2xl max-w-md w-full overflow-hidden flex flex-col animate-fade-in-up border border-history-gold/20">
            <div className="bg-white/80 px-6 py-4 border-b border-history-gold/10 flex justify-between items-center backdrop-blur-sm">
              <div>
                <h3 className="text-lg font-display font-medium text-history-ink">{t.labels.pdfModal.title}</h3>
              </div>
              <button 
                onClick={handleClosePdfModal}
                className="p-1 hover:bg-black/5 rounded-full text-history-wood transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm text-history-wood/80 mb-5 font-light italic">{t.labels.pdfModal.description}</p>
              <div className="flex justify-end mb-3">
                 <button 
                  onClick={toggleAllPdfSections}
                  className="text-[10px] font-bold uppercase tracking-widest text-history-red hover:underline"
                 >
                   {pdfSections.length === ALL_PDF_SECTIONS.length ? t.labels.pdfModal.deselectAll : t.labels.pdfModal.selectAll}
                 </button>
              </div>

              <div className="space-y-2">
                {ALL_PDF_SECTIONS.map((section) => {
                   const isSelected = pdfSections.includes(section);
                   let label = '';
                   switch(section) {
                     case 'overview': label = `${t.labels.sections.summary} & ${t.labels.sections.timeline}`; break;
                     case 'analysis': label = t.labels.sections.analysis; break;
                     case 'storyboard': label = t.labels.sections.storyboard; break;
                     case 'assets': label = t.labels.sections.prompts; break;
                     case 'quiz': label = `${t.labels.sections.flashcards} & ${t.labels.sections.mcq}`; break;
                   }

                   return (
                     <div 
                        key={section}
                        onClick={() => togglePdfSection(section)}
                        className={`flex items-center gap-3 p-3 rounded border cursor-pointer transition-all duration-200 ${
                          isSelected 
                            ? 'bg-history-gold/10 border-history-gold/30 text-history-ink font-medium' 
                            : 'bg-white/40 border-transparent text-history-wood/60 hover:bg-white/80'
                        }`}
                     >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-history-red" />
                        ) : (
                          <Square className="w-4 h-4 text-history-gold/30" />
                        )}
                        <span className="font-serif text-sm">{label}</span>
                     </div>
                   );
                })}
              </div>
            </div>

            <div className="p-6 bg-history-parchment/20 border-t border-history-gold/10 flex justify-end gap-3 backdrop-blur-sm">
              <button 
                onClick={handleClosePdfModal}
                className="px-4 py-2 text-history-wood hover:text-history-dark font-medium transition-colors text-xs tracking-wide"
              >
                {t.labels.pdfModal.cancel}
              </button>
              <button 
                onClick={executePrint}
                disabled={pdfSections.length === 0}
                className="px-6 py-2 bg-history-ink text-history-paper rounded-[4px] font-medium shadow-sm hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 text-xs uppercase tracking-widest transform active:scale-95"
              >
                <Download className="w-3 h-3" />
                {t.labels.pdfModal.print}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        labels={t.labels}
      />

    </div>
  );
};

export default App;
