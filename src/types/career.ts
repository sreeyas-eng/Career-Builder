export type FeatureTab = 
  | 'overview'
  | 'resume-builder'
  | 'interview-questions'
  | 'answer-improver'
  | 'career-guidance'
  | 'skill-roadmap'
  | 'cover-letter';

// 1. Resume Types
export interface ResumePersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
  headline?: string;
}

export interface ResumeEducation {
  institution: string;
  degree: string;
  year: string;
  gpaOrScore?: string;
  highlights?: string[];
}

export interface ResumeProject {
  title: string;
  techStack: string[];
  link?: string;
  bulletPoints: string[];
}

export interface ResumeExperience {
  role: string;
  organization: string;
  duration: string;
  bulletPoints: string[];
}

export interface ResumeSkillsCategory {
  category: string;
  skills: string[];
}

export interface ResumeData {
  summary: string;
  header: ResumePersonalInfo & { targetRole: string };
  skillsCategories: ResumeSkillsCategory[];
  education: ResumeEducation[];
  projects: ResumeProject[];
  experience?: ResumeExperience[];
  achievements?: string[];
  atsTips: string[];
  fullTextResume: string;
}

// 2. Interview Questions Types
export interface InterviewQuestionItem {
  id: number;
  question: string;
  type: 'Technical' | 'HR / Behavioral' | string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | string;
  topic: string;
  whyAsked: string;
  keyPoints: string[];
  sampleHook?: string;
}

export interface InterviewQuestionsResult {
  role: string;
  disclaimer?: string;
  questions: InterviewQuestionItem[];
}

// 3. Answer Improver Types
export interface AnswerScoreBreakdown {
  clarity: number;
  confidence: number;
  structure: number;
  impact: number;
}

export interface StarBreakdown {
  situation?: string;
  task?: string;
  action?: string;
  result?: string;
}

export interface AnswerImproverResult {
  overallScore: number;
  scoreBreakdown: AnswerScoreBreakdown;
  verdict: string;
  strengths: string[];
  suggestions: string[];
  improvedAnswer: string;
  conciseVersion?: string;
  starBreakdown?: StarBreakdown;
  powerVerbs?: string[];
}

// 4. Career Guidance Types
export interface CareerProjectIdea {
  name: string;
  description: string;
  outcome?: string;
}

export interface CareerPathItem {
  title: string;
  matchPercentage: number;
  whyFit: string;
  entryLevelTitles: string[];
  requiredSkills: {
    mustHave: string[];
    goodToHave?: string[];
    tools: string[];
  };
  qualifications?: string[];
  recommendedProjects: CareerProjectIdea[];
  dayInTheLife?: string;
  industryOutlook?: string;
}

export interface CareerGuidanceResult {
  studentProfileSummary: string;
  careerPaths: CareerPathItem[];
  collegeActionPlan: string[];
}

// 5. Skill Roadmap Types
export interface FreeResource {
  name: string;
  type: string;
  urlOrPlatform: string;
}

export interface RoadmapMilestoneProject {
  title: string;
  description: string;
  skillsDemonstrated?: string[];
}

export interface RoadmapStage {
  stageName: 'Beginner' | 'Intermediate' | 'Advanced' | string;
  tagline?: string;
  duration: string;
  goal?: string;
  topics: string[];
  toolsAndTech: string[];
  freeResources?: FreeResource[];
  milestoneProject: RoadmapMilestoneProject;
  commonPitfalls?: string[];
}

export interface CapstoneProjectIdea {
  name: string;
  description: string;
  keyFeatures?: string[];
  resumeBullet: string;
}

export interface SkillRoadmapResult {
  title: string;
  overview: string;
  totalDuration: string;
  stages: RoadmapStage[];
  capstoneProjectIdea: CapstoneProjectIdea;
  learningTips?: string[];
}

// 6. Cover Letter Types
export interface CoverLetterResult {
  subjectLine: string;
  salutation?: string;
  openingParagraph?: string;
  bodyParagraph1?: string;
  bodyParagraph2?: string;
  closingParagraph?: string;
  signOff?: string;
  fullLetterText: string;
  recruiterTips: string[];
}

// History Saved Item
export interface SavedHistoryItem {
  id: string;
  type: FeatureTab;
  title: string;
  subtitle: string;
  timestamp: number;
  data: any;
}
