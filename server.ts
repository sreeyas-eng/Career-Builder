import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini API client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const PRIMARY_MODEL = 'gemini-3.8-flash';
const FALLBACK_MODEL = 'gemini-3.1-flash-lite';

async function generateContentResiliently(params: {
  contents: string;
  config?: any;
}) {
  const models = [PRIMARY_MODEL, FALLBACK_MODEL];
  let lastErr: any = null;

  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        return await ai.models.generateContent({
          model,
          contents: params.contents,
          config: params.config,
        });
      } catch (err: any) {
        lastErr = err;
        const msg = String(err?.message || err);
        const isTemporary =
          msg.includes('503') ||
          msg.includes('UNAVAILABLE') ||
          msg.includes('high demand') ||
          msg.includes('429') ||
          msg.includes('RESOURCE_EXHAUSTED');
        if (isTemporary && attempt === 0) {
          await new Promise((r) => setTimeout(r, 1500));
          continue;
        }
        break; // Switch to fallback model
      }
    }
  }
  throw lastErr;
}

// Helper error response
const handleError = (res: Response, error: unknown, defaultMessage: string) => {
  console.error(defaultMessage, error);
  const errMsg = error instanceof Error ? error.message : String(error);
  if (errMsg.includes('API_KEY') || errMsg.includes('PERMISSION_DENIED')) {
    return res.status(403).json({
      error: 'Gemini API authentication failed. Please verify your GEMINI_API_KEY in the Secrets panel.',
    });
  }
  if (
    errMsg.includes('503') ||
    errMsg.includes('UNAVAILABLE') ||
    errMsg.includes('high demand')
  ) {
    return res.status(503).json({
      error: 'The AI model is experiencing high temporary demand. Please retry in a few moments.',
    });
  }
  if (errMsg.includes('RESOURCE_EXHAUSTED')) {
    return res.status(429).json({
      error: 'AI service rate limit reached. Please wait a few moments and try again.',
    });
  }
  return res.status(500).json({
    error: defaultMessage || 'An unexpected error occurred while communicating with AI service.',
    details: errMsg,
  });
};

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasKey: Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY'),
    timestamp: new Date().toISOString(),
  });
});

