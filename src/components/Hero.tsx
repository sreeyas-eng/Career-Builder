import React from 'react';
import {
  FileText,
  HelpCircle,
  CheckCircle2,
  Compass,
  MapPin,
  Mail,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Target,
  Zap,
} from 'lucide-react';
import { FeatureTab } from '../types/career';

interface HeroProps {
  onSelectFeature: (tab: FeatureTab) => void;
}

export const Hero: React.FC<HeroProps> = ({ onSelectFeature }) => {
  const features = [
    {
      id: 'resume-builder' as FeatureTab,
      title: 'AI Resume Builder',
      badge: 'ATS-Optimized',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      description:
        'Transform your college coursework, projects, and campus achievements into an interview-winning, ATS-friendly resume draft.',
      icon: <FileText className="w-6 h-6 text-blue-600" />,
      gradient: 'from-blue-500/10 to-indigo-500/10',
      borderHover: 'hover:border-blue-300 hover:shadow-blue-500/10',
      iconBg: 'bg-blue-100',
      actionText: 'Build My Resume',
    },
    {
      id: 'interview-questions' as FeatureTab,
      title: 'Interview Practice Questions',
      badge: '10 Tailored Qs',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      description:
        'Generate 10 role-specific practice questions (Technical + HR/Behavioral) with insider tips on why interviewers ask them.',
      icon: <HelpCircle className="w-6 h-6 text-indigo-600" />,
      gradient: 'from-indigo-500/10 to-purple-500/10',
      borderHover: 'hover:border-indigo-300 hover:shadow-indigo-500/10',
      iconBg: 'bg-indigo-100',
      actionText: 'Generate Questions',
    },
    {
      id: 'answer-improver' as FeatureTab,
      title: 'Interview Answer Improver',
      badge: 'STAR Method & Scores',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      description:
        'Paste your raw answer draft. Get enhanced grammar, structured STAR delivery, clarity scores, and constructive coaching.',
      icon: <CheckCircle2 className="w-6 h-6 text-purple-600" />,
      gradient: 'from-purple-500/10 to-pink-500/10',
      borderHover: 'hover:border-purple-300 hover:shadow-purple-500/10',
      iconBg: 'bg-purple-100',
      actionText: 'Polish My Answer',
    },
    {
      id: 'career-guidance' as FeatureTab,
      title: 'AI Career Guidance',
      badge: 'Personalized Paths',
      badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
      description:
        'Share your favourite subjects, skills, and passions. Discover 3-4 suitable career trajectories, required skills, and dorm project ideas.',
      icon: <Compass className="w-6 h-6 text-sky-600" />,
      gradient: 'from-sky-500/10 to-blue-500/10',
      borderHover: 'hover:border-sky-300 hover:shadow-sky-500/10',
      iconBg: 'bg-sky-100',
      actionText: 'Explore Career Paths',
    },
    {
      id: 'skill-roadmap' as FeatureTab,
      title: 'Skill Learning Roadmap',
      badge: 'Beginner to Advanced',
      badgeColor: 'bg-violet-50 text-violet-700 border-violet-200',
      description:
        'Step-by-step learning blueprints from beginner foundations to intermediate mastery and advanced portfolio capstones with free resources.',
      icon: <MapPin className="w-6 h-6 text-violet-600" />,
      gradient: 'from-violet-500/10 to-purple-500/10',
      borderHover: 'hover:border-violet-300 hover:shadow-violet-500/10',
      iconBg: 'bg-violet-100',
      actionText: 'Get Learning Roadmap',
    },
    {
      id: 'cover-letter' as FeatureTab,
      title: 'Cover Letter Generator',
      badge: 'Role & Company Tailored',
      badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      description:
        'Create authentic, compelling cover letters that connect your academic projects to company needs without robotic fluff.',
      icon: <Mail className="w-6 h-6 text-cyan-600" />,
      gradient: 'from-cyan-500/10 to-blue-500/10',
      borderHover: 'hover:border-cyan-300 hover:shadow-cyan-500/10',
      iconBg: 'bg-cyan-100',
      actionText: 'Write Cover Letter',
    },
  ];

  return (
    <div className="space-y-12 pb-8">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white p-6 sm:p-10 lg:p-14 shadow-2xl border border-indigo-900/40">
        {/* Glow ambient circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-purple-200 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin-slow" />
            <span>Built exclusively for college students & fresh graduates</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-tight mb-4">
            Discover Your Skills.{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
              Build Your Future.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed mb-8 max-w-2xl">
            Meet <strong className="text-white font-semibold">AI Career Buddy</strong>: Your intelligent campus companion for drafting ATS resumes, mastering interview questions, upgrading your answers, and charting clear skill roadmaps with Google Gemini AI.
          </p>

          {/* Quick CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onSelectFeature('resume-builder')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              Build Resume Now
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onSelectFeature('career-guidance')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm backdrop-blur-md border border-white/15 hover:border-white/30 transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4 text-purple-300" />
              Explore Career Options
            </button>

            <button
              onClick={() => onSelectFeature('interview-questions')}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-transparent hover:bg-white/5 text-slate-300 hover:text-white font-semibold text-sm transition-all cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-blue-300" />
              Practice Interviews
            </button>
          </div>

          {/* Student Trust Badges */}
          <div className="mt-10 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Authentic Advice — No Invented Data</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>ATS & Recruiter-Ready Structure</span>
            </div>
            <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
              <Zap className="w-4 h-4 text-yellow-400 shrink-0" />
              <span>Powered by Gemini 3.8 Flash</span>
            </div>
          </div>
        </div>
      </section>

      {/* Six Main Feature Cards Grid */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
              All-In-One Toolkit
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Select a Career Tool to Get Started
            </h2>
          </div>
          <p className="text-sm text-slate-500 max-w-md">
            Click any module below to input your details, run live Gemini AI analysis, and copy polished drafts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => (
            <div
              key={feat.id}
              onClick={() => onSelectFeature(feat.id)}
              className={`group relative flex flex-col justify-between p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl ${feat.borderHover} transition-all duration-200 cursor-pointer overflow-hidden`}
            >
              {/* Subtle gradient background on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feat.gradient} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}
              />

              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-xl ${feat.iconBg} flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform`}
                  >
                    {feat.icon}
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${feat.badgeColor}`}
                  >
                    {feat.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>

              <div className="relative z-10 mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:text-indigo-700">
                <span>{feat.actionText}</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* College Student Guidance Disclaimer */}
      <section className="rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-6 border border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="text-xs sm:text-sm text-slate-700 space-y-1">
          <p className="font-semibold text-slate-900">
            A Friendly Note for College Students & Job Seekers:
          </p>
          <p className="text-slate-600">
            AI Career Buddy provides guidance, practice questions, and draft templates to help you articulate your real skills. We never invent fake qualifications, and questions are intended for mock preparation. Career success depends on consistent practice and authentic presentation.
          </p>
        </div>
      </section>
    </div>
  );
};
