import React from 'react';
import { GraduationCap, ShieldCheck, Heart } from 'lucide-react';
import { FeatureTab } from '../types/career';

interface FooterProps {
  onSelectFeature: (tab: FeatureTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectFeature }) => {
  return (
    <footer className="mt-16 border-t border-slate-200/90 bg-white/90 backdrop-blur-md pt-12 pb-8 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg text-slate-900">
                AI Career Buddy
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-sm">
              Discover Your Skills. Build Your Future. Designed as a personal career assistant for college students and recent graduates preparing for internships, interviews, and technology careers.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
              <span>Powered securely with Google Gemini 3.8 Flash API</span>
            </div>
          </div>

          {/* Feature Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Career Tools
            </h4>
            <ul className="text-xs space-y-1.5">
              <li>
                <button
                  onClick={() => onSelectFeature('resume-builder')}
                  className="hover:text-indigo-600 transition-colors cursor-pointer text-left"
                >
                  AI Resume Builder
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectFeature('interview-questions')}
                  className="hover:text-indigo-600 transition-colors cursor-pointer text-left"
                >
                  Interview Question Generator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectFeature('answer-improver')}
                  className="hover:text-indigo-600 transition-colors cursor-pointer text-left"
                >
                  Interview Answer Improver
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Planning & Applications
            </h4>
            <ul className="text-xs space-y-1.5">
              <li>
                <button
                  onClick={() => onSelectFeature('career-guidance')}
                  className="hover:text-indigo-600 transition-colors cursor-pointer text-left"
                >
                  AI Career Guidance
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectFeature('skill-roadmap')}
                  className="hover:text-indigo-600 transition-colors cursor-pointer text-left"
                >
                  Skill Learning Roadmap
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectFeature('cover-letter')}
                  className="hover:text-indigo-600 transition-colors cursor-pointer text-left"
                >
                  Cover Letter Generator
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Bar */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p className="text-center sm:text-left">
            <strong>Educational Disclaimer:</strong> AI Career Buddy generates draft resumes, practice questions, and suggestions for mock career preparation. It does not guarantee job placements or interview outcomes. Never submit unverified details.
          </p>
          <div className="flex items-center gap-1 shrink-0">
            <span>Crafted for college students with</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