// 1. AI Resume Builder
app.post('/api/resume/generate', async (req: Request, res: Response) => {
  try {
    const { personalInfo, education, skills, projects, experience, achievements, targetRole } = req.body;

    if (!personalInfo?.fullName || !targetRole) {
      return res.status(400).json({ error: 'Full name and target role are required.' });
    }

    const prompt = `You are an elite campus placement career counselor and ATS resume specialist for college students.
Create a highly polished, professional, and ATS-optimized resume draft tailored for: "${targetRole}".

CRITICAL INSTRUCTIONS:
- Ground everything strictly in the student's actual provided details. DO NOT invent fake degrees, fake companies, fake GPA, or fake work history.
- Enhance wording using strong action verbs (e.g. Engineered, Spearheaded, Implemented, Analyzed, Streamlined, Orchestrated).
- Highlight quantitative or qualitative impact where possible based on their project details.
- Provide clear sections: Contact Header, Professional Summary, Technical & Soft Skills, Education, Projects, Experience/Leadership/Internships, Achievements & Certifications.
- Format the response as a structured JSON object.

Student Details:
- Name: ${personalInfo.fullName}
- Email: ${personalInfo.email || 'Not provided'}
- Phone: ${personalInfo.phone || 'Not provided'}
- Location: ${personalInfo.location || 'Not provided'}
- LinkedIn: ${personalInfo.linkedin || ''}
- GitHub / Portfolio: ${personalInfo.portfolio || ''}
- Target Role: ${targetRole}
- Professional Headline / Tagline: ${personalInfo.headline || ''}
- Education: ${JSON.stringify(education || [])}
- Technical Skills: ${Array.isArray(skills?.technical) ? skills.technical.join(', ') : skills?.technical || ''}
- Soft Skills: ${Array.isArray(skills?.soft) ? skills.soft.join(', ') : skills?.soft || ''}
- Tools & Frameworks: ${Array.isArray(skills?.tools) ? skills.tools.join(', ') : skills?.tools || ''}
- Projects: ${JSON.stringify(projects || [])}
- Experience / Internships: ${JSON.stringify(experience || [])}
- Achievements & Certifications: ${JSON.stringify(achievements || [])}
- Extra Notes: ${req.body.notes || 'None'}`;

    const response = await generateContentResiliently({
      contents: prompt,
      config: {
        systemInstruction: "You are an expert college resume writer. Output valid JSON matching the requested schema strictly.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "Punchy 3-4 sentence professional summary targeted for entry-level / college graduate" },
            header: {
              type: Type.OBJECT,
              properties: {
                fullName: { type: Type.STRING },
                targetRole: { type: Type.STRING },
                email: { type: Type.STRING },
                phone: { type: Type.STRING },
                location: { type: Type.STRING },
                linkedin: { type: Type.STRING },
                portfolio: { type: Type.STRING },
              },
              required: ["fullName", "targetRole"],
            },
            skillsCategories: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING, description: "e.g., Programming Languages, Web Frameworks, Tools, Soft Skills" },
                  skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["category", "skills"],
              },
            },
            education: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  institution: { type: Type.STRING },
                  degree: { type: Type.STRING },
                  year: { type: Type.STRING },
                  gpaOrScore: { type: Type.STRING },
                  highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["institution", "degree", "year"],
              },
            },
            projects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
                  link: { type: Type.STRING },
                  bulletPoints: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Action-oriented bullet points" },
                },
                required: ["title", "bulletPoints"],
              },
            },
            experience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  role: { type: Type.STRING },
                  organization: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  bulletPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["role", "organization", "duration", "bulletPoints"],
              },
            },
            achievements: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            atsTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 key recommendations for this student to pass applicant tracking systems",
            },
            fullTextResume: {
              type: Type.STRING,
              description: "Full clean markdown plain text version suitable for direct copying to clipboard or Word/Google Docs",
            },
          },
          required: ["summary", "header", "skillsCategories", "education", "projects", "fullTextResume"],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error) {
    return handleError(res, error, 'Failed to generate resume draft');
  }
});

// 2. Interview Question Generator
app.post('/api/interview/questions', async (req: Request, res: Response) => {
  try {
    const { role, domain, level = 'Entry-level / College Graduate', questionType = 'balanced', focusTopics } = req.body;

    if (!role) {
      return res.status(400).json({ error: 'Job role is required.' });
    }

    const prompt = `Generate exactly 10 high-value interview practice questions for a college student applying for:
Role: "${role}"
Domain / Industry: "${domain || 'General'}"
Experience Level: "${level}"
Focus Preferences: "${questionType}" (Technical vs HR/Behavioral mix)
Specific Topics: "${focusTopics || 'Standard core topics for this role'}"

Requirements:
- Exactly 10 questions.
- A balanced split between technical domain competencies and HR/behavioral/situational questions.
- Clear categorization: Type (Technical or HR / Behavioral), Difficulty (Beginner, Intermediate, Tricky), Category/Topic.
- For each question, explain "Why Interviewers Ask This" in simple student terms.
- Provide "Key Points to Include in Answer" (bullet pointers, frameworks like STAR).
- Emphasize that these are practice questions designed for preparation.`;

    const response = await generateContentResiliently({
      contents: prompt,
      config: {
        systemInstruction: "You are a friendly, encouraging tech campus placement interviewer and recruiter. Output valid JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            role: { type: Type.STRING },
            disclaimer: { type: Type.STRING, description: "Friendly note that these are mock practice questions" },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  question: { type: Type.STRING },
                  type: { type: Type.STRING, description: "Technical or HR / Behavioral" },
                  difficulty: { type: Type.STRING, description: "Beginner, Intermediate, or Advanced" },
                  topic: { type: Type.STRING, description: "e.g., Problem Solving, Data Structures, Teamwork, System Basics" },
                  whyAsked: { type: Type.STRING, description: "Why the interviewer asks this question" },
                  keyPoints: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Tips and points the student should mention" },
                  sampleHook: { type: Type.STRING, description: "A great opening sentence idea for this answer" },
                },
                required: ["id", "question", "type", "difficulty", "topic", "whyAsked", "keyPoints"],
              },
            },
          },
          required: ["role", "questions"],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error) {
    return handleError(res, error, 'Failed to generate interview practice questions');
  }
});

