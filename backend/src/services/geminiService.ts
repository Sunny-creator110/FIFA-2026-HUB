import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

let ai: any = null;
if (apiKey) {
  try {
    ai = new GoogleGenerativeAI(apiKey);
  } catch (err) {
    console.error('Failed to initialize GoogleGenerativeAI client:', err);
  }
}

// Interfaces for our structured outputs
export interface FanResponse {
  response: string;
  routeHighlight?: string; // gate_1, gate_2, gate_3, gate_4, accessibility_path, sector_a, etc.
  crowdStatusAlert?: string;
}

export interface VolunteerTask {
  task: string;
  assignee: 'Volunteer Core' | 'Logistics Staff' | 'Medical' | 'Security';
  priority: 'High' | 'Medium' | 'Low';
}

export interface OpsResponse {
  title: string;
  severity: 'low' | 'medium' | 'high';
  checklist: VolunteerTask[];
}

/**
 * Fallback Mock Responder - ensures seamless execution without API keys
 */
function getMockFanResponse(query: string, language: string): FanResponse {
  const q = query.toLowerCase();
  
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
    if (language === 'es') {
      return {
        response: "El estadio cuenta con accesibilidad total. Las rampas para sillas de ruedas están ubicadas al lado de la **Puerta 2 y la Puerta 5**. El sendero pavimentado azul en el mapa muestra la ruta adaptada hacia los sectores A y B del Nivel 1. Los ascensores de la plataforma están disponibles en todos los puntos de control.",
        routeHighlight: 'accessibility_path'
      };
    } else if (language === 'fr') {
      return {
        response: "L'accessibilité est entièrement garantie. Des rampes d'accès sont situées à côté de la **Porte 2 et la Porte 5**. Le tracé bleu sur le plan indique le chemin adapté vers les zones A et B du niveau 1.",
        routeHighlight: 'accessibility_path'
      };
    } else {
      return {
        response: "The venue is fully accessible. Accessible ramps are located next to **Gate 2 and Gate 5**. The highlighted blue path on the map provides step-free navigation directly to Level 1 wheelchair seating (Sectors A & B). High-contrast signs and platform lifts are operational.",
        routeHighlight: 'accessibility_path'
      };
    }
  }

  if (q.includes('bag') || q.includes('restrict') || q.includes('item') || q.includes('prohibit') || q.includes('bottle') || q.includes('food')) {
    if (language === 'es') {
      return {
        response: "**Reglamento de Objetos Permitidos:**\n\n1. Se permiten bolsas de plástico transparentes de hasta 12x12x6 pulgadas (30x30x15 cm).\n2. No se permiten botellas de vidrio, latas metálicas ni termos.\n3. Cámaras profesionales o trípodes están prohibidos sin acreditación de prensa.\n4. No se permite comida externa, excepto alimentos infantiles o médicamente necesarios.",
        routeHighlight: 'gate_1'
      };
    } else if (language === 'fr') {
      return {
        response: "**Règlement sur les objets interdits :**\n\n1. Seuls les sacs transparents de moins de 12x12x6 pouces (30x30x15 cm) sont autorisés.\n2. Bouteilles en verre, canettes métalliques et gourdes rigides interdites.\n3. Appareils photo professionnels interdits sans badge média.\n4. Nourriture extérieure interdite (sauf bébés/raisons médicales).",
        routeHighlight: 'gate_1'
      };
    } else {
      return {
        response: "**Permitted & Prohibited Items Policy:**\n\n1. **Bags:** Only clear plastic bags (max 12x12x6 inches or 30x30x15 cm) are permitted.\n2. **Containers:** Glass bottles, metal cans, and thermos bottles are strictly prohibited.\n3. **Equipment:** Professional video/photo cameras and sticks over 1m are prohibited.\n4. **Food:** Outside food is not allowed, except for baby food/formula or specific medical necessities.",
        routeHighlight: 'gate_1'
      };
    }
  }

  // Default Info
  if (language === 'es') {
    return {
      response: "¡Bienvenido al Centro de Operaciones FanPulse 2026! El partido de hoy comienza a las **18:00 (Puertas abren a las 15:00)**. Los trenes de conexión rápida operan cada 4 minutos hacia la estación central. ¿En qué más puedo asistirte hoy?",
      routeHighlight: 'default'
    };
  } else if (language === 'fr') {
    return {
      response: "Bienvenue sur FanPulse 2026 ! Le match d'aujourd'hui débute à **18h00 (Ouverture des portes à 15h00)**. Navettes ferroviaires toutes les 4 minutes vers la gare. Comment puis-je vous aider ?",
      routeHighlight: 'default'
    };
  } else {
    return {
      response: "Welcome to FanPulse 2026 Stadium Hub! Today's match kicks off at **18:00** (Gates open at **15:00**). Express shuttle trains are running every 4 minutes. Let me know if you need assistance with transportation, gates, or safety rules!",
      routeHighlight: 'default'
    };
  }
}

