
import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Sparkles, Globe, Settings, GraduationCap, Compass } from 'lucide-react';

interface OnboardingStep {
    target: string; // CSS selector or element ID
    title: string;
    description: string;
    position: 'top' | 'bottom' | 'left' | 'right';
}

const ONBOARDING_STEPS_EN: OnboardingStep[] = [
    {
        target: '#search-input',
        title: 'Enter a Historical Topic',
        description: 'Type any historical event, period, or figure you want to learn about. For example: "Battle of Dien Bien Phu" or "Nguyen Dynasty".',
        position: 'bottom'
    },
    {
        target: '#language-toggle',
        title: 'Switch Language',
        description: 'Toggle between Vietnamese and English for the interface and generated content.',
        position: 'bottom'
    },
    {
        target: '#settings-btn',
        title: 'Settings',
        description: 'Configure your API keys here. You need a Gemini API key to generate content.',
        position: 'bottom'
    },
    {
        target: '#mode-toggle',
        title: 'Explore & Study Modes',
        description: 'After generating content, switch between Explore mode (learn) and Study mode (practice with flashcards and quizzes).',
        position: 'top'
    }
];

const ONBOARDING_STEPS_VI: OnboardingStep[] = [
    {
        target: '#search-input',
        title: 'Nhập Chủ Đề Lịch Sử',
        description: 'Nhập bất kỳ sự kiện, thời kỳ hoặc nhân vật lịch sử nào bạn muốn tìm hiểu. Ví dụ: "Chiến thắng Điện Biên Phủ" hoặc "Nhà Nguyễn".',
        position: 'bottom'
    },
    {
        target: '#language-toggle',
        title: 'Chuyển Đổi Ngôn Ngữ',
        description: 'Chuyển đổi giữa tiếng Việt và tiếng Anh cho giao diện và nội dung được tạo.',
        position: 'bottom'
    },
    {
        target: '#settings-btn',
        title: 'Cài Đặt',
        description: 'Cấu hình API key của bạn tại đây. Bạn cần Gemini API key để tạo nội dung.',
        position: 'bottom'
    },
    {
        target: '#mode-toggle',
        title: 'Chế Độ Khám Phá & Học Tập',
        description: 'Sau khi tạo nội dung, chuyển đổi giữa chế độ Khám phá (học) và chế độ Học tập (luyện tập với flashcard và bài kiểm tra).',
        position: 'top'
    }
];

interface OnboardingProps {
    language: 'en' | 'vi';
    onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ language, onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

    const steps = language === 'vi' ? ONBOARDING_STEPS_VI : ONBOARDING_STEPS_EN;
    const step = steps[currentStep];

    useEffect(() => {
        const updateTargetPosition = () => {
            const target = document.querySelector(step.target);
            if (target) {
                setTargetRect(target.getBoundingClientRect());
            } else {
                setTargetRect(null);
            }
        };

        updateTargetPosition();
        window.addEventListener('resize', updateTargetPosition);
        window.addEventListener('scroll', updateTargetPosition);

        return () => {
            window.removeEventListener('resize', updateTargetPosition);
            window.removeEventListener('scroll', updateTargetPosition);
        };
    }, [step.target, currentStep]);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onComplete();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSkip = () => {
        onComplete();
    };

    // Calculate tooltip position
    const getTooltipStyle = (): React.CSSProperties => {
        if (!targetRect) {
            return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
        }

        const padding = 16;
        const tooltipWidth = 320;

        switch (step.position) {
            case 'bottom':
                return {
                    top: targetRect.bottom + padding,
                    left: Math.max(padding, Math.min(targetRect.left + targetRect.width / 2 - tooltipWidth / 2, window.innerWidth - tooltipWidth - padding)),
                };
            case 'top':
                return {
                    bottom: window.innerHeight - targetRect.top + padding,
                    left: Math.max(padding, Math.min(targetRect.left + targetRect.width / 2 - tooltipWidth / 2, window.innerWidth - tooltipWidth - padding)),
                };
            case 'left':
                return {
                    top: targetRect.top + targetRect.height / 2,
                    right: window.innerWidth - targetRect.left + padding,
                    transform: 'translateY(-50%)',
                };
            case 'right':
                return {
                    top: targetRect.top + targetRect.height / 2,
                    left: targetRect.right + padding,
                    transform: 'translateY(-50%)',
                };
            default:
                return {};
        }
    };