// 3. Interview Answer Improver
app.post('/api/interview/improve-answer', async (req: Request, res: Response) => {
  try {
    const { question, answer, targetRole = 'Entry-level / College Graduate' } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ error: 'Both interview question and your draft answer are required.' });
    }

    const prompt = `You are a supportive, constructive interview coach for college students.
A student gave this draft answer to an interview question. Analyze and elevate it.

Target Role: ${targetRole}
Interview Question: "${question}"
Student's Draft Answer: "${answer}"

Deliver:
1. Improved Polished Version (clear, confident, structured, natural voice for a college student, using STAR method where appropriate).
2. Concise "Elevator Pitch" version (under 60 seconds).
3. Objective Scores (1-10) for: Clarity, Confidence, Structure, Impact, and an Overall Readiness Score (out of 100).
4. What the student did well (celebrate positive elements).
5. Constructive areas to improve (filler words, rambling, passive voice, missing results).
6. Recommended action verbs to highlight.`;

    const response = await generateContentResiliently({
      contents: prompt,
      config: {
        systemInstruction: "You are an encouraging college interview coach. Never be harsh, give actionable feedback. Output valid JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.INTEGER, description: "Score out of 100" },
            scoreBreakdown: {
              type: Type.OBJECT,
              properties: {
                clarity: { type: Type.INTEGER, description: "1-10" },
                confidence: { type: Type.INTEGER, description: "1-10" },
                structure: { type: Type.INTEGER, description: "1-10" },
                impact: { type: Type.INTEGER, description: "1-10" },
              },
              required: ["clarity", "confidence", "structure", "impact"],
            },
            verdict: { type: Type.STRING, description: "Quick motivating badge: e.g. Promising Start, Strong Contender, Interview Ready" },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvedAnswer: { type: Type.STRING, description: "The full refined answer using STAR method where applicable" },
            conciseVersion: { type: Type.STRING, description: "A quick 60-second high-impact delivery version" },
            starBreakdown: {
              type: Type.OBJECT,
              properties: {
                situation: { type: Type.STRING },
                task: { type: Type.STRING },
                action: { type: Type.STRING },
                result: { type: Type.STRING },
              },
              description: "Breakdown of the story into STAR elements if applicable",
            },
            powerVerbs: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Strong action verbs to remember" },
          },
          required: ["overallScore", "scoreBreakdown", "strengths", "suggestions", "improvedAnswer"],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error) {
    return handleError(res, error, 'Failed to improve interview answer');
  }
});

