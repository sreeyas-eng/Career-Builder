import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Bookmark,
  RefreshCw,
  Target,
  Briefcase,
  Layers,
  GraduationCap,
  Calendar,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';
import { CareerAPI, HistoryStorage } from '../../services/api';
import { CareerGuidanceResult, CareerPathItem } from '../../types/career';

interface CareerGuidanceProps {
  onSavedNotification?: () => void;
  onNavigateToRoadmap?: (career: string) => void;
  onNavigateToQuestions?: (role: string) => void;
}

export const CareerGuidance: React.FC<CareerGuidanceProps> = ({
  onSavedNotification,
  onNavigateToRoadmap,
  onNavigateToQuestions,
}) => {
  const [degree, setDegree] = useState('Bachelor of Science / Engineering');
  const [major, setMajor] = useState('Computer Science & Information Technology');
  const [interests, setInterests] = useState(
    'Building modern web interfaces, visual design, user psychology, artificial intelligence, automation, solving practical campus problems'
  );
  const [currentSkills, setCurrentSkills] = useState(
    'HTML, CSS, JavaScript basics, Python fundamentals, Figma, Git, problem solving'
  );
  const [favoriteSubjects, setFavoriteSubjects] = useState(
    'Human-Computer Interaction, Web Technologies, Data Structures, Psychology'
  );
  const [workStyle, setWorkStyle] = useState('Collaborative, creative, product-oriented, mix of coding and design');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CareerGuidanceResult | null>(null);

  // Student Presets
  const loadCSPreset = () => {
    setDegree('B.S. in Computer Science');
    setMajor('Software Engineering');
    setInterests('Web development, interactive user interfaces, generative AI tools, frontend animation');
    setCurrentSkills('JavaScript, React basics, Python, Git, HTML/Tailwind');
    setFavoriteSubjects('Web Architecture, Object-Oriented Programming, UI Design');
    setWorkStyle('Creative tech, building user-facing products, agile teams');
  };

  const loadDataPreset = () => {
    setDegree('B.S. / B.Com in Analytics');
    setMajor('Data Science & Economics');
    setInterests('Finding trends in data, data visualization, business problem solving, sports statistics');
    setCurrentSkills('Excel, basic SQL, Python (Pandas), statistics');
    setFavoriteSubjects('Statistics, Applied Mathematics, Economics, Database Systems');
    setWorkStyle('Analytical, insight-driven, working with decision makers');
  };

  const loadNonTechPivotPreset = () => {
    setDegree('B.A. / B.Sc in Electronics / Mechanical');
    setMajor('Engineering with interest in tech');
    setInterests('Smart hardware, IoT, tech product management, software logic, system workflows');
    setCurrentSkills('C basics, Python, project planning, critical thinking');
    setFavoriteSubjects('Digital Logic, Systems Engineering, Project Management');
    setWorkStyle('Cross-functional, bridge between hardware and software');
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interests.trim() && !favoriteSubjects.trim() && !currentSkills.trim()) {
      setError('Please share your interests, skills, or favourite subjects.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await CareerAPI.getCareerGuidance({
        degree,
        major,
        interests,
        currentSkills,
        favoriteSubjects,
        workStyle,
      });

      setResult(data);

      HistoryStorage.save({
        type: 'career-guidance',
        title: `Career Guidance: ${major || degree}`,
        subtitle: `${data.careerPaths.length} career recommendations (${data.careerPaths.map((c) => c.title).join(', ')})`,
        data,
      });

      if (onSavedNotification) onSavedNotification();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze career paths.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-600 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            <span>AI Career Guidance & Discovery</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
            Personalized Career Paths for Students
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Connect your favourite college subjects and emerging interests with in-demand real-world professions.
          </p>
        </div>

        {/* Quick presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-400 font-semibold mr-1">Sample student:</span>
          <button
            type="button"
            onClick={loadCSPreset}
            className="text-xs px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 font-semibold border border-sky-200 transition-colors"
          >
            Frontend / UX
          </button>
          <button
            type="button"
            onClick={loadDataPreset}
            className="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold border border-indigo-200 transition-colors"
          >
            Data & Analytics
          </button>
          <button
            type="button"
            onClick={loadNonTechPivotPreset}
            className="text-xs px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 font-semibold border border-purple-200 transition-colors"
          >
            Tech Product Pivot
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleGenerate} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-600" />
              Your Passions, Coursework & Skills
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Degree</label>
                <input
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  placeholder="e.g. B.Tech, B.S., B.B.A."
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Major / Branch</label>
                <input
                  type="text"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  placeholder="e.g. Computer Science, Finance"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Core Interests & Passions <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="What excites you? (e.g. building apps, visual design, game development, fintech, solving riddles)"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Favourite College Subjects / Modules
              </label>
              <input
                type="text"
                value={favoriteSubjects}
                onChange={(e) => setFavoriteSubjects(e.target.value)}
                placeholder="e.g. Database Systems, Psychology, Calculus, Web Tech"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Current Skills & Tools (Beginner or familiar)
              </label>
              <textarea
                rows={2}
                value={currentSkills}
                onChange={(e) => setCurrentSkills(e.target.value)}
                placeholder="e.g. Python basics, Excel, Figma, Canva, C++, Git"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Preferred Work Style / Environment
              </label>
              <input
                type="text"
                value={workStyle}
                onChange={(e) => setWorkStyle(e.target.value)}
                placeholder="e.g. Remote tech startup, structured enterprise, product design"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 outline-none"
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
              className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-sky-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Analyzing Suitable Career Paths...
                </>
              ) : (
                <>
                  <Compass className="w-4 h-4" />
                  Discover My Career Paths
                </>
              )}
            </button>
          </form>

          {/* Realistic Advice Note */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs space-y-1">
            <span className="font-bold text-slate-800 flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Realistic Career Recommendation:
            </span>
            <p>
              AI Career Buddy recommends trajectories matching your genuine interests. Career growth is progressive — starting with internships or junior roles lays a solid foundation.
            </p>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7 space-y-6">
          {result ? (
            <div className="space-y-6">
              {/* Profile Summary Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 border border-sky-200/80 space-y-2">
                <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                  Your Profile Assessment
                </span>
                <p className="text-sm text-slate-800 leading-relaxed font-medium">
                  {result.studentProfileSummary}
                </p>
              </div>

              {/* Recommended Career Paths */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">
                    Recommended Career Matches ({result.careerPaths.length})
                  </h3>
                  <span className="text-xs text-slate-500">Sorted by alignment</span>
                </div>

                {result.careerPaths.map((career: CareerPathItem, idx: number) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md transition-all space-y-4"
                  >
                    {/* Header: Title & Match % */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-bold text-slate-900">{career.title}</h4>
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {career.matchPercentage}% Match
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-1.5 text-xs text-slate-500">
                          <span className="font-semibold text-slate-700">Target Entry Titles:</span>
                          {career.entryLevelTitles.map((t, tIdx) => (
                            <span key={tIdx} className="bg-slate-100 px-2 py-0.5 rounded-md text-slate-700">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Why this career fits */}
                    <div className="text-xs text-slate-700 leading-relaxed p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <strong className="text-indigo-900 block mb-0.5">Why it fits your profile:</strong>
                      {career.whyFit}
                    </div>

                    {/* Skills Breakdown */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 space-y-1">
                        <span className="font-bold text-blue-900">Must-Have Skills:</span>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {career.requiredSkills.mustHave.map((sk, sIdx) => (
                            <span key={sIdx} className="px-2 py-0.5 bg-white text-blue-700 rounded-md border border-blue-200 font-semibold text-[11px]">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100 space-y-1">
                        <span className="font-bold text-purple-900">Tools & Frameworks:</span>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {career.requiredSkills.tools.map((tl, tIdx) => (
                            <span key={tIdx} className="px-2 py-0.5 bg-white text-purple-700 rounded-md border border-purple-200 font-semibold text-[11px]">
                              {tl}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Recommended Projects to Build in College */}
                    {career.recommendedProjects && career.recommendedProjects.length > 0 && (
                      <div className="space-y-2 pt-1 text-xs">
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-indigo-600" />
                          Recommended College Dorm / Portfolio Projects:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {career.recommendedProjects.map((p, pIdx) => (
                            <div key={pIdx} className="p-2.5 rounded-xl border border-slate-200 bg-white space-y-0.5">
                              <span className="font-bold text-slate-900 block">{p.name}</span>
                              <p className="text-slate-600 text-[11px]">{p.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Day in the Life & Industry Outlook */}
                    {career.industryOutlook && (
                      <div className="text-[11px] text-slate-500 pt-1 flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span><strong>Market Outlook: </strong>{career.industryOutlook}</span>
                      </div>
                    )}

                    {/* Action buttons to trigger Roadmap or Questions */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2">
                      {onNavigateToRoadmap && (
                        <button
                          onClick={() => onNavigateToRoadmap(career.title)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-colors cursor-pointer"
                        >
                          <span>Get Learning Roadmap</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {onNavigateToQuestions && (
                        <button
                          onClick={() => onNavigateToQuestions(career.entryLevelTitles[0] || career.title)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs transition-colors cursor-pointer"
                        >
                          <span>Practice Interview Qs</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Semester Action Plan */}
              {result.collegeActionPlan && result.collegeActionPlan.length > 0 && (
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    Immediate 4-Step Semester Action Plan:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {result.collegeActionPlan.map((action, aIdx) => (
                      <div key={aIdx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[11px] flex items-center justify-center shrink-0">
                          {aIdx + 1}
                        </span>
                        <span className="text-slate-700">{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Blank state */
            <div className="h-full min-h-[460px] flex flex-col items-center justify-center p-8 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-white/50 text-slate-400 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Compass className="w-8 h-8" />
              </div>
              <div className="max-w-sm">
                <h4 className="text-base font-bold text-slate-700">Find Your Career Direction</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Share your favourite subjects, current skills, and hobbies to receive 3 tailored career recommendations complete with dorm project blueprints and required tools.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