    return (
        <div className="fixed inset-0 z-[200] pointer-events-none">
            {/* Dark overlay with cutout for highlighted element */}
            <div className="absolute inset-0 pointer-events-auto">
                <svg className="w-full h-full">
                    <defs>
                        <mask id="spotlight-mask">
                            <rect x="0" y="0" width="100%" height="100%" fill="white" />
                            {targetRect && (
                                <rect
                                    x={targetRect.left - 8}
                                    y={targetRect.top - 8}
                                    width={targetRect.width + 16}
                                    height={targetRect.height + 16}
                                    rx="8"
                                    fill="black"
                                />
                            )}
                        </mask>
                    </defs>
                    <rect
                        x="0"
                        y="0"
                        width="100%"
                        height="100%"
                        fill="rgba(0, 0, 0, 0.75)"
                        mask="url(#spotlight-mask)"
                    />
                </svg>
            </div>

            {/* Highlight ring around target */}
            {targetRect && (
                <div
                    className="absolute border-2 border-history-gold rounded-lg pointer-events-none animate-pulse"
                    style={{
                        top: targetRect.top - 8,
                        left: targetRect.left - 8,
                        width: targetRect.width + 16,
                        height: targetRect.height + 16,
                        boxShadow: '0 0 0 4px rgba(212, 175, 55, 0.3), 0 0 20px rgba(212, 175, 55, 0.5)',
                    }}
                />
            )}

            {/* Tooltip */}
            <div
                className="absolute w-[calc(100%-2rem)] sm:w-80 max-w-[320px] glass-panel bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-4 sm:p-5 pointer-events-auto animate-fade-in-up border border-history-gold/30"
                style={getTooltipStyle()}
            >
                {/* Progress indicator */}
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="flex gap-1 sm:gap-1.5">
                        {steps.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${idx === currentStep
                                    ? 'bg-history-red w-4 sm:w-6'
                                    : idx < currentStep
                                        ? 'bg-history-gold'
                                        : 'bg-history-gold/30'
                                    }`}
                            />
                        ))}
                    </div>
                    <button
                        onClick={handleSkip}
                        className="text-history-wood/60 hover:text-history-wood text-[10px] sm:text-xs uppercase tracking-widest font-bold transition-colors"
                    >
                        {language === 'vi' ? 'Bỏ qua' : 'Skip'}
                    </button>
                </div>

                {/* Content */}
                <div className="mb-4 sm:mb-5">
                    <h3 className="font-display font-medium text-base sm:text-lg text-history-ink mb-1.5 sm:mb-2">
                        {step.title}
                    </h3>
                    <p className="text-history-wood text-xs sm:text-sm leading-relaxed">
                        {step.description}
                    </p>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={handlePrev}
                        disabled={currentStep === 0}
                        className="flex items-center gap-1 px-3 py-2 text-history-wood hover:text-history-dark disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        {language === 'vi' ? 'Trước' : 'Back'}
                    </button>

                    <span className="text-history-wood/50 text-xs">
                        {currentStep + 1} / {steps.length}
                    </span>

                    <button
                        onClick={handleNext}
                        className="flex items-center gap-1 px-4 py-2 bg-history-ink text-white rounded-md hover:bg-black transition-all text-sm font-medium shadow-md"
                    >
                        {currentStep === steps.length - 1
                            ? (language === 'vi' ? 'Hoàn tất' : 'Finish')
                            : (language === 'vi' ? 'Tiếp' : 'Next')
                        }
                        {currentStep < steps.length - 1 && <ChevronRight className="w-4 h-4" />}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Hook to manage onboarding state
export const useOnboarding = () => {
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [hasChecked, setHasChecked] = useState(false);

    useEffect(() => {
        const hasSeenOnboarding = localStorage.getItem('suviet_onboarding_complete');
        if (!hasSeenOnboarding) {
            // Small delay to let the page render first
            setTimeout(() => setShowOnboarding(true), 1000);
        }
        setHasChecked(true);
    }, []);

    const completeOnboarding = () => {
        localStorage.setItem('suviet_onboarding_complete', 'true');
        setShowOnboarding(false);
    };

    const resetOnboarding = () => {
        localStorage.removeItem('suviet_onboarding_complete');
        setShowOnboarding(true);
    };

    return { showOnboarding, completeOnboarding, resetOnboarding, hasChecked };
};