function getMockOpsResponse(scenario: string, language: string): OpsResponse {
  const s = scenario.toLowerCase();

  if (s.includes('gate 4') || s.includes('bottleneck') || s.includes('congest') || s.includes('crowd')) {
    return {
      title: language === 'es' ? 'Mitigación de Congestión en Puerta 4' : language === 'fr' ? 'Atténuation de la Saturation - Porte 4' : 'Gate 4 Congestion Mitigation',
      severity: 'high',
      checklist: [
        {
          task: language === 'es' 
            ? 'Redirigir 10 voluntarios de los Sectores Interiores A/B a las colas de la Puerta 4'
            : language === 'fr'
            ? 'Rediriger 10 bénévoles des secteurs intérieurs A/B vers les files de la Porte 4'
            : 'Redirect 10 volunteers from Inner Sectors A/B to Gate 4 queues to pre-check tickets',
          assignee: 'Volunteer Core',
          priority: 'High'
        },
        {
          task: language === 'es'
            ? 'Actualizar señalización digital en el Sector B para guiar hacia la Puerta 3 (Vacía)'
            : language === 'fr'
            ? 'Mettre à jour la signalisation numérique du Secteur B vers la Porte 3 (Libre)'
            : 'Update digital display boards in Sector B to guide arriving fans to Gate 3 (Empty)',
          assignee: 'Logistics Staff',
          priority: 'High'
        },
        {
          task: language === 'es'
            ? 'Emitir alerta móvil a los aficionados en ruta aconsejando evitar la Puerta 4'
            : language === 'fr'
            ? 'Envoyer une notification push aux fans en route pour éviter la Porte 4'
            : 'Broadcast push alert on tournament app to fans ticketed for Gate 4 recommending alternate entries',
          assignee: 'Logistics Staff',
          priority: 'Medium'
        },
        {
          task: language === 'es'
            ? 'Desplegar oficiales de seguridad adicionales para coordinar líneas de barrera'
            : language === 'fr'
            ? 'Déployer des agents de sécurité supplémentaires pour gérer les barrières'
            : 'Deploy extra security guards to establish barrier queuing lines',
          assignee: 'Security',
          priority: 'High'
        }
      ]
    };
  }

  if (s.includes('spill') || s.includes('waste') || s.includes('trash') || s.includes('sustain') || s.includes('clean')) {
    return {
      title: language === 'es' ? 'Respuesta de Limpieza y Sostenibilidad' : language === 'fr' ? 'Intervention Nettoyage & Gestion des Déchets' : 'Sanitation & Sustainability Response',
      severity: 'low',
      checklist: [
        {
          task: language === 'es'
            ? 'Despachar equipo móvil de recolección al Sector C'
            : language === 'fr'
            ? 'Déployer une équipe mobile de nettoyage dans le Secteur C'
            : 'Dispatch sanitation clean-up crew to Sector C plaza',
          assignee: 'Logistics Staff',
          priority: 'High'
        },
        {
          task: language === 'es'
            ? 'Colocar 4 contenedores de reciclaje adicionales cerca de los puestos de comida'
            : language === 'fr'
            ? 'Placer 4 bacs de recyclage supplémentaires près des stands alimentaires'
            : 'Position 4 temporary sorting bins near the concession counters',
          assignee: 'Volunteer Core',
          priority: 'Medium'
        },
        {
          task: language === 'es'
            ? 'Monitorear niveles de llenado de contenedores mediante sensores IoT del panel'
            : language === 'fr'
            ? 'Surveiller le taux de remplissage des bacs via les capteurs IoT'
            : 'Monitor waste levels on telemetry dashboard',
          assignee: 'Logistics Staff',
          priority: 'Low'
        }
      ]
    };
  }

  // Default incident checklist
  return {
    title: language === 'es' ? 'Respuesta a Incidente General' : language === 'fr' ? 'Plan de Réponse Opérationnel Standard' : 'Standard Incident Response Checklist',
    severity: 'medium',
    checklist: [
      {
        task: language === 'es'
          ? 'Confirmar detalles del incidente con los líderes de zona en el sitio'
          : language === 'fr'
          ? 'Confirmer les détails de l\'incident auprès du responsable de zone'
          : 'Confirm incident details with zone commanders on-site',
        assignee: 'Volunteer Core',
        priority: 'High'
      },
      {
        task: language === 'es'
          ? 'Desplegar voluntarios locales para asegurar el perímetro y guiar a las personas'
          : language === 'fr'
          ? 'Déployer les bénévoles pour guider les flux et sécuriser le périmètre'
          : 'Deploy local area volunteers to redirect spectator flow and provide info',
        assignee: 'Volunteer Core',
        priority: 'Medium'
      },
      {
        task: language === 'es'
          ? 'Alistar equipo de emergencia y puestos de comunicación de radio'
          : language === 'fr'
          ? 'Vérifier les canaux radio et le matériel d\'urgence'
          : 'Prepare emergency response signage and standby radio frequencies',
        assignee: 'Logistics Staff',
        priority: 'High'
      }
    ]
  };
}

