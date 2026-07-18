import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

interface VolunteerTask {
  task: string;
  assignee: 'Volunteer Core' | 'Logistics Staff' | 'Medical' | 'Security';
  priority: 'High' | 'Medium' | 'Low';
}

interface OpsResponse {
  title: string;
  severity: 'low' | 'medium' | 'high';
  checklist: VolunteerTask[];
}

const INJECTION_PATTERNS = [
  /ignore\s+(?:previous|all|the)\s+(?:instruction|directive|prompt|rule)/i,
  /you\s+are\s+now\s+a/i,
  /system\s+bypass/i,
  /disable\s+safety/i,
  /<script>/i,
  /javascript:/i
];

function getMockOpsResponse(scenario: string, language: string): OpsResponse {
  const s = scenario ? scenario.toLowerCase() : '';
  if (s.includes('gate 4') || s.includes('bottleneck') || s.includes('congest') || s.includes('crowd')) {
    return {
      title: language === 'es' ? 'Mitigación de Congestión en Puerta 4' : language === 'fr' ? 'Atténuation de la Saturation - Porte 4' : 'Gate 4 Congestion Mitigation',
      severity: 'high',
      checklist: [
        { task: 'Redirect 10 volunteers from Inner Sectors A/B to Gate 4 queues to pre-check tickets', assignee: 'Volunteer Core', priority: 'High' },
        { task: 'Update digital display boards in Sector B to guide arriving fans to Gate 3 (Empty)', assignee: 'Logistics Staff', priority: 'High' },
        { task: 'Broadcast push alert on tournament app to fans ticketed for Gate 4 recommending alternate entries', assignee: 'Logistics Staff', priority: 'Medium' },
        { task: 'Deploy extra security guards to establish barrier queuing lines', assignee: 'Security', priority: 'High' }
      ]
    };
  }
  return {
    title: 'Standard Incident Response Checklist',
    severity: 'medium',
    checklist: [
      { task: 'Confirm incident details with zone commanders on-site', assignee: 'Volunteer Core', priority: 'High' },
      { task: 'Deploy local area volunteers to redirect spectator flow and provide info', assignee: 'Volunteer Core', priority: 'Medium' },
      { task: 'Prepare emergency response signage and standby radio frequencies', assignee: 'Logistics Staff', priority: 'High' }
    ]
  };
}

/**
 * Vercel Serverless Function: Operations Generative Scenario Checklist API
 * Evaluates stadium incident scenarios and constructs real-time staff/volunteer dispatch checklists.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { scenario, language } = (req.body || {}) as { scenario?: string; language?: string };

  // Security guardrail check
  if (scenario && INJECTION_PATTERNS.some(pattern => pattern.test(scenario))) {
    return res.status(400).json({
      status: 'error',
      message: 'Security Alert: Unsafe input pattern or prompt injection detected.'
    });
  }

  if (!apiKey) {
    return res.status(200).json({ status: 'success', data: getMockOpsResponse(scenario || '', language || 'en') });
  }

  try {
    const ai = new GoogleGenerativeAI(apiKey);
    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = `
      You are the lead venue operations coordinator for the 2026 FIFA World Cup.
      An organizer has input a natural language scenario detailing a stadium operations issue:
      Scenario: "${scenario || ''}"

      Generate a checklist of action items for volunteers and staff. Translate the content of your response (title and tasks) to the requested language: "${language || 'en'}".

      Your response MUST be returned as a valid JSON object matching this TypeScript structure:
      {
        "title": "A short descriptive title for the action plan",
        "severity": "low" | "medium" | "high",
        "checklist": [
          {
            "task": "Specific actionable volunteer/staff task instruction",
            "assignee": "Volunteer Core" | "Logistics Staff" | "Medical" | "Security",
            "priority": "High" | "Medium" | "Low"
          }
        ]
      }

      Ensure you only return the JSON, no Markdown wrap code blocks (like \`\`\`json ... \`\`\`), just the plain JSON string.
    `;

    const result = await model.generateContent(prompt);
    let cleanJson = result.response.text().trim();
    if (cleanJson.startsWith('```json')) cleanJson = cleanJson.substring(7);
    if (cleanJson.endsWith('```')) cleanJson = cleanJson.substring(0, cleanJson.length - 3);

    return res.status(200).json({ status: 'success', data: JSON.parse(cleanJson.trim()) });
  } catch (err) {
    console.error('Vercel serverless ops scenario error:', err);
    return res.status(200).json({ status: 'success', data: getMockOpsResponse(scenario || '', language || 'en') });
  }
}
