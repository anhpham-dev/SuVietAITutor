import React from 'react';
import { HistoryLessonData, UILabels } from '../types';
import { Users, AlertTriangle, TrendingUp, Target } from 'lucide-react';

interface AnalysisViewProps {
  data: HistoryLessonData;
  labels: UILabels;
}

const Card: React.FC<{ title: string; icon: React.ReactNode; items: string[]; delay: number; variant?: 'ink' | 'red' | 'gold' | 'wood' }> = ({ title, icon, items, delay, variant = 'ink' }) => {
    
  const colors = {
      ink: 'text-history-ink border-history-dark/20',
      red: 'text-history-red border-history-red/20',
      gold: 'text-history-gold border-history-gold/30',
      wood: 'text-history-wood border-history-wood/30'
  };
  
  const iconColors = {
      ink: 'text-history-ink bg-history-dark/5',
      red: 'text-history-red bg-history-red/5',
      gold: 'text-history-gold bg-history-gold/10',
      wood: 'text-history-wood bg-history-wood/10'
  };

  return (
    <div 
        className={`glass-card p-8 rounded-sm relative overflow-hidden group hover:shadow-paper-hover transition-all duration-500 animate-fade-in-up border-t-4 ${colors[variant].split(' ')[1]}`}
        style={{ animationDelay: `${delay}s` }}
    >
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-history-gold/10">
            <div className={`p-2 rounded ${iconColors[variant]}`}>
                {icon}
            </div>
            <h3 className={`text-lg font-display font-medium uppercase tracking-widest ${colors[variant].split(' ')[0]}`}>
                {title}
            </h3>
        </div>
        
        <ul className="space-y-4">
        {items.map((item, i) => (
            <li key={i} className="text-history-dark font-serif text-base leading-relaxed flex items-start gap-3 group-hover:text-black transition-colors font-light">
            <span className="mt-2 w-1 h-1 rounded-full bg-history-wood/40 flex-shrink-0" />
            {item}
            </li>
        ))}
        </ul>
    </div>
  );
};

export const AnalysisView: React.FC<AnalysisViewProps> = ({ data, labels }) => {
  const { analysis } = data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8">
      <Card 
        title={labels.sections.characters}
        icon={<Users className="w-5 h-5" />} 
        items={analysis.keyCharacters} 
        variant="ink"
        delay={0}
      />
      <Card 
        title={labels.sections.causes}
        icon={<AlertTriangle className="w-5 h-5" />} 
        items={analysis.causes} 
        variant="red"
        delay={0.1}
      />
      <Card 
        title={labels.sections.development}
        icon={<TrendingUp className="w-5 h-5" />} 
        items={analysis.developments} 
        variant="gold"
        delay={0.2}
      />
      <Card 
        title={labels.sections.effects}
        icon={<Target className="w-5 h-5" />} 
        items={analysis.effects} 
        variant="wood"
        delay={0.3}
      />
    </div>
  );
};