/**
 * Generates a response using the Gemini API or falls back to the mock engine if the API key is not configured.
 */
export async function getFanAssistantResponse(query: string, language: string): Promise<FanResponse> {
  if (!ai) {
    // Return mock response immediately
    return getMockFanResponse(query, language);
  }

  try {
    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = `
      You are the official Fan Assistant Concierge for "FanPulse 2026" at the FIFA World Cup Stadium Hub.
      The user is asking a query in the stadium. You must respond in the requested language: "${language}".
      
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
    const text = result.response.text().trim();
    
    // Attempt parsing. If it has markdown wrap, clean it
    let cleanJson = text;
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.substring(7);
    }
    if (cleanJson.endsWith('```')) {
      cleanJson = cleanJson.substring(0, cleanJson.length - 3);
    }
    
    return JSON.parse(cleanJson.trim()) as FanResponse;
  } catch (error) {
    console.error('Error calling Gemini API for Fan Assistant, falling back to mock:', error);
    return getMockFanResponse(query, language);
  }
}

/**
 * Generates an administrative volunteer checklist from a natural language operational scenario.
 */
export async function getOpsScenarioResponse(scenario: string, language: string): Promise<OpsResponse> {
  if (!ai) {
    return getMockOpsResponse(scenario, language);
  }

  try {
    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = `
      You are the lead venue operations coordinator for the 2026 FIFA World Cup.
      An organizer has input a natural language scenario detailing a stadium operations issue:
      Scenario: "${scenario}"

      Generate a checklist of action items for volunteers and staff. Translate the content of your response (title and tasks) to the requested language: "${language}".

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
    const text = result.response.text().trim();
    
    let cleanJson = text;
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.substring(7);
    }
    if (cleanJson.endsWith('```')) {
      cleanJson = cleanJson.substring(0, cleanJson.length - 3);
    }
    
    return JSON.parse(cleanJson.trim()) as OpsResponse;
  } catch (error) {
    console.error('Error calling Gemini API for Ops Scenario, falling back to mock:', error);
    return getMockOpsResponse(scenario, language);
  }
}
