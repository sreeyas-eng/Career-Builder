import {
  ResumeData,
  InterviewQuestionsResult,
  AnswerImproverResult,
  CareerGuidanceResult,
  SkillRoadmapResult,
  CoverLetterResult,
  SavedHistoryItem,
} from '../types/career';

async function postJSON<T>(url: string, payload: unknown): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error || data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data.data as T;
}

export const CareerAPI = {
  async generateResume(payload: any): Promise<ResumeData> {
    return postJSON<ResumeData>('/api/resume/generate', payload);
  },

  async generateInterviewQuestions(payload: {
    role: string;
    domain?: string;
    level?: string;
    questionType?: string;
    focusTopics?: string;
  }): Promise<InterviewQuestionsResult> {
    return postJSON<InterviewQuestionsResult>('/api/interview/questions', payload);
  },

  async improveAnswer(payload: {
    question: string;
    answer: string;
    targetRole?: string;
  }): Promise<AnswerImproverResult> {
    return postJSON<AnswerImproverResult>('/api/interview/improve-answer', payload);
  },

  async getCareerGuidance(payload: {
    degree?: string;
    major?: string;
    interests: string;
    currentSkills?: string;
    favoriteSubjects?: string;
    workStyle?: string;
  }): Promise<CareerGuidanceResult> {
    return postJSON<CareerGuidanceResult>('/api/career/guidance', payload);
  },

  async generateRoadmap(payload: {
    targetSkillOrCareer: string;
    currentLevel?: string;
    weeklyHours?: string;
    timeHorizon?: string;
  }): Promise<SkillRoadmapResult> {
    return postJSON<SkillRoadmapResult>('/api/roadmap/generate', payload);
  },

  async generateCoverLetter(payload: {
    studentName: string;
    jobRole: string;
    companyName: string;
    qualifications?: string;
    keyProjects?: string;
    whyCompany?: string;
    tone?: string;
  }): Promise<CoverLetterResult> {
    return postJSON<CoverLetterResult>('/api/cover-letter/generate', payload);
  },
};

// Local storage management for student history
const HISTORY_KEY = 'ai_career_buddy_history';

export const HistoryStorage = {
  getAll(): SavedHistoryItem[] {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  save(item: Omit<SavedHistoryItem, 'id' | 'timestamp'>): SavedHistoryItem {
    const current = this.getAll();
    const newItem: SavedHistoryItem = {
      ...item,
      id: 'hist_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      timestamp: Date.now(),
    };
    const updated = [newItem, ...current.slice(0, 24)]; // Keep up to 25 items
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
    return newItem;
  },

  remove(id: string): SavedHistoryItem[] {
    const current = this.getAll().filter((x) => x.id !== id);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(current));
    } catch (e) {
      console.warn('Failed to update localStorage', e);
    }
    return current;
  },

  clear(): void {
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (e) {
      console.warn('Failed to clear localStorage', e);
    }
  },
};
