import React from 'react';
import { HistoryLessonData, UILabels } from '../types';
import { Clock, Bookmark } from 'lucide-react';

interface OverviewViewProps {
  data: HistoryLessonData;
  labels: UILabels;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ data, labels }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in-up">
      
      {/* Summary Section - Takes up 7 columns */}
      <div className="lg:col-span-7 glass-card p-8 md:p-10 rounded-sm relative overflow-hidden transition-all duration-500 hover:shadow-paper-hover border-t-2 border-t-history-gold/20">
        <h3 className="text-2xl font-display font-medium text-history-ink mb-10 flex items-center gap-3 border-b border-history-gold/10 pb-4 tracking-wide">
          <Bookmark className="w-5 h-5 text-history-red" />
          {labels.sections.summary}
        </h3>
        <ul className="space-y-8">
          {data.summaryPoints.map((point, index) => (
            <li 
                key={index} 
                className="flex gap-5 group animate-slide-in"
                style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span className="flex-shrink-0 font-display text-4xl text-history-gold/30 font-bold -mt-2 group-hover:text-history-red/40 transition-colors">
                {index + 1}
              </span>
              <p className="text-history-dark text-lg leading-loose font-serif font-light text-justify w-full group-hover:text-history-ink transition-colors border-b border-dashed border-gray-200/50 pb-4 last:border-0">
                {point}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Timeline Section - Takes up 5 columns */}
      <div className="lg:col-span-5 glass-panel bg-history-parchment/20 rounded-sm p-8 md:p-10 shadow-inner-warm">
        <h3 className="text-2xl font-display font-medium text-history-ink mb-10 flex items-center gap-3 tracking-wide">
          <Clock className="w-5 h-5 text-history-red" />
          {labels.sections.timeline}
        </h3>
        
        <div className="relative border-l border-history-gold/40 ml-3 space-y-0">
          {data.timeline.map((item, index) => (
            <div 
                key={index} 
                className="relative pl-10 pb-12 last:pb-0 group animate-fade-in-up"
                style={{ animationDelay: `${0.3 + (index * 0.1)}s` }}
            >
              {/* Dot - Designed like a small ink blot or wax seal */}
              <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-history-paper border border-history-gold group-hover:bg-history-red group-hover:border-history-red transition-colors duration-500 z-10"></div>
              
              {/* Content */}
              <div className="relative -top-1 transition-all duration-300 hover:translate-x-1">
                <span className="inline-block text-history-red text-sm font-bold mb-1 font-sans tracking-widest uppercase opacity-80">
                  {item.year}
                </span>
                <p className="text-history-dark font-serif leading-relaxed text-base font-light border-l-2 border-transparent pl-0 group-hover:pl-3 group-hover:border-history-gold/30 transition-all duration-300">
                  {item.event}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};