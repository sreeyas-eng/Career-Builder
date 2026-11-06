import React, { useState, useEffect } from 'react';
import {
  Mail,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Bookmark,
  Send,
  Building,
  Briefcase,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';
import { CareerAPI, HistoryStorage } from '../../services/api';
import { CoverLetterResult } from '../../types/career';
import confetti from 'canvas-confetti';

interface CoverLetterGeneratorProps {
  onSavedNotification?: () => void;
  initialDetails?: {
    fullName?: string;
    role?: string;
    projects?: string;
  };
}

export const CoverLetterGenerator: React.FC<CoverLetterGeneratorProps> = ({
  onSavedNotification,
  initialDetails,
}) => {
  const [studentName, setStudentName] = useState(initialDetails?.fullName || 'Alex Rivera');
  const [jobRole, setJobRole] = useState(initialDetails?.role || 'Frontend Engineering Intern');
  const [companyName, setCompanyName] = useState('Stripe / Tech Startup');
  const [qualifications, setQualifications] = useState(
    'B.S. in Computer Science (Junior Year, 3.8 GPA), State University of California'
  );
  const [keyProjects, setKeyProjects] = useState(
    initialDetails?.projects ||
      'Full-Stack Campus Dining App (React, Node, PostgreSQL); AI Study Note Flashcard Generator (Python, Gemini API)'
  );
  const [whyCompany, setWhyCompany] = useState(
    'Admiration for developer-first APIs, clean documentation culture, and desire to contribute to high-reliability payment infrastructure'
  );
  const [tone, setTone] = useState('Confident & Enthusiastic');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CoverLetterResult | null>(null);
  const [copiedLetter, setCopiedLetter] = useState(false);
  const [copiedSubject, setCopiedSubject] = useState(false);

  useEffect(() => {
    if (initialDetails?.fullName) setStudentName(initialDetails.fullName);
    if (initialDetails?.role) setJobRole(initialDetails.role);
    if (initialDetails?.projects) setKeyProjects(initialDetails.projects);
  }, [initialDetails]);

  // Sample Loaders
  const loadFintechPreset = () => {
    setStudentName('Alex Rivera');
    setJobRole('Software Engineering Intern (Summer 2026)');
    setCompanyName('FinTech Payments Corp');
    setQualifications('Junior studying B.S. in Computer Science at State University');
    setKeyProjects(
      'Campus Dining Order Platform (React, Node, PostgreSQL, 250+ users); AI Note Summarizer with Gemini API'
    );
    setWhyCompany(
      'Inspired by your modern developer tools and mission to make micro-transactions seamless for global merchants'
    );
    setTone('Confident & Enthusiastic');
  };

  const loadDataPreset = () => {
    setStudentName('Sarah Chen');
    setJobRole('Data Analytics Intern');
    setCompanyName('HealthTech Solutions');
    setQualifications('Senior studying Business Analytics & Information Systems');
    setKeyProjects(
      'Student Bookstore Transaction Dashboard (Tableau, SQL); Customer Churn Prediction Model (Python, Scikit-learn)'
    );
    setWhyCompany(
      'Passionate about leveraging patient data trends to improve clinic operational efficiency and reduce patient wait times'
    );
    setTone('Professional & Analytical');
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !jobRole.trim() || !companyName.trim()) {
      setError('Please provide student name, target role, and company name.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await CareerAPI.generateCoverLetter({
        studentName,
        jobRole,
        companyName,
        qualifications,
        keyProjects,
        whyCompany,
        tone,
      });

      setResult(data);

      HistoryStorage.save({
        type: 'cover-letter',
        title: `Cover Letter: ${jobRole} at ${companyName}`,
        subtitle: `Draft for ${studentName}`,
        data,
      });

      if (onSavedNotification) onSavedNotification();

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate cover letter.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, type: 'letter' | 'subject') => {
    navigator.clipboard.writeText(text);
    if (type === 'letter') {
      setCopiedLetter(true);
      setTimeout(() => setCopiedLetter(false), 2000);
    } else {
      setCopiedSubject(true);
      setTimeout(() => setCopiedSubject(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-600 text-xs font-bold uppercase tracking-wider">
            <Mail className="w-4 h-4" />
            <span>Tailored Job Application Letters</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
            Cover Letter Generator
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Craft authentic, project-centered cover letters that stand out without sounding like robotic clichés.
          </p>
        </div>

        {/* Quick presets */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={loadFintechPreset}
            className="text-xs px-3 py-1.5 rounded-lg bg-cyan-50 text-cyan-700 hover:bg-cyan-100 font-semibold border border-cyan-200 transition-colors"
          >
            Sample Tech Internship
          </button>
          <button
            type="button"
            onClick={loadDataPreset}
            className="text-xs px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold border border-indigo-200 transition-colors"
          >
            Sample Analytics Role
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleGenerate} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-600" />
              Application Parameters
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Your Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500 outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Job Role / Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  placeholder="e.g. Frontend Intern"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Company Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Spotify, Notion"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Academic Background & College
              </label>
              <input
                type="text"
                value={qualifications}
                onChange={(e) => setQualifications(e.target.value)}
                placeholder="e.g. Junior in B.S. Computer Science, State Univ"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Relevant Projects / Coursework to Highlight
              </label>
              <textarea
                rows={2}
                value={keyProjects}
                onChange={(e) => setKeyProjects(e.target.value)}
                placeholder="List 1-2 major college projects or lab assignments that prove your ability"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Why do you want to work at this company?
              </label>
              <textarea
                rows={2}
                value={whyCompany}
                onChange={(e) => setWhyCompany(e.target.value)}
                placeholder="What about their product, engineering culture, or mission speaks to you?"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tone & Voice</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-500 outline-none bg-white"
              >
                <option value="Confident & Enthusiastic">Confident & Enthusiastic (Recommended for Internships)</option>
                <option value="Professional & Formal">Professional & Formal (Traditional Corporate / Finance)</option>
                <option value="Innovative & Startup-Ready">Innovative & Startup-Ready (Tech Startups)</option>
              </select>
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
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-cyan-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating Tailored Cover Letter...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  Generate Tailored Cover Letter
                </>
              )}
            </button>
          </form>

          {/* Letter Pro-Tip */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs space-y-1">
            <span className="font-bold text-slate-800 flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> College Applicant Secret:
            </span>
            <p>
              Recruiters read dozens of robotic templates every hour. When you talk about concrete hurdles you overcame during college projects, you immediately prove authentic passion.
            </p>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7 space-y-5">
          {result ? (
            <div className="space-y-5">
              {/* Subject Line Bar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-3">
                <div className="text-xs">
                  <span className="font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                    Recommended Email Subject Line:
                  </span>
                  <p className="font-mono font-semibold text-slate-800 text-xs sm:text-sm">
                    {result.subjectLine}
                  </p>
                </div>

                <button
                  onClick={() => handleCopy(result.subjectLine, 'subject')}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
                >
                  {copiedSubject ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedSubject ? 'Copied' : 'Copy Subject'}
                </button>
              </div>

              {/* Cover Letter Document Card */}
              <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-md space-y-6 text-slate-800 font-sans">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Application for {jobRole}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Targeting: <strong className="text-slate-800">{companyName}</strong>
                    </p>
                  </div>

                  <button
                    onClick={() => handleCopy(result.fullLetterText, 'letter')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 text-xs font-bold transition-colors cursor-pointer"
                  >
                    {copiedLetter ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedLetter ? 'Cover Letter Copied!' : 'Copy Cover Letter'}
                  </button>
                </div>

                {/* Letter Body Preview */}
                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-4 whitespace-pre-line font-normal">
                  {result.fullLetterText}
                </div>
              </div>

              {/* Recruiter Emailing Tips */}
              {result.recruiterTips && result.recruiterTips.length > 0 && (
                <div className="p-4 rounded-xl bg-cyan-50/70 border border-cyan-200/80 space-y-2">
                  <span className="text-xs font-bold text-cyan-900 flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5 text-cyan-700" /> Tips for Emailing this to Recruiters:
                  </span>
                  <ul className="text-xs text-cyan-800 space-y-1 list-disc list-inside">
                    {result.recruiterTips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            /* Blank state */
            <div className="h-full min-h-[460px] flex flex-col items-center justify-center p-8 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-white/50 text-slate-400 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <Mail className="w-8 h-8" />
              </div>
              <div className="max-w-sm">
                <h4 className="text-base font-bold text-slate-700">Write a Standout Cover Letter</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Enter your target role and company name on the left to generate an authentic cover letter highlighting your real college projects and enthusiasm.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
