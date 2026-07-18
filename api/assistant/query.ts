import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

function getMockFanResponse(query: string, language: string) {
  const q = query ? query.toLowerCase() : '';
  if (q.includes('gate 4') || q.includes('congest') || q.includes('crowd') || q.includes('queue')) {
    if (language === 'es') {
      return {
        response: "**Alerta de congestión:** La Puerta 4 está experimentando un alto tráfico debido a retrasos en los lectores. Recomendamos ingresar por la **Puerta 3 o la Puerta 5** (demora estimada < 5 min). El personal de asistencia está en camino.",
        routeHighlight: 'gate_4',
        crowdStatusAlert: 'Puerta 4 congestionada. Redirigir a Puertas 3/5.'
      };
    } else if (language === 'fr') {
      return {
        response: "**Alerte de congestion:** La porte 4 est actuellement saturée en raison de retards aux scanners. Veuillez utiliser la **Porte 3 ou la Porte 5** pour un accès plus rapide (< 5 min).",
        routeHighlight: 'gate_4',
        crowdStatusAlert: 'Porte 4 saturée. Rediriger vers Portes 3/5.'
      };
    } else {
      return {
        response: "**Congestion Alert:** Gate 4 is experiencing high delays due to scanner scanning synchronization. We highly recommend redirecting to **Gate 3 or Gate 5** which have waiting times under 5 minutes.",
        routeHighlight: 'gate_4',
        crowdStatusAlert: 'Gate 4 highly congested. Redirecting incoming flows.'
      };
    }
  }

  if (q.includes('wheelchair') || q.includes('disabled') || q.includes('access') || q.includes('handicap') || q.includes('ramp')) {
    return {
      response: "The venue is fully accessible. Accessible ramps are located next to **Gate 2 and Gate 5**. The highlighted blue path on the map provides step-free navigation directly to Level 1 wheelchair seating (Sectors A & B).",
      routeHighlight: 'accessibility_path'
    };
  }

  if (q.includes('bag') || q.includes('restrict') || q.includes('item') || q.includes('prohibit') || q.includes('bottle')) {
    return {
      response: "**Permitted & Prohibited Items Policy:**\n\n1. **Bags:** Only clear plastic bags (max 12x12x6 inches) are permitted.\n2. **Containers:** Glass bottles and metal cans are prohibited.\n3. **Food:** Outside food is not allowed, except baby formula or medical items.",
      routeHighlight: 'gate_1'
    };
  }

  return {
    response: "Welcome to FanPulse 2026 Stadium Hub! Today's match kicks off at **18:00** (Gates open at **15:00**). Express shuttle trains are running every 4 minutes. Let me know if you need assistance with transportation, gates, or safety rules!",
    routeHighlight: 'default'
  };
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { query, language } = req.body || {};

  if (!apiKey) {
    return res.status(200).json({ status: 'success', data: getMockFanResponse(query, language) });
  }

  try {
    const ai = new GoogleGenerativeAI(apiKey);
    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = `
      You are the official Fan Assistant Concierge for "FanPulse 2026" at the FIFA World Cup Stadium Hub.
      The user is asking a query in the stadium. You must respond in the requested language: "${language || 'en'}".
      
      User Query: "${query}"

      Context:
      - Stadium gates: Gate 1 (North - VIP), Gate 2 (East - General & Accessible Ramp), Gate 3 (South - General), Gate 4 (West - General, experiencing scanner delays and bottleneck), Gate 5 (Northeast - General & Accessible Ramp).
      - Accessibility path is highlighted with "accessibility_path" and leads from Gates 2/5 to Level 1 seating.
      - Bag policy: Only clear plastic bags (max 12x12x6 inches) are permitted. Glass, metal, and long flagpoles are prohibited.
      - Express transit shuttles run every 4 minutes. Matches start at 18:00, gates open at 15:00.

      Your response MUST be returned as a valid JSON object matching this TypeScript structure:
      {
        "response": "Your helpful response markdown formatted",
        "routeHighlight": "Optional ID to highlight: gate_1 | gate_2 | gate_3 | gate_4 | gate_5 | accessibility_path | sector_a | sector_b",
        "crowdStatusAlert": "Optional short alert string if there is high congestion or warning at the gate"
      }
      
      Ensure you only return the JSON, no Markdown wrap code blocks (like \`\`\`json ... \`\`\`), just the plain JSON string.
    `;

    const result = await model.generateContent(prompt);
    let cleanJson = result.response.text().trim();
    if (cleanJson.startsWith('```json')) cleanJson = cleanJson.substring(7);
    if (cleanJson.endsWith('```')) cleanJson = cleanJson.substring(0, cleanJson.length - 3);

    return res.status(200).json({ status: 'success', data: JSON.parse(cleanJson.trim()) });
  } catch (err) {
    console.error('Vercel serverless gemini query error:', err);
    return res.status(200).json({ status: 'success', data: getMockFanResponse(query, language) });
  }
}
