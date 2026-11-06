import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Check,
  Printer,
  Sparkles,
  Bookmark,
  RefreshCw,
  Plus,
  Trash2,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';
import { CareerAPI, HistoryStorage } from '../../services/api';
import { ResumeData, ResumeEducation, ResumeProject, ResumeExperience } from '../../types/career';
import confetti from 'canvas-confetti';

interface ResumeBuilderProps {
  onSavedNotification?: () => void;
  onNavigateToCoverLetter?: (details: { fullName: string; role: string; projects: string }) => void;
}

export const ResumeBuilder: React.FC<ResumeBuilderProps> = ({
  onSavedNotification,
  onNavigateToCoverLetter,
}) => {
  // Personal Info
  const [fullName, setFullName] = useState('Alex Rivera');
  const [email, setEmail] = useState('alex.rivera@university.edu');
  const [phone, setPhone] = useState('+1 (555) 349-8201');
  const [location, setLocation] = useState('San Francisco, CA');
  const [linkedin, setLinkedin] = useState('linkedin.com/in/alex-rivera-cs');
  const [portfolio, setPortfolio] = useState('github.com/alexrivera');
  const [targetRole, setTargetRole] = useState('Junior Full Stack Developer');

  // Education
  const [education, setEducation] = useState<ResumeEducation[]>([
    {
      institution: 'State University of California',
      degree: 'B.S. in Computer Science',
      year: 'Graduating May 2026',
      gpaOrScore: '3.8 / 4.0 GPA',
      highlights: ['Dean’s Honor List', 'Relevant Coursework: Data Structures, Web Engineering, Database Systems'],
    },
  ]);

  // Skills
  const [technicalSkills, setTechnicalSkills] = useState('JavaScript, TypeScript, React, Node.js, Express, Python, SQL, Git');
  const [softSkills, setSoftSkills] = useState('Team Collaboration, Problem Solving, Agile Communication, Technical Writing');
  const [tools, setTools] = useState('VS Code, PostgreSQL, MongoDB, Docker, Postman, Vite');

  // Projects
  const [projects, setProjects] = useState<ResumeProject[]>([
    {
      title: 'Campus Food Delivery & Dining Tracker',
      techStack: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
      link: 'github.com/alexrivera/campus-eats',
      bulletPoints: [
        'Built full-stack ordering platform used by 250+ university students during campus testing.',
        'Integrated real-time order status updates and secured REST API endpoints with JWT auth.',
        'Optimized database queries, reducing menu load latency by 35%.',
      ],
    },
    {
      title: 'AI Note Summarizer for Study Groups',
      techStack: ['Python', 'FastAPI', 'Gemini API', 'React'],
      link: 'github.com/alexrivera/smart-notes',
      bulletPoints: [
        'Developed an automated study assistant that generates flashcards and chapter summaries from lecture notes.',
        'Implemented responsive interface with audio transcription support for campus study groups.',
      ],
    },
  ]);

  // Experience / Internships
  const [experience, setExperience] = useState<ResumeExperience[]>([
    {
      role: 'Peer Computer Science Tutor & Lab Assistant',
      organization: 'University Academic Resource Center',
      duration: 'Sept 2024 – Present',
      bulletPoints: [
        'Mentored 60+ first and second-year students in Python, Data Structures, and debugging techniques.',
        'Conducted weekly review workshops on object-oriented programming fundamentals.',
      ],
    },
  ]);

  // Achievements
  const [achievements, setAchievements] = useState('1st Place - University Hackathon 2025 (Fintech track); AWS Certified Cloud Practitioner; Google Developer Student Club Core Member');

  // State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResumeData | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeView, setActiveView] = useState<'formatted' | 'raw'>('formatted');

  // Presets
  const loadCSPreset = () => {
    setFullName('Alex Rivera');
    setEmail('alex.rivera@university.edu');
    setPhone('+1 (555) 349-8201');
    setLocation('San Francisco, CA');
    setLinkedin('linkedin.com/in/alex-rivera-cs');
    setPortfolio('github.com/alexrivera');
    setTargetRole('Junior Full Stack Developer / Software Engineering Intern');
    setEducation([
      {
        institution: 'State University of California',
        degree: 'B.S. in Computer Science',
        year: 'Graduating May 2026',
        gpaOrScore: '3.8 / 4.0 GPA',
        highlights: ['Dean’s Honor List', 'Data Structures & Algorithms, Distributed Systems, Web Architecture'],
      },
    ]);
    setTechnicalSkills('JavaScript, TypeScript, React, Node.js, Express, Python, SQL, HTML/CSS, Git');
    setSoftSkills('Collaborative Problem Solving, Code Review Etiquette, Agile Teamwork');
    setTools('VS Code, PostgreSQL, MongoDB, Docker, Postman, Vite, Git');
    setProjects([
      {
        title: 'Campus Food Delivery & Dining Tracker',
        techStack: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
        link: 'github.com/alexrivera/campus-eats',
        bulletPoints: [
          'Built full-stack ordering platform used by 250+ university students during campus testing.',
          'Integrated real-time order status updates and secured REST API endpoints with JWT auth.',
          'Optimized database queries, reducing menu load latency by 35%.',
        ],
      },
      {
        title: 'AI Note Summarizer for Study Groups',
        techStack: ['Python', 'FastAPI', 'Gemini API', 'React'],
        link: 'github.com/alexrivera/smart-notes',
        bulletPoints: [
          'Developed an automated study assistant that generates flashcards and chapter summaries from lecture notes.',
          'Implemented responsive interface with audio transcription support for campus study groups.',
        ],
      },
    ]);
    setExperience([
      {
        role: 'Peer Computer Science Tutor & Lab Assistant',
        organization: 'University Academic Resource Center',
        duration: 'Sept 2024 – Present',
        bulletPoints: [
          'Mentored 60+ undergraduate students in Python, Data Structures, and debugging techniques.',
          'Conducted weekly review workshops on object-oriented programming fundamentals.',
        ],
      },
    ]);
    setAchievements('1st Place - University Hackathon 2025; AWS Certified Cloud Practitioner; Google Developer Student Club Core Member');
  };

  const loadBusinessPreset = () => {
    setFullName('Sarah Chen');
    setEmail('sarah.chen@university.edu');
    setPhone('+1 (555) 782-9014');
    setLocation('Chicago, IL');
    setLinkedin('linkedin.com/in/sarah-chen-analytics');
    setPortfolio('sarahchen-portfolio.com');
    setTargetRole('Junior Business Analyst / Data Analyst Intern');
    setEducation([
      {
        institution: 'Midwest Business School',
        degree: 'B.B.A. in Information Systems & Business Analytics',
        year: 'Graduating Dec 2025',
        gpaOrScore: '3.75 / 4.0 GPA',
        highlights: ['Beta Gamma Sigma Honor Society', 'Predictive Analytics, Financial Modeling, Database Management'],
      },
    ]);
    setTechnicalSkills('SQL, Excel (VLOOKUP, Pivot, PowerQuery), Tableau, Power BI, Python (Pandas), Google Sheets');
    setSoftSkills('Executive Presentation, Cross-Functional Stakeholder Management, Requirement Gathering');
    setTools('Tableau, Power BI, Jira, Confluence, Miro, Excel, Git');
    setProjects([
      {
        title: 'Campus Bookstore Inventory & Revenue Analysis Dashboard',
        techStack: ['Tableau', 'SQL', 'Excel'],
        bulletPoints: [
          'Analyzed 3 years of student purchase transaction data (50k+ records) to pinpoint textbook seasonal trends.',
          'Built interactive Tableau dashboards highlighting inventory turnover bottlenecks, identifying $18K in potential savings.',
        ],
      },
      {
        title: 'Customer Churn Predictor for Local Gym Partner',
        techStack: ['Python', 'Pandas', 'Scikit-Learn', 'Power BI'],
        bulletPoints: [
          'Created predictive classification model identifying members at risk of cancellation with 82% accuracy.',
          'Presented actionable retention strategy directly to small business leadership.',
        ],
      },
    ]);
    setExperience([
      {
        role: 'VP of Finance & Operations',
        organization: 'University Student Government Association',
        duration: 'Aug 2024 – Present',
        bulletPoints: [
          'Managed allocation of $120,000 annual student activity budget across 45 campus clubs.',
          'Implemented digital reimbursement tracking spreadsheet, reducing reimbursement approval time from 14 days to 4 days.',
        ],
      },
    ]);
    setAchievements('Finalist - National Student Analytics Challenge 2025; Microsoft Certified: Power BI Data Analyst Associate');
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !targetRole.trim()) {
      setError('Please provide your name and target job role.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        personalInfo: {
          fullName,
          email,
          phone,
          location,
          linkedin,
          portfolio,
        },
        targetRole,
        education,
        skills: {
          technical: technicalSkills.split(',').map((s) => s.trim()).filter(Boolean),
          soft: softSkills.split(',').map((s) => s.trim()).filter(Boolean),
          tools: tools.split(',').map((s) => s.trim()).filter(Boolean),
        },
        projects,
        experience,
        achievements: achievements.split(';').map((s) => s.trim()).filter(Boolean),
      };

      const resumeData = await CareerAPI.generateResume(payload);
      setResult(resumeData);

      // Save to local history
      HistoryStorage.save({
        type: 'resume-builder',
        title: `${fullName} – ${targetRole}`,
        subtitle: `Resume draft with ${resumeData.projects?.length || 0} projects`,
        data: resumeData,
      });

      if (onSavedNotification) onSavedNotification();

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate resume.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Header & Quick Action bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            <span>ATS Resume Generator for Students</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
            AI Resume Builder
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Craft a clean, structured, recruiter-ready resume grounded strictly in your coursework and projects.
          </p>
        </div>

        {/* Preset Loaders */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={loadCSPreset}
            className="text-xs px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold border border-blue-200 transition-colors"
          >
            Load Sample CS Profile
          </button>
          <button
            type="button"
            onClick={loadBusinessPreset}
            className="text-xs px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 font-semibold border border-purple-200 transition-colors"
          >
            Load Sample Business/Data Profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleGenerate} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Your Student Profile Details
            </h3>

            {/* Target Role & Personal Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Job / Internship Role <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Junior Web Developer, Data Science Intern"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City, State</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Austin, TX"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">LinkedIn Profile</label>
                  <input
                    type="text"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="linkedin.com/in/yourname"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">GitHub / Portfolio</label>
                  <input
                    type="text"
                    value={portfolio}
                    onChange={(e) => setPortfolio(e.target.value)}
                    placeholder="github.com/yourhandle"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Education Section */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Education</label>
                <button
                  type="button"
                  onClick={() =>
                    setEducation([
                      ...education,
                      {
                        institution: '',
                        degree: '',
                        year: '',
                        gpaOrScore: '',
                      },
                    ])
                  }
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Degree
                </button>
              </div>

              {education.map((edu, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 relative">
                  {education.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setEducation(education.filter((_, i) => i !== idx))}
                      className="absolute top-2 right-2 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => {
                      const updated = [...education];
                      updated[idx].institution = e.target.value;
                      setEducation(updated);
                    }}
                    placeholder="College / University Name"
                    className="w-full px-2.5 py-1.5 text-xs rounded-md border border-slate-300 bg-white"
                    required
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => {
                        const updated = [...education];
                        updated[idx].degree = e.target.value;
                        setEducation(updated);
                      }}
                      placeholder="Degree & Major (e.g. B.S. CS)"
                      className="px-2.5 py-1.5 text-xs rounded-md border border-slate-300 bg-white"
                      required
                    />
                    <input
                      type="text"
                      value={edu.year}
                      onChange={(e) => {
                        const updated = [...education];
                        updated[idx].year = e.target.value;
                        setEducation(updated);
                      }}
                      placeholder="Graduation Year (e.g. 2026)"
                      className="px-2.5 py-1.5 text-xs rounded-md border border-slate-300 bg-white"
                      required
                    />
                  </div>
                  <input
                    type="text"
                    value={edu.gpaOrScore || ''}
                    onChange={(e) => {
                      const updated = [...education];
                      updated[idx].gpaOrScore = e.target.value;
                      setEducation(updated);
                    }}
                    placeholder="GPA or Honors (optional, e.g. 3.8 / 4.0)"
                    className="w-full px-2.5 py-1.5 text-xs rounded-md border border-slate-300 bg-white"
                  />
                </div>
              ))}
            </div>

            {/* Skills */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700">Skills</label>
              <div>
                <span className="text-[11px] text-slate-500">Technical Skills (comma-separated)</span>
                <textarea
                  rows={2}
                  value={technicalSkills}
                  onChange={(e) => setTechnicalSkills(e.target.value)}
                  placeholder="Python, Java, React, SQL, Git..."
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <span className="text-[11px] text-slate-500">Soft Skills & Competencies</span>
                <input
                  type="text"
                  value={softSkills}
                  onChange={(e) => setSoftSkills(e.target.value)}
                  placeholder="Teamwork, Agile, Public Speaking..."
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <span className="text-[11px] text-slate-500">Tools & Frameworks</span>
                <input
                  type="text"
                  value={tools}
                  onChange={(e) => setTools(e.target.value)}
                  placeholder="Git, Docker, Figma, Postman..."
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            {/* Projects */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-slate-700">Key Projects</label>
                  <p className="text-[11px] text-slate-500">Coursework or side projects</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setProjects([
                      ...projects,
                      {
                        title: '',
                        techStack: [],
                        bulletPoints: [''],
                      },
                    ])
                  }
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Project
                </button>
              </div>

              {projects.map((proj, pIdx) => (
                <div key={pIdx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 relative">
                  {projects.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setProjects(projects.filter((_, i) => i !== pIdx))}
                      className="absolute top-2 right-2 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <input
                    type="text"
                    value={proj.title}
                    onChange={(e) => {
                      const updated = [...projects];
                      updated[pIdx].title = e.target.value;
                      setProjects(updated);
                    }}
                    placeholder="Project Title (e.g. E-Commerce App)"
                    className="w-full px-2.5 py-1.5 text-xs rounded-md border border-slate-300 bg-white"
                    required
                  />
                  <input
                    type="text"
                    value={proj.techStack.join(', ')}
                    onChange={(e) => {
                      const updated = [...projects];
                      updated[pIdx].techStack = e.target.value.split(',').map((s) => s.trim());
                      setProjects(updated);
                    }}
                    placeholder="Tech Stack (e.g. React, Node, MongoDB)"
                    className="w-full px-2.5 py-1.5 text-xs rounded-md border border-slate-300 bg-white"
                  />
                  <textarea
                    rows={2}
                    value={proj.bulletPoints.join('\n')}
                    onChange={(e) => {
                      const updated = [...projects];
                      updated[pIdx].bulletPoints = e.target.value.split('\n');
                      setProjects(updated);
                    }}
                    placeholder="Description or bullet points (one per line)..."
                    className="w-full px-2.5 py-1.5 text-xs rounded-md border border-slate-300 bg-white"
                  />
                </div>
              ))}
            </div>

            {/* Achievements & Certifications */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700">
                Achievements, Hackathons & Certifications
              </label>
              <textarea
                rows={2}
                value={achievements}
                onChange={(e) => setAchievements(e.target.value)}
                placeholder="List hackathon wins, campus clubs, AWS/Google certificates (separated by semicolons)"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
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
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-sm shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating ATS Resume Draft...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate ATS Resume Draft
                </>
              )}
            </button>
          </form>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-7 space-y-4">
          {result ? (
            <div className="space-y-4">
              {/* Output Actions Toolbar */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
                  <button
                    onClick={() => setActiveView('formatted')}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                      activeView === 'formatted'
                        ? 'bg-white text-indigo-700 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Document Preview
                  </button>
                  <button
                    onClick={() => setActiveView('raw')}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                      activeView === 'raw'
                        ? 'bg-white text-indigo-700 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Markdown / Plain Text
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(result.fullTextResume)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied Resume!' : 'Copy to Clipboard'}
                  </button>

                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                    title="Print or Save as PDF"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print / PDF
                  </button>
                </div>
              </div>

              {/* ATS Recommendations Card */}
              {result.atsTips && result.atsTips.length > 0 && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80">
                  <div className="flex items-center gap-2 text-blue-900 font-bold text-xs mb-2">
                    <Lightbulb className="w-4 h-4 text-blue-600" />
                    ATS Optimization Recommendations for this Role
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-blue-800">
                    {result.atsTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-blue-500 font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Document Display */}
              {activeView === 'formatted' ? (
                <div
                  id="resume-printable"
                  className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-md space-y-6 text-slate-800 font-sans"
                >
                  {/* Resume Header */}
                  <div className="text-center pb-4 border-b border-slate-200">
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 uppercase">
                      {result.header.fullName}
                    </h1>
                    <p className="text-sm font-semibold text-indigo-700 mt-0.5">
                      {result.header.targetRole}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-600 mt-2">
                      {result.header.email && <span>{result.header.email}</span>}
                      {result.header.phone && <span>• {result.header.phone}</span>}
                      {result.header.location && <span>• {result.header.location}</span>}
                      {result.header.linkedin && <span>• {result.header.linkedin}</span>}
                      {result.header.portfolio && <span>• {result.header.portfolio}</span>}
                    </div>
                  </div>

                  {/* Summary */}
                  {result.summary && (
                    <div className="space-y-1.5">
                      <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-200">
                        Professional Summary
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        {result.summary}
                      </p>
                    </div>
                  )}

                  {/* Skills */}
                  {result.skillsCategories && result.skillsCategories.length > 0 && (
                    <div className="space-y-2">
                      <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-200">
                        Technical & Professional Competencies
                      </h2>
                      <div className="space-y-1.5 text-xs">
                        {result.skillsCategories.map((cat, i) => (
                          <div key={i} className="flex flex-col sm:flex-row sm:items-baseline gap-1">
                            <span className="font-bold text-slate-800 min-w-32">{cat.category}:</span>
                            <span className="text-slate-700">{cat.skills.join(', ')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {result.education && result.education.length > 0 && (
                    <div className="space-y-2">
                      <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-200">
                        Education
                      </h2>
                      {result.education.map((edu, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between items-baseline text-xs sm:text-sm">
                            <span className="font-bold text-slate-900">{edu.institution}</span>
                            <span className="text-xs text-slate-500 font-medium">{edu.year}</span>
                          </div>
                          <div className="flex justify-between text-xs text-slate-700">
                            <span className="italic">{edu.degree}</span>
                            {edu.gpaOrScore && <span className="font-semibold">{edu.gpaOrScore}</span>}
                          </div>
                          {edu.highlights && edu.highlights.length > 0 && (
                            <ul className="list-disc list-inside text-xs text-slate-600 pl-1">
                              {edu.highlights.map((h, hIdx) => (
                                <li key={hIdx}>{h}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Projects */}
                  {result.projects && result.projects.length > 0 && (
                    <div className="space-y-3">
                      <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-200">
                        Key Projects & Technical Implementations
                      </h2>
                      {result.projects.map((proj, pIdx) => (
                        <div key={pIdx} className="space-y-1">
                          <div className="flex justify-between items-baseline text-xs sm:text-sm">
                            <span className="font-bold text-slate-900">
                              {proj.title} {proj.link && <span className="text-xs font-normal text-indigo-600">({proj.link})</span>}
                            </span>
                            {proj.techStack && (
                              <span className="text-[11px] text-slate-500">
                                {proj.techStack.join(', ')}
                              </span>
                            )}
                          </div>
                          <ul className="list-disc list-inside text-xs text-slate-700 space-y-1 pl-1">
                            {proj.bulletPoints.map((bp, bIdx) => (
                              <li key={bIdx} className="leading-relaxed">
                                {bp}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Experience */}
                  {result.experience && result.experience.length > 0 && (
                    <div className="space-y-3">
                      <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-200">
                        Experience & Campus Leadership
                      </h2>
                      {result.experience.map((exp, eIdx) => (
                        <div key={eIdx} className="space-y-1">
                          <div className="flex justify-between items-baseline text-xs sm:text-sm">
                            <span className="font-bold text-slate-900">{exp.role}</span>
                            <span className="text-xs text-slate-500 font-medium">{exp.duration}</span>
                          </div>
                          <div className="text-xs italic text-indigo-700 font-medium">
                            {exp.organization}
                          </div>
                          <ul className="list-disc list-inside text-xs text-slate-700 space-y-1 pl-1">
                            {exp.bulletPoints.map((bp, bIdx) => (
                              <li key={bIdx}>{bp}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Achievements */}
                  {result.achievements && result.achievements.length > 0 && (
                    <div className="space-y-2">
                      <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-200">
                        Honors, Certifications & Achievements
                      </h2>
                      <ul className="list-disc list-inside text-xs text-slate-700 space-y-1 pl-1">
                        {result.achievements.map((ach, aIdx) => (
                          <li key={aIdx}>{ach}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-lg">
                  {result.fullTextResume}
                </div>
              )}

              {/* Bottom Quick Followup Link */}
              {onNavigateToCoverLetter && (
                <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-between">
                  <div className="text-xs text-purple-900">
                    <span className="font-bold">Next Step: </span>
                    Create a matching tailored cover letter using these projects.
                  </div>
                  <button
                    onClick={() =>
                      onNavigateToCoverLetter({
                        fullName: result.header.fullName,
                        role: result.header.targetRole,
                        projects: result.projects.map((p) => p.title).join('; '),
                      })
                    }
                    className="text-xs font-bold text-purple-700 hover:text-purple-800 underline cursor-pointer"
                  >
                    Draft Cover Letter &rarr;
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Blank state */
            <div className="h-full min-h-[460px] flex flex-col items-center justify-center p-8 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-white/50 text-slate-400 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
                <FileText className="w-8 h-8" />
              </div>
              <div className="max-w-sm">
                <h4 className="text-base font-bold text-slate-700">No Resume Generated Yet</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Fill in your academic and project details on the left (or click "Load Sample Profile"), then hit "Generate ATS Resume Draft" to see your formatted resume.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