// 4. AI Career Guidance
app.post('/api/career/guidance', async (req: Request, res: Response) => {
  try {
    const { degree, major, interests, currentSkills, favoriteSubjects, workStyle } = req.body;

    if (!interests && !favoriteSubjects && !currentSkills) {
      return res.status(400).json({ error: 'Please provide at least your interests, favorite subjects, or skills.' });
    }

    const prompt = `Act as an expert collegiate career advisor. Suggest 3 to 4 tailored, realistic, and rewarding career paths for a college student with the following profile:
- Degree / Major: ${degree || 'College Student'} (${major || 'General'})
- Core Interests: ${interests || 'Exploring possibilities'}
- Known Skills & Tools: ${currentSkills || 'Eager learner'}
- Favorite Subjects: ${favoriteSubjects || 'Varied'}
- Work Style / Preference: ${workStyle || 'Flexible'}

Guidelines:
- Give genuine, realistic career suggestions (no unrealistic hype, no false job guarantees).
- Explain WHY each career matches their specific blend of interests and subjects.
- Detail the exact core skills and tools they need to learn during college.
- List 2-3 specific portfolio projects a student can build in their dorm/hostel room to prove their competence.
- Provide entry-level job titles to search for during campus recruitment or internship hunting.
- Include a realistic industry demand outlook.`;

    const response = await generateContentResiliently({
      contents: prompt,
      config: {
        systemInstruction: "You are an empathetic, insightful college career counselor. Output valid JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            studentProfileSummary: { type: Type.STRING, description: "A brief encouraging summary of what stands out about this student profile" },
            careerPaths: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  matchPercentage: { type: Type.INTEGER, description: "e.g. 92" },
                  whyFit: { type: Type.STRING, description: "Clear explanation connecting their favorite subjects and interests to this role" },
                  entryLevelTitles: { type: Type.ARRAY, items: { type: Type.STRING } },
                  requiredSkills: {
                    type: Type.OBJECT,
                    properties: {
                      mustHave: { type: Type.ARRAY, items: { type: Type.STRING } },
                      goodToHave: { type: Type.ARRAY, items: { type: Type.STRING } },
                      tools: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ["mustHave", "tools"],
                  },
                  qualifications: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Relevant degrees, coursework, certifications" },
                  recommendedProjects: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        description: { type: Type.STRING },
                        outcome: { type: Type.STRING },
                      },
                      required: ["name", "description"],
                    },
                  },
                  dayInTheLife: { type: Type.STRING, description: "What an entry-level professional does day-to-day in this role" },
                  industryOutlook: { type: Type.STRING, description: "Realistic growth outlook and typical entry package/demand" },
                },
                required: ["title", "matchPercentage", "whyFit", "entryLevelTitles", "requiredSkills", "recommendedProjects"],
              },
            },
            collegeActionPlan: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "4 immediate steps the student should take this semester",
            },
          },
          required: ["studentProfileSummary", "careerPaths", "collegeActionPlan"],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error) {
    return handleError(res, error, 'Failed to generate career guidance');
  }
});

// 5. Skill Learning Roadmap
app.post('/api/roadmap/generate', async (req: Request, res: Response) => {
  try {
    const { targetSkillOrCareer, currentLevel = 'Beginner', weeklyHours = '10 hours/week', timeHorizon = '3-6 months' } = req.body;

    if (!targetSkillOrCareer) {
      return res.status(400).json({ error: 'Target skill or career is required.' });
    }

    const prompt = `Create a comprehensive, step-by-step learning roadmap for a college student aiming to master:
Skill / Career: "${targetSkillOrCareer}"
Current Starting Level: "${currentLevel}"
Time Commitment: "${weeklyHours}"
Estimated Target Duration: "${timeHorizon}"

Format into 3 distinct stages:
1. Beginner Stage (Foundations, core syntax/concepts, essential tools, 2 practical mini exercises)
2. Intermediate Stage (Real-world frameworks, architecture, API integration, best practices, hands-on application)
3. Advanced Stage (Deployment, performance, security, capstone portfolio project, interview readiness)

For each stage provide:
- Duration / Timeline
- Key topics & modules to learn
- Specific tools & libraries
- Recommended free resources (MDN, official docs, free tutorials, GitHub repos)
- Milestone mini-project to build and put on GitHub/portfolio
- Common pitfalls to avoid`;

    const response = await generateContentResiliently({
      contents: prompt,
      config: {
        systemInstruction: "You are a senior tech mentor and curriculum designer for college students. Output valid JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            overview: { type: Type.STRING },
            totalDuration: { type: Type.STRING },
            stages: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  stageName: { type: Type.STRING, description: "Beginner, Intermediate, or Advanced" },
                  tagline: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  goal: { type: Type.STRING },
                  topics: { type: Type.ARRAY, items: { type: Type.STRING } },
                  toolsAndTech: { type: Type.ARRAY, items: { type: Type.STRING } },
                  freeResources: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        type: { type: Type.STRING, description: "Official Docs, Interactive Course, Video Guide, GitHub Repo" },
                        urlOrPlatform: { type: Type.STRING },
                      },
                      required: ["name", "type", "urlOrPlatform"],
                    },
                  },
                  milestoneProject: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      skillsDemonstrated: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ["title", "description"],
                  },
                  commonPitfalls: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["stageName", "duration", "topics", "toolsAndTech", "milestoneProject"],
              },
            },
            capstoneProjectIdea: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                keyFeatures: { type: Type.ARRAY, items: { type: Type.STRING } },
                resumeBullet: { type: Type.STRING, description: "Example bullet point to write on resume after completing this" },
              },
              required: ["name", "description", "resumeBullet"],
            },
            learningTips: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["title", "overview", "stages", "capstoneProjectIdea"],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error) {
    return handleError(res, error, 'Failed to generate learning roadmap');
  }
});

