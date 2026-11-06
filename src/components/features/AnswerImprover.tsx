import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Award,
  Zap,
  TrendingUp,
  AlertCircle,
  ThumbsUp,
  MessageSquare,
} from 'lucide-react';
import { CareerAPI, HistoryStorage } from '../../services/api';
import { AnswerImproverResult } from '../../types/career';
import confetti from 'canvas-confetti';

interface AnswerImproverProps {
  onSavedNotification?: () => void;
  prefilledQuestion?: string;
  prefilledRole?: string;
}

export const AnswerImprover: React.FC<AnswerImproverProps> = ({
  onSavedNotification,
  prefilledQuestion = '',
  prefilledRole = 'College Graduate / Entry-level Role',
}) => {
  const [targetRole, setTargetRole] = useState(prefilledRole);
  const [question, setQuestion] = useState(
    prefilledQuestion || 'Tell me about a challenging project deadline and how you handled it.'
  );
  const [answer, setAnswer] = useState(
    'In my second year college database project, our team partner got sick two days before the submission deadline. We still had to finish the backend API and connect the frontend. I was really stressed, but I stayed up late, worked with the other teammate, and split the remaining tasks. We managed to submit it on time and got an A, so it worked out fine.'
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnswerImproverResult | null>(null);
  const [copiedImproved, setCopiedImproved] = useState(false);
  const [copiedElevator, setCopiedElevator] = useState(false);

  useEffect(() => {
    if (prefilledQuestion) {
      setQuestion(prefilledQuestion);
    }
    if (prefilledRole) {
      setTargetRole(prefilledRole);
    }
  }, [prefilledQuestion, prefilledRole]);

  // Sample answer loaders
  const loadBehavioralSample = () => {
    setQuestion('Tell me about a challenging project deadline and how you handled it.');
    setAnswer(
      'In my college database project, our team partner got sick two days before the submission deadline. We still had to finish the backend API and connect the frontend. I was really stressed, but I stayed up late, worked with the other teammate, and split the remaining tasks. We managed to submit it on time and got an A, so it worked out fine.'
    );
  };

  const loadTechnicalSample = () => {
    setQuestion('Can you explain what a REST API is and why we use it?');
    setAnswer(
      'REST API is basically like a waiter in a restaurant. The client sends a request like GET or POST to the server, and the server gives back JSON data. We use it because frontend and backend need to talk to each other without caring about what programming language each is written in.'
    );
  };

  const loadConflictSample = () => {
    setQuestion('Describe a time you had a disagreement with a team member. How did you resolve it?');
    setAnswer(
      'In our hackathon, my teammate wanted to use a NoSQL database while I thought PostgreSQL was better for our user authentication and order relations. We argued a bit because time was ticking. Eventually we decided to list the pros and cons and tested a quick schema together. We saw SQL was safer for transactions and agreed on it.'
    );
  };

  const handleImprove = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) {
      setError('Please provide both the interview question and your draft answer.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await CareerAPI.improveAnswer({
        question,
        answer,
        targetRole,
      });

      setResult(data);

      HistoryStorage.save({
        type: 'answer-improver',
        title: `Answer Coach: ${question.slice(0, 45)}...`,
        subtitle: `Score: ${data.overallScore}/100 (${data.verdict})`,
        data,
      });

      if (onSavedNotification) onSavedNotification();

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze answer.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, type: 'improved' | 'elevator') => {
    navigator.clipboard.writeText(text);
    if (type === 'improved') {
      setCopiedImproved(true);
      setTimeout(() => setCopiedImproved(false), 2000);
    } else {
      setCopiedElevator(true);
      setTimeout(() => setCopiedElevator(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-600 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>AI Answer Coach & Polisher</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
            Interview Answer Improver
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Refine raw drafts into polished, high-impact responses using the proven STAR framework.
          </p>
        </div>

        {/* Quick Sample Answers */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-400 font-semibold mr-1">Try draft:</span>
          <button
            type="button"
            onClick={loadBehavioralSample}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
          >
            Project Deadline
          </button>
          <button
            type="button"
            onClick={loadTechnicalSample}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
          >
            REST API Concept
          </button>
          <button
            type="button"
            onClick={loadConflictSample}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
          >
            Team Disagreement
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Form Column */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleImprove} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              Your Interview Answer Input
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Role / Context
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Junior Web Developer, Campus Hiring Drive"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Interview Question <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Paste or write the interview question here"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  Your Draft Answer <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">
                  Write freely — grammar mistakes are totally fine!
                </span>
              </div>
              <textarea
                rows={6}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type how you would normally speak or explain in the interview..."
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none leading-relaxed"
                required
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-purple-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Analyzing Grammar, Structure & Impact...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Elevate & Score My Answer
                </>
              )}
            </button>
          </form>

          {/* STAR Framework Guide Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 space-y-2 text-xs">
            <h4 className="font-bold text-purple-900 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-purple-600" />
              The College Student STAR Framework
            </h4>
            <p className="text-purple-800 leading-relaxed">
              When answering situational interview questions, top recruiters look for:
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1 font-medium text-slate-700">
              <div className="p-2 rounded-lg bg-white/80 border border-purple-200">
                <strong className="text-purple-700">S - Situation:</strong> Set the scene & context.
              </div>
              <div className="p-2 rounded-lg bg-white/80 border border-purple-200">
                <strong className="text-purple-700">T - Task:</strong> What was required or expected?
              </div>
              <div className="p-2 rounded-lg bg-white/80 border border-purple-200">
                <strong className="text-purple-700">A - Action:</strong> Specific steps YOU took.
              </div>
              <div className="p-2 rounded-lg bg-white/80 border border-purple-200">
                <strong className="text-purple-700">R - Result:</strong> Positive outcome & learning.
              </div>
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7 space-y-5">
          {result ? (
            <div className="space-y-5">
              {/* Scorecard Header */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex flex-col items-center justify-center font-black shadow-md shadow-purple-500/20">
                      <span className="text-lg leading-none">{result.overallScore}</span>
                      <span className="text-[10px] font-medium text-purple-200">/ 100</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">Overall Interview Readiness</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold border border-purple-200">
                          {result.verdict}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Evaluated across clarity, confidence, structural coherence, and recruiter impact.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4 Score Metric Bars */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-slate-600 font-semibold">Clarity</span>
                      <span className="font-bold text-slate-900">{result.scoreBreakdown.clarity}/10</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full transition-all"
                        style={{ width: `${result.scoreBreakdown.clarity * 10}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-slate-600 font-semibold">Confidence</span>
                      <span className="font-bold text-slate-900">{result.scoreBreakdown.confidence}/10</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5">
                      <div
                        className="bg-indigo-600 h-1.5 rounded-full transition-all"
                        style={{ width: `${result.scoreBreakdown.confidence * 10}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-slate-600 font-semibold">Structure</span>
                      <span className="font-bold text-slate-900">{result.scoreBreakdown.structure}/10</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5">
                      <div
                        className="bg-purple-600 h-1.5 rounded-full transition-all"
                        style={{ width: `${result.scoreBreakdown.structure * 10}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-slate-600 font-semibold">Impact</span>
                      <span className="font-bold text-slate-900">{result.scoreBreakdown.impact}/10</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5">
                      <div
                        className="bg-emerald-600 h-1.5 rounded-full transition-all"
                        style={{ width: `${result.scoreBreakdown.impact * 10}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Improved Answer Box */}
              <div className="bg-white rounded-2xl border border-purple-200 shadow-md p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Polished, Confident Answer</h4>
                      <p className="text-[11px] text-slate-500">Elevated wording with clear conversational delivery</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy(result.improvedAnswer, 'improved')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    {copiedImproved ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedImproved ? 'Copied Answer!' : 'Copy Answer'}
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 text-sm text-slate-800 leading-relaxed whitespace-pre-line font-medium">
                  {result.improvedAnswer}
                </div>

                {/* 60-Second Elevator Version */}
                {result.conciseVersion && (
                  <div className="pt-2 space-y-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        Quick 60-Second Delivery Version:
                      </span>
                      <button
                        onClick={() => handleCopy(result.conciseVersion || '', 'elevator')}
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedElevator ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        {copiedElevator ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <p className="text-xs text-slate-600 bg-amber-50/60 p-3 rounded-lg border border-amber-200/60 italic leading-relaxed">
                      "{result.conciseVersion}"
                    </p>
                  </div>
                )}
              </div>

              {/* STAR Breakdown Box if present */}
              {result.starBreakdown && (
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-indigo-600" />
                    How Your Story Fits The STAR Method:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {result.starBreakdown.situation && (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="font-bold text-purple-700 block mb-0.5">Situation</span>
                        <p className="text-slate-600">{result.starBreakdown.situation}</p>
                      </div>
                    )}
                    {result.starBreakdown.task && (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="font-bold text-purple-700 block mb-0.5">Task</span>
                        <p className="text-slate-600">{result.starBreakdown.task}</p>
                      </div>
                    )}
                    {result.starBreakdown.action && (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="font-bold text-indigo-700 block mb-0.5">Action</span>
                        <p className="text-slate-600">{result.starBreakdown.action}</p>
                      </div>
                    )}
                    {result.starBreakdown.result && (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="font-bold text-emerald-700 block mb-0.5">Result</span>
                        <p className="text-slate-600">{result.starBreakdown.result}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Constructive Feedback & Strengths */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Strengths */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
                  <h5 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <ThumbsUp className="w-4 h-4 text-emerald-600" /> What You Did Well
                  </h5>
                  <ul className="text-xs text-emerald-800 space-y-1.5 list-disc list-inside">
                    {result.strengths.map((str, sIdx) => (
                      <li key={sIdx} className="leading-relaxed">
                        {str}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Suggestions */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                  <h5 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" /> Actionable Improvements
                  </h5>
                  <ul className="text-xs text-amber-800 space-y-1.5 list-disc list-inside">
                    {result.suggestions.map((sug, suIdx) => (
                      <li key={suIdx} className="leading-relaxed">
                        {sug}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommended Power Verbs */}
              {result.powerVerbs && result.powerVerbs.length > 0 && (
                <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">Recommended Action Verbs:</span>
                  {result.powerVerbs.map((verb, vIdx) => (
                    <span
                      key={vIdx}
                      className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200"
                    >
                      {verb}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Blank state */
            <div className="h-full min-h-[460px] flex flex-col items-center justify-center p-8 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-white/50 text-slate-400 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="max-w-sm">
                <h4 className="text-base font-bold text-slate-700">Coach Your Interview Voice</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Enter an interview question and type how you'd naturally respond. AI Career Buddy analyzes your structure, grammar, and delivery tone.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
