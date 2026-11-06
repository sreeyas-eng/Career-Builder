import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  HelpCircle,
  CheckCircle2,
  Compass,
  MapPin,
  Mail,
  Bookmark,
  Menu,
  X,
  GraduationCap,
} from 'lucide-react';
import { FeatureTab } from '../types/career';

interface HeaderProps {
  activeTab: FeatureTab;
  onSelectTab: (tab: FeatureTab) => void;
  savedCount: number;
  onOpenHistory: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  savedCount,
  onOpenHistory,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: FeatureTab; label: string; icon: React.ReactNode; shortLabel: string }[] = [
    { id: 'overview', label: 'Dashboard', icon: <Sparkles className="w-4 h-4" />, shortLabel: 'Home' },
    { id: 'resume-builder', label: 'Resume Builder', icon: <FileText className="w-4 h-4" />, shortLabel: 'Resume' },
    { id: 'interview-questions', label: 'Interview Prep', icon: <HelpCircle className="w-4 h-4" />, shortLabel: 'Questions' },
    { id: 'answer-improver', label: 'Answer Improver', icon: <CheckCircle2 className="w-4 h-4" />, shortLabel: 'Improver' },
    { id: 'career-guidance', label: 'Career Guidance', icon: <Compass className="w-4 h-4" />, shortLabel: 'Guidance' },
    { id: 'skill-roadmap', label: 'Skill Roadmap', icon: <MapPin className="w-4 h-4" />, shortLabel: 'Roadmap' },
    { id: 'cover-letter', label: 'Cover Letter', icon: <Mail className="w-4 h-4" />, shortLabel: 'Cover Letter' },
  ];

  const handleNavClick = (tab: FeatureTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo & Tagline */}
          <div
            onClick={() => handleNavClick('overview')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 bg-clip-text text-transparent">
                  AI Career Buddy
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  College Ed.
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block font-medium">
                Discover Your Skills. Build Your Future.
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  {item.icon}
                  {item.shortLabel}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Saved History & Mobile Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenHistory}
              title="Saved Resumes, Letters & Roadmaps"
              className="relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs transition-colors"
            >
              <Bookmark className="w-4 h-4 text-purple-600" />
              <span className="hidden sm:inline">Saved Drafts</span>
              {savedCount > 0 && (
                <span className="bg-purple-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-4 text-center">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-1 shadow-xl">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 pb-1">
            Career Tools
          </div>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-left transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-indigo-600'}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