// 6. Cover Letter Generator
app.post('/api/cover-letter/generate', async (req: Request, res: Response) => {
  try {
    const { studentName, jobRole, companyName, qualifications, keyProjects, whyCompany, tone = 'Confident & Professional' } = req.body;

    if (!studentName || !jobRole || !companyName) {
      return res.status(400).json({ error: 'Student name, job role, and company name are required.' });
    }

    const prompt = `Write a compelling, natural, and highly tailored cover letter for a college student applying for an internship or entry-level job.

Details:
- Student Name: ${studentName}
- Target Role: ${jobRole}
- Company Name: ${companyName}
- Academic Background & Qualifications: ${qualifications || 'Undergraduate student'}
- Relevant Projects / Coursework: ${keyProjects || 'Academic and self-directed projects'}
- Motivation / Why this company: ${whyCompany || 'Eager to contribute fresh perspectives and technical skills to the team'}
- Desired Tone: ${tone}

Requirements:
- Structure: Salutation, Hook/Opening, 2 Body Paragraphs linking student projects/skills to company needs, Enthusiastic Call-to-action, Professional sign-off.
- DO NOT invent fake prior corporate experience; frame projects, hackathons, open source, or coursework authentically.
- Avoid robotic cliches like "I am writing to express my interest". Make the opening engaging and memorable.
- Provide a clean ready-to-copy version with bracketed placeholders where specific company details can be fine-tuned.
- Provide 3 custom tips for emailing this cover letter to recruiters.`;

    const response = await generateContentResiliently({
      contents: prompt,
      config: {
        systemInstruction: "You are an expert career communications coach. Output valid JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subjectLine: { type: Type.STRING, description: "Punchy email subject line for application" },
            salutation: { type: Type.STRING },
            openingParagraph: { type: Type.STRING },
            bodyParagraph1: { type: Type.STRING, description: "Connecting academic/project accomplishments to the role" },
            bodyParagraph2: { type: Type.STRING, description: "Why this specific company and what fresh value the student brings" },
            closingParagraph: { type: Type.STRING, description: "Confident call to action and interview request" },
            signOff: { type: Type.STRING },
            fullLetterText: { type: Type.STRING, description: "Complete letter formatted in markdown / plain text ready to copy" },
            recruiterTips: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 actionable tips when sending" },
          },
          required: ["subjectLine", "fullLetterText", "recruiterTips"],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed });
  } catch (error) {
    return handleError(res, error, 'Failed to generate cover letter');
  }
});

// Setup Vite middleware in dev or static files in prod
if (!isProd) {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(port, '0.0.0.0', () => {
  console.log(`AI Career Buddy server listening on http://0.0.0.0:${port} [${isProd ? 'production' : 'development'}]`);
});
