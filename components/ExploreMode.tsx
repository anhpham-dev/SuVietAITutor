import React, { useState } from 'react';
import { HistoryLessonData, SectionTab, UILabels } from '../types';
import { OverviewView } from './OverviewView';
import { AnalysisView } from './AnalysisView';
import { StoryboardView } from './StoryboardView';
import { AssetsView } from './AssetsView';
import { TabButton } from './TabButton';
import { LayoutDashboard, Microscope, Clapperboard, Image as ImageIcon } from 'lucide-react';

interface ExploreModeProps {
  data: HistoryLessonData;
  labels: UILabels;
  tabLabels: Record<string, string>;
}

export const ExploreMode: React.FC<ExploreModeProps> = ({ data, labels, tabLabels }) => {
  const [activeTab, setActiveTab] = useState<SectionTab>(SectionTab.OVERVIEW);

  const renderContent = () => {
    switch (activeTab) {
      case SectionTab.OVERVIEW: return <OverviewView data={data} labels={labels} />;
      case SectionTab.ANALYSIS: return <AnalysisView data={data} labels={labels} />;
      case SectionTab.STORYBOARD: return <StoryboardView data={data} labels={labels} />;
      case SectionTab.ASSETS: return <AssetsView data={data} labels={labels} />;
      default: return <OverviewView data={data} labels={labels} />;
    }
  };

  return (
    <div className="animate-fade-in-up">
      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto space-x-2 mb-8 border-b border-history-gold/30 scrollbar-hide pb-1 w-full snap-x">
        <TabButton
          label={tabLabels[SectionTab.OVERVIEW]}
          isActive={activeTab === SectionTab.OVERVIEW}
          onClick={() => setActiveTab(SectionTab.OVERVIEW)}
          icon={<LayoutDashboard className="w-4 h-4" />}
        />
        <TabButton
          label={tabLabels[SectionTab.ANALYSIS]}
          isActive={activeTab === SectionTab.ANALYSIS}
          onClick={() => setActiveTab(SectionTab.ANALYSIS)}
          icon={<Microscope className="w-4 h-4" />}
        />
        <TabButton
          label={tabLabels[SectionTab.STORYBOARD]}
          isActive={activeTab === SectionTab.STORYBOARD}
          onClick={() => setActiveTab(SectionTab.STORYBOARD)}
          icon={<Clapperboard className="w-4 h-4" />}
        />
        <TabButton
          label={tabLabels[SectionTab.ASSETS]}
          isActive={activeTab === SectionTab.ASSETS}
          onClick={() => setActiveTab(SectionTab.ASSETS)}
          icon={<ImageIcon className="w-4 h-4" />}
        />
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">
        {renderContent()}
      </div>
    </div>
  );
};