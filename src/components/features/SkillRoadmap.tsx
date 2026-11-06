import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  BookOpen,
  FolderGit2,
  AlertTriangle,
  Lightbulb,
  CheckSquare,
  Square,
  ExternalLink,
  AlertCircle,
  Flag,
} from 'lucide-react';
import { CareerAPI, HistoryStorage } from '../../services/api';
import { SkillRoadmapResult, RoadmapStage } from '../../types/career';
import confetti from 'canvas-confetti';

interface SkillRoadmapProps {
  onSavedNotification?: () => void;
  initialSkillOrCareer?: string;
}

export const SkillRoadmap: React.FC<SkillRoadmapProps> = ({
  onSavedNotification,
  initialSkillOrCareer = 'Full Stack Web Development',
}) => {
  const [targetSkillOrCareer, setTargetSkillOrCareer] = useState(initialSkillOrCareer);
  const [currentLevel, setCurrentLevel] = useState('Beginner (Know basic syntax)');
  const [weeklyHours, setWeeklyHours] = useState('8-10 hours/week');
  const [timeHorizon, setTimeHorizon] = useState('3-4 Months');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SkillRoadmapResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [completedTopics, setCompletedTopics] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialSkillOrCareer) {
      setTargetSkillOrCareer(initialSkillOrCareer);
    }
  }, [initialSkillOrCareer]);

  const presetTracks = [
    { title: 'Full Stack Web Development', level: 'Beginner', duration: '3-4 Months', hours: '10 hrs/wk' },
    { title: 'Data Analytics & Visualization', level: 'Beginner', duration: '3 Months', hours: '8 hrs/wk' },
    { title: 'Cloud Engineering & DevOps', level: 'Intermediate', duration: '4-5 Months', hours: '10 hrs/wk' },
    { title: 'Machine Learning & AI Basics', level: 'Beginner', duration: '4 Months', hours: '10 hrs/wk' },
    { title: 'Product Design (UI/UX) with Figma', level: 'Beginner', duration: '2-3 Months', hours: '6 hrs/wk' },
  ];

  const handleSelectPreset = (p: typeof presetTracks[0]) => {
    setTargetSkillOrCareer(p.title);
    setCurrentLevel(p.level);
    setTimeHorizon(p.duration);
    setWeeklyHours(p.hours);
  };

  const toggleTopic = (topicKey: string) => {
    setCompletedTopics((prev) => {
      const next = { ...prev, [topicKey]: !prev[topicKey] };
      // Check if all topics in stage completed
      return next;
    });
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetSkillOrCareer.trim()) {
      setError('Please provide a skill or career path.');
      return;
    }

    setLoading(true);
    setError(null);
    setCompletedTopics({});

    try {
      const data = await CareerAPI.generateRoadmap({
        targetSkillOrCareer,
        currentLevel,
        weeklyHours,
        timeHorizon,
      });

      setResult(data);

      HistoryStorage.save({
        type: 'skill-roadmap',
        title: `Roadmap: ${targetSkillOrCareer}`,
        subtitle: `3-Stage Roadmap (${data.stages.length} stages, estimated ${data.totalDuration})`,
        data,
      });

      if (onSavedNotification) onSavedNotification();

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate roadmap.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyRoadmap = () => {
    if (!result) return;
    const text =
      `LEARNING ROADMAP: ${result.title.toUpperCase()}\n` +
      `Estimated Time: ${result.totalDuration}\n\n` +
      `Overview: ${result.overview}\n\n` +
      result.stages
        .map(
          (s) =>
            `=== ${s.stageName.toUpperCase()} STAGE (${s.duration}) ===\n` +
            `Goal: ${s.goal || ''}\n` +
            `Topics:\n${s.topics.map((t) => '  • ' + t).join('\n')}\n` +
            `Tools: ${s.toolsAndTech.join(', ')}\n` +
            `Milestone Project: ${s.milestoneProject.title} - ${s.milestoneProject.description}\n`
        )
        .join('\n\n') +
      `\n\nCAPSTONE PROJECT: ${result.capstoneProjectIdea.name}\n` +
      `${result.capstoneProjectIdea.description}\n` +
      `Resume Bullet: "${result.capstoneProjectIdea.resumeBullet}"`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-violet-600 text-xs font-bold uppercase tracking-wider">
            <MapPin className="w-4 h-4" />
            <span>Structured Learning Pathway</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
            Skill Learning Roadmap
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Break down complex technologies into achievable Beginner, Intermediate, and Advanced stages with verified projects.
          </p>
        </div>

        {result && (
          <button
            onClick={handleCopyRoadmap}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 font-bold text-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Roadmap Copied!' : 'Copy Full Roadmap'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick presets */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <span className="text-xs font-bold text-slate-700 block">Popular Student Tracks:</span>
            <div className="flex flex-wrap gap-1.5">
              {presetTracks.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(p)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold transition-all ${
                    targetSkillOrCareer === p.title
                      ? 'bg-violet-600 text-white border-violet-600 shadow-2xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  {p.title}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleGenerate} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-600" />
              Customize Your Roadmap
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Skill or Career <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={targetSkillOrCareer}
                onChange={(e) => setTargetSkillOrCareer(e.target.value)}
                placeholder="e.g. Full Stack Web Development, DevOps, Data Analyst"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-violet-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Current Starting Level</label>
              <select
                value={currentLevel}
                onChange={(e) => setCurrentLevel(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-violet-500 outline-none bg-white"
              >
                <option value="Complete Beginner (Never coded/touched before)">
                  Complete Beginner (Zero prior exposure)
                </option>
                <option value="Beginner (Know basic syntax & concepts)">
                  Beginner (Know basic concepts & syntax)
                </option>
                <option value="Intermediate (Have built small toy projects)">
                  Intermediate (Built small mini-projects)
                </option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Weekly Commitment</label>
                <select
                  value={weeklyHours}
                  onChange={(e) => setWeeklyHours(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-violet-500 outline-none bg-white"
                >
                  <option value="5-7 hours/week">5-7 hrs/wk (Casual)</option>
                  <option value="8-12 hours/week">8-12 hrs/wk (Standard)</option>
                  <option value="15+ hours/week">15+ hrs/wk (Intensive / Vacation)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Timeline</label>
                <select
                  value={timeHorizon}
                  onChange={(e) => setTimeHorizon(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-violet-500 outline-none bg-white"
                >
                  <option value="2-3 Months">2-3 Months</option>
                  <option value="3-4 Months">3-4 Months</option>
                  <option value="6 Months">6 Months (Semester-long)</option>
                </select>
              </div>
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
              className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm shadow-md shadow-violet-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating 3-Stage Roadmap...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate 3-Stage Roadmap
                </>
              )}
            </button>
          </form>

          {/* Quick Study Tip */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs space-y-1">
            <span className="font-bold text-slate-800 flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> College Pro-Tip:
            </span>
            <p>
              Tutorial hell is real! After completing every stage, pause and build the suggested milestone project on GitHub before proceeding to the next stage.
            </p>
          </div>
        </div>

        {/* Roadmap Display Column */}
        <div className="lg:col-span-8 space-y-6">
          {result ? (
            <div className="space-y-6">
              {/* Overview Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-50 via-purple-50 to-indigo-50 border border-violet-200/80 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-lg font-bold text-slate-900">{result.title}</h3>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-violet-100 text-violet-800 border border-violet-200">
                    Est. Duration: {result.totalDuration}
                  </span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed font-normal">
                  {result.overview}
                </p>
              </div>

              {/* Three Stages: Beginner, Intermediate, Advanced */}
              <div className="space-y-6">
                {result.stages.map((stage: RoadmapStage, sIdx: number) => {
                  const stageStyles = [
                    { border: 'border-blue-200', badge: 'bg-blue-100 text-blue-800', accent: 'text-blue-600' },
                    { border: 'border-indigo-200', badge: 'bg-indigo-100 text-indigo-800', accent: 'text-indigo-600' },
                    { border: 'border-purple-200', badge: 'bg-purple-100 text-purple-800', accent: 'text-purple-600' },
                  ][sIdx % 3];

                  return (
                    <div
                      key={sIdx}
                      className={`bg-white rounded-2xl border ${stageStyles.border} p-6 shadow-sm hover:shadow-md transition-all space-y-5`}
                    >
                      {/* Stage Header */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-xl bg-slate-900 text-white text-xs font-black flex items-center justify-center">
                            0{sIdx + 1}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-base font-bold text-slate-900">
                                {stage.stageName} Stage
                              </h4>
                              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${stageStyles.badge}`}>
                                {stage.duration}
                              </span>
                            </div>
                            {stage.tagline && (
                              <p className="text-xs text-slate-500 font-medium">{stage.tagline}</p>
                            )}
                          </div>
                        </div>

                        {stage.goal && (
                          <div className="text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 max-w-sm">
                            <strong className="text-slate-800">Milestone Goal: </strong>
                            {stage.goal}
                          </div>
                        )}
                      </div>

                      {/* Interactive Topics Checklist */}
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                          Core Modules to Master (Click to Check Off):
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {stage.topics.map((topic, tIdx) => {
                            const topicKey = `${stage.stageName}_${tIdx}`;
                            const isDone = completedTopics[topicKey];
                            return (
                              <button
                                key={tIdx}
                                type="button"
                                onClick={() => toggleTopic(topicKey)}
                                className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                                  isDone
                                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900 line-through'
                                    : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-700'
                                }`}
                              >
                                {isDone ? (
                                  <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                ) : (
                                  <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                )}
                                <span className="leading-snug">{topic}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Tools and Libraries */}
                      <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
                        <span className="font-bold text-slate-700">Tools & Technologies:</span>
                        {stage.toolsAndTech.map((tool, tlIdx) => (
                          <span
                            key={tlIdx}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium border border-slate-200 text-[11px]"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>

                      {/* Milestone Project for this Stage */}
                      <div className="p-4 rounded-xl bg-violet-50/70 border border-violet-200/80 space-y-1.5">
                        <div className="flex items-center gap-2 text-violet-900 text-xs font-bold">
                          <FolderGit2 className="w-4 h-4 text-violet-600" />
                          <span>Stage Milestone Project: {stage.milestoneProject.title}</span>
                        </div>
                        <p className="text-xs text-violet-800 leading-relaxed">
                          {stage.milestoneProject.description}
                        </p>
                        {stage.milestoneProject.skillsDemonstrated && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {stage.milestoneProject.skillsDemonstrated.map((sk, skIdx) => (
                              <span key={skIdx} className="text-[10px] font-semibold bg-white text-violet-700 px-2 py-0.5 rounded border border-violet-200">
                                {sk}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Free Curated Learning Resources */}
                      {stage.freeResources && stage.freeResources.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-indigo-600" /> Recommended Free Resources:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {stage.freeResources.map((res, rIdx) => (
                              <div
                                key={rIdx}
                                className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between gap-2"
                              >
                                <div>
                                  <span className="font-bold text-slate-900 block">{res.name}</span>
                                  <span className="text-[10px] text-slate-500">{res.type} • {res.urlOrPlatform}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Common Pitfalls */}
                      {stage.commonPitfalls && stage.commonPitfalls.length > 0 && (
                        <div className="flex items-start gap-2 text-xs text-amber-800 bg-amber-50/80 p-3 rounded-xl border border-amber-200/70">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <strong className="block text-amber-900 mb-0.5">Watch Out For:</strong>
                            <p>{stage.commonPitfalls.join(' • ')}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Capstone Project Card */}
              {result.capstoneProjectIdea && (
                <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white shadow-xl space-y-4">
                  <div className="flex items-center gap-2">
                    <Flag className="w-5 h-5 text-yellow-400" />
                    <h4 className="text-base font-bold">
                      Ultimate Portfolio Capstone: {result.capstoneProjectIdea.name}
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {result.capstoneProjectIdea.description}
                  </p>
                  <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 space-y-1">
                    <span className="text-xs font-bold text-yellow-300 block">
                      Resume Impact Bullet (Add this after building!):
                    </span>
                    <p className="text-xs text-slate-200 font-mono italic">
                      "{result.capstoneProjectIdea.resumeBullet}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Blank state */
            <div className="h-full min-h-[460px] flex flex-col items-center justify-center p-8 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-white/50 text-slate-400 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center">
                <MapPin className="w-8 h-8" />
              </div>
              <div className="max-w-sm">
                <h4 className="text-base font-bold text-slate-700">Map Out Your Learning</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Select a skill or career on the left to generate an actionable 3-stage roadmap from basic syntax to real-world deployment and resume capstones.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
