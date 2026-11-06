import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ResumeBuilder } from './components/features/ResumeBuilder';
import { InterviewQuestions } from './components/features/InterviewQuestions';
import { AnswerImprover } from './components/features/AnswerImprover';
import { CareerGuidance } from './components/features/CareerGuidance';
import { SkillRoadmap } from './components/features/SkillRoadmap';
import { CoverLetterGenerator } from './components/features/CoverLetterGenerator';
import { SavedHistoryModal } from './components/SavedHistoryModal';
import { Footer } from './components/Footer';
import { FeatureTab, SavedHistoryItem } from './types/career';
import { HistoryStorage } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState<FeatureTab>('overview');
  const [savedItems, setSavedItems] = useState<SavedHistoryItem[]>([]);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cross-feature prefill states
  const [answerImproverQuestion, setAnswerImproverQuestion] = useState<string>('');
  const [answerImproverRole, setAnswerImproverRole] = useState<string>('');
  const [interviewRole, setInterviewRole] = useState<string>('Junior Frontend Developer');
  const [roadmapSkill, setRoadmapSkill] = useState<string>('Full Stack Web Development');
  const [coverLetterDetails, setCoverLetterDetails] = useState<{
    fullName?: string;
    role?: string;
    projects?: string;
  }>({});

  // Load history count on mount
  useEffect(() => {
    setSavedItems(HistoryStorage.getAll());
  }, []);

  const refreshHistory = () => {
    setSavedItems(HistoryStorage.getAll());
    showToast('Saved to your drafts!');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Inter-feature navigation handlers
  const handlePracticeQuestion = (question: string, role: string) => {
    setAnswerImproverQuestion(question);
    setAnswerImproverRole(role);
    setActiveTab('answer-improver');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Loaded question into Answer Improver!');
  };

  const handleNavigateToCoverLetter = (details: { fullName: string; role: string; projects: string }) => {
    setCoverLetterDetails(details);
    setActiveTab('cover-letter');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Transferred resume details to Cover Letter Generator!');
  };

  const handleNavigateToRoadmap = (career: string) => {
    setRoadmapSkill(career);
    setActiveTab('skill-roadmap');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Generating roadmap for ${career}!`);
  };

  const handleNavigateToQuestions = (role: string) => {
    setInterviewRole(role);
    setActiveTab('interview-questions');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Loaded interview prep for ${role}!`);
  };

  const handleSelectSavedItem = (item: SavedHistoryItem) => {
    setActiveTab(item.type);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Loaded ${item.title}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-indigo-50/20 to-slate-50 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-bounce">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navigation */}
      <Header
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        savedCount={savedItems.length}
        onOpenHistory={() => setHistoryModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Breadcrumb if in a specific feature */}
        {activeTab !== 'overview' && (
          <div className="mb-6 flex items-center gap-2 text-xs text-slate-500">
            <button
              onClick={() => setActiveTab('overview')}
              className="hover:text-indigo-600 transition-colors font-semibold"
            >
              Dashboard
            </button>
            <span>/</span>
            <span className="text-slate-800 font-bold capitalize">
              {activeTab.replace('-', ' ')}
            </span>
          </div>
        )}

        {/* Feature Views */}
        {activeTab === 'overview' && (
          <Hero
            onSelectFeature={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'resume-builder' && (
          <ResumeBuilder
            onSavedNotification={refreshHistory}
            onNavigateToCoverLetter={handleNavigateToCoverLetter}
          />
        )}

        {activeTab === 'interview-questions' && (
          <InterviewQuestions
            onSavedNotification={refreshHistory}
            onPracticeQuestion={handlePracticeQuestion}
            initialRole={interviewRole}
          />
        )}

        {activeTab === 'answer-improver' && (
          <AnswerImprover
            onSavedNotification={refreshHistory}
            prefilledQuestion={answerImproverQuestion}
            prefilledRole={answerImproverRole}
          />
        )}

        {activeTab === 'career-guidance' && (
          <CareerGuidance
            onSavedNotification={refreshHistory}
            onNavigateToRoadmap={handleNavigateToRoadmap}
            onNavigateToQuestions={handleNavigateToQuestions}
          />
        )}

        {activeTab === 'skill-roadmap' && (
          <SkillRoadmap
            onSavedNotification={refreshHistory}
            initialSkillOrCareer={roadmapSkill}
          />
        )}

        {activeTab === 'cover-letter' && (
          <CoverLetterGenerator
            onSavedNotification={refreshHistory}
            initialDetails={coverLetterDetails}
          />
        )}
      </main>

      {/* Saved Drafts History Modal */}
      <SavedHistoryModal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        items={savedItems}
        onRemoveItem={(id) => {
          const updated = HistoryStorage.remove(id);
          setSavedItems(updated);
        }}
        onClearAll={() => {
          HistoryStorage.clear();
          setSavedItems([]);
        }}
        onSelectSavedItem={handleSelectSavedItem}
      />

      {/* Footer */}
      <Footer
        onSelectFeature={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
