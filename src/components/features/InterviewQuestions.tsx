import React, { useState } from 'react';
import {
  HelpCircle,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Lightbulb,
  Tag,
  AlertCircle,
} from 'lucide-react';
import { CareerAPI, HistoryStorage } from '../../services/api';
import { InterviewQuestionsResult, InterviewQuestionItem } from '../../types/career';

interface InterviewQuestionsProps {
  onSavedNotification?: () => void;
  onPracticeQuestion?: (question: string, role: string) => void;
  initialRole?: string;
}

export const InterviewQuestions: React.FC<InterviewQuestionsProps> = ({
  onSavedNotification,
  onPracticeQuestion,
  initialRole = 'Junior Frontend Developer',
}) => {
  const [role, setRole] = useState(initialRole);
  const [domain, setDomain] = useState('Web & Software Engineering');
  const [level, setLevel] = useState('Entry-level / College Graduate');
  const [questionType, setQuestionType] = useState('balanced');
  const [focusTopics, setFocusTopics] = useState('React, JavaScript, DOM, CSS, Teamwork, Handling Feedback');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<InterviewQuestionsResult | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const popularRoles = [
    { role: 'Junior Frontend Developer', domain: 'Web Engineering', topics: 'React, TypeScript, CSS, State, Problem Solving' },
    { role: 'Data Analyst Intern', domain: 'Data & Analytics', topics: 'SQL, Python, Excel, Tableau, Data Cleaning' },
    { role: 'Junior Backend Engineer', domain: 'Software Engineering', topics: 'APIs, Databases, Node.js/Python, Auth, Systems' },
    { role: 'Cloud / DevOps Associate', domain: 'Cloud Infrastructure', topics: 'Linux, Docker, AWS/GCP Basics, CI/CD, Networking' },
    { role: 'Business Analyst / PM Intern', domain: 'Product & Strategy', topics: 'User Stories, Prioritization, Stakeholders, Metrics' },
  ];

  const handleSelectPreset = (p: typeof popularRoles[0]) => {
    setRole(p.role);
    setDomain(p.domain);
    setFocusTopics(p.topics);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role.trim()) {
      setError('Please provide a target job role.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await CareerAPI.generateInterviewQuestions({
        role,
        domain,
        level,
        questionType,
        focusTopics,
      });

      setResult(data);

      HistoryStorage.save({
        type: 'interview-questions',
        title: `Interview Qs: ${role}`,
        subtitle: `10 practice questions (${data.questions.filter((q) => q.type.toLowerCase().includes('tech')).length} Tech, ${data.questions.filter((q) => q.type.toLowerCase().includes('hr')).length} HR)`,
        data,
      });

      if (onSavedNotification) onSavedNotification();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate questions.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopySingle = (q: InterviewQuestionItem) => {
    const text = `Q: ${q.question}\nType: ${q.type} (${q.difficulty})\nTopic: ${q.topic}\nWhy Interviewers Ask: ${q.whyAsked}\nKey Points to Cover:\n${q.keyPoints.map((k) => '- ' + k).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopiedId(q.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = () => {
    if (!result) return;
    const fullText = `10 INTERVIEW PRACTICE QUESTIONS FOR ${result.role.toUpperCase()}\n\n` +
      result.questions
        .map(
          (q, i) =>
            `${i + 1}. [${q.type} | ${q.difficulty}] ${q.question}\nTopic: ${q.topic}\nWhy Ask: ${q.whyAsked}\nKey Points to Cover:\n${q.keyPoints.map((k) => '  • ' + k).join('\n')}\n`
        )
        .join('\n');
    navigator.clipboard.writeText(fullText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>Interview Question Generator</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
            10 Tailored Interview Practice Questions
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Prepare for upcoming campus drives and internship screenings with realistic technical & behavioral prompts.
          </p>
        </div>

        {result && (
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            {copiedAll ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            {copiedAll ? 'All 10 Questions Copied!' : 'Copy All 10 Questions'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick presets */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <span className="text-xs font-bold text-slate-700 block">Quick Role Presets:</span>
            <div className="flex flex-wrap gap-1.5">
              {popularRoles.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(p)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold transition-all ${
                    role === p.role
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  {p.role}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleGenerate} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Configure Interview Criteria
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Role / Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Junior Frontend Developer"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Domain or Industry</label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="e.g. Web Dev, Fintech, Healthcare, Cloud"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Experience Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              >
                <option value="Internship / Co-op">Internship / Co-op</option>
                <option value="Entry-level / College Graduate">Entry-level / College Graduate (0-1 yrs)</option>
                <option value="Associate / 1-2 Years Experience">Associate (1-2 Years Experience)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Question Mix</label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              >
                <option value="balanced">Balanced (5 Technical + 5 HR/Behavioral)</option>
                <option value="technical-heavy">Technical Heavy (7 Technical + 3 HR)</option>
                <option value="behavioral-heavy">Behavioral & HR Heavy (7 HR + 3 Technical)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Specific Focus Topics / Technologies
              </label>
              <input
                type="text"
                value={focusTopics}
                onChange={(e) => setFocusTopics(e.target.value)}
                placeholder="e.g. React, SQL, Project Deadlines, Conflict"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
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
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating 10 Practice Questions...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate 10 Practice Questions
                </>
              )}
            </button>
          </form>

          {/* Friendly Practice Disclaimer */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs space-y-1">
            <span className="font-bold text-slate-800 block">Interview Practice Disclaimer:</span>
            <p>
              These questions are generated for mock study and skills refinement. Actual company interviews vary based on interviewer style and hiring rounds.
            </p>
          </div>
        </div>

        {/* Questions Display Column */}
        <div className="lg:col-span-8 space-y-4">
          {result ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Generated for: <strong className="text-slate-800">{result.role}</strong>
                </span>
                <span className="text-xs text-indigo-600 font-semibold">
                  10 of 10 Practice Questions Ready
                </span>
              </div>

              <div className="space-y-3">
                {result.questions.map((q, idx) => {
                  const isTech = q.type.toLowerCase().includes('tech');
                  return (
                    <div
                      key={q.id || idx}
                      className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-indigo-200 hover:shadow-md transition-all space-y-3"
                    >
                      {/* Top Bar: Number, Type badge, Difficulty */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                              isTech
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-purple-50 text-purple-700 border-purple-200'
                            }`}
                          >
                            {q.type}
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium px-2 py-0.5 rounded-full bg-slate-100">
                            {q.difficulty}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Tag className="w-3 h-3 text-slate-400" />
                          <span>{q.topic}</span>
                        </div>
                      </div>

                      {/* Question Text */}
                      <h4 className="text-base font-bold text-slate-900 leading-snug">
                        "{q.question}"
                      </h4>

                      {/* Why Asked & Key Points */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                          <span className="font-bold text-slate-700 flex items-center gap-1">
                            <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Why Interviewers Ask:
                          </span>
                          <p className="text-slate-600 leading-relaxed">{q.whyAsked}</p>
                        </div>

                        <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100/60 space-y-1">
                          <span className="font-bold text-indigo-900 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" /> Key Points to Cover:
                          </span>
                          <ul className="text-slate-700 space-y-0.5 list-disc list-inside">
                            {q.keyPoints.map((kp, kIdx) => (
                              <li key={kIdx} className="leading-tight">
                                {kp}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Action buttons on card */}
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
                        <button
                          onClick={() => handleCopySingle(q)}
                          className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 font-semibold cursor-pointer py-1"
                        >
                          {copiedId === q.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600">Copied Question!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Question</span>
                            </>
                          )}
                        </button>

                        {onPracticeQuestion && (
                          <button
                            onClick={() => onPracticeQuestion(q.question, result.role)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs transition-colors cursor-pointer"
                          >
                            <span>Draft Answer in Answer Improver</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Empty state */
            <div className="h-full min-h-[460px] flex flex-col items-center justify-center p-8 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-white/50 text-slate-400 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
                <HelpCircle className="w-8 h-8" />
              </div>
              <div className="max-w-sm">
                <h4 className="text-base font-bold text-slate-700">Ready to Practice?</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Pick a target role or enter your dream job title on the left, then click "Generate 10 Practice Questions" to get realistic technical & HR interview questions.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
