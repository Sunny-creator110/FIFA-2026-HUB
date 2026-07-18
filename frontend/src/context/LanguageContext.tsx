import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type LanguageType = 'en' | 'es' | 'fr';

interface Translations {
  [key: string]: {
    en: string;
    es: string;
    fr: string;
  };
}

const translations: Translations = {
  appTitle: {
    en: "FanPulse 2026: FIFA World Cup Stadium Hub",
    es: "FanPulse 2026: Centro de Estadios de la Copa Mundial FIFA",
    fr: "FanPulse 2026: Centre de Stades de la Coupe du Monde FIFA"
  },
  subTitle: {
    en: "Lusail Stadium Operational Intelligence & Concierge",
    es: "Inteligencia Operativa y Conserje del Estadio Lusail",
    fr: "Intelligence Opérationnelle et Concierge du Stade de Lusail"
  },
  fanMode: {
    en: "Fan Concierge Hub",
    es: "Centro de Conserjería para Fanáticos",
    fr: "Centre de Conciergerie pour Fans"
  },
  opsMode: {
    en: "Venue Operations Hub",
    es: "Centro de Operaciones del Estadio",
    fr: "Centre d'Opérations du Stade"
  },
  aiAssistantHeader: {
    en: "AI Stadium Assistant",
    es: "Asistente de IA del Estadio",
    fr: "Assistant IA du Stade"
  },
  aiAssistantSub: {
    en: "Ask about matches, transit, gates, rules, or accessible paths in English, Spanish, or French.",
    es: "Pregunte sobre partidos, tránsito, puertas, reglas o caminos accesibles en inglés, español o francés.",
    fr: "Posez vos questions sur les matchs, transports, portes, règles ou accès PMR en anglais, espagnol ou français."
  },
  placeholderQuery: {
    en: "e.g., Is Gate 4 congested? Where is the accessibility ramp?",
    es: "ej. ¿Está congestionada la Puerta 4? ¿Dónde está la rampa de acceso?",
    fr: "ex. La Porte 4 est-elle encombrée ? Où se trouve la rampe d'accès ?"
  },
  send: {
    en: "Send Query",
    es: "Enviar Consulta",
    fr: "Envoyer la requête"
  },
  consulting: {
    en: "Consulting AI Concierge...",
    es: "Consultando al Conserje de IA...",
    fr: "Consultation du Concierge IA..."
  },
  mapHeader: {
    en: "Interactive Stadium Layout Map",
    es: "Mapa de Distribución del Estadio Interactivo",
    fr: "Plan Interactif du Stade"
  },
  mapSub: {
    en: "Click on gates (G1-G5) or zones to highlight routes. Accessibility route is highlighted in blue.",
    es: "Haga clic en las puertas (G1-G5) o zonas para resaltar rutas. La ruta accesible se resalta en azul.",
    fr: "Cliquez sur les portes (G1-G5) ou zones pour tracer les chemins. La voie accessible PMR est en bleu."
  },
  opsHeader: {
    en: "Venue Operational Intelligence Dashboard",
    es: "Panel de Inteligencia Operativa del Estadio",
    fr: "Tableau de Bord Opérationnel du Stade"
  },
  opsSub: {
    en: "Real-time Telemetry Control Room",
    es: "Sala de Control de Telemetría en Tiempo Real",
    fr: "Salle de Contrôle des Télémétries en Temps Réel"
  },
  gateTitle: {
    en: "Gate Load & Estimated Queues",
    es: "Carga de Puertas y Colas Estimadas",
    fr: "Charge des Portes & Files d'Attente Estimées"
  },
  wasteTitle: {
    en: "Sustainability & Smart Waste Telemetry",
    es: "Telemetría de Sostenibilidad y Residuos Inteligentes",
    fr: "Télémétrie de Durabilité & Tri Intelligent"
  },
  binLevel: {
    en: "Waste Bin Average Fill Level",
    es: "Nivel de Llenado Promedio del Contenedor",
    fr: "Taux de Remplissage Moyen des Bacs"
  },
  recycleRate: {
    en: "Recycling Separation Rate",
    es: "Tasa de Separación de Reciclaje",
    fr: "Taux de Séparation du Tri"
  },
  solarArray: {
    en: "Solar Array Generation",
    es: "Generación de Paneles Solares",
    fr: "Production du Parc Solaire"
  },
  co2Saved: {
    en: "Total CO2 Offset",
    es: "Compensación Total de CO2",
    fr: "Total de CO2 Évité"
  },
  simulatorTitle: {
    en: "Operational Volunteer Action Simulator",
    es: "Simulador de Acción de Voluntarios",
    fr: "Simulateur d'Actions des Bénévoles"
  },
  simulatorSub: {
    en: "Enter a live incident scenario to generate a localized staff action checklist.",
    es: "Ingrese un incidente en vivo para generar una lista de acciones para el personal.",
    fr: "Saisissez un incident pour générer une liste de tâches pour les équipes."
  },
  simulateBtn: {
    en: "Generate & Dispatch Checklist",
    es: "Generar y Despachar Lista de Tareas",
    fr: "Générer & Distribuer la Tâche"
  },
  severity: {
    en: "Severity Level",
    es: "Nivel de Severidad",
    fr: "Niveau de Gravité"
  },
  assignee: {
    en: "Assignee",
    es: "Asignado",
    fr: "Affectation"
  },
  priority: {
    en: "Priority",
    es: "Prioridad",
    fr: "Priorité"
  },
  emptyChecklist: {
    en: "No active incidents. Enter a scenario above to generate volunteer tasks.",
    es: "No hay incidentes activos. Ingrese un escenario para generar tareas.",
    fr: "Aucun incident en cours. Saisissez un scénario pour générer des tâches."
  },
  dispatchSuccess: {
    en: "Tasks dispatched to volunteer devices!",
    es: "¡Tareas enviadas a los dispositivos de los voluntarios!",
    fr: "Tâches envoyées aux terminaux des bénévoles !"
  },
  suggestGate: {
    en: "Gate 4 queue status",
    es: "Estado de cola en Puerta 4",
    fr: "Statut file d'attente Porte 4"
  },
  suggestAccess: {
    en: "Wheelchair accessibility",
    es: "Accesibilidad para sillas de ruedas",
    fr: "Rampes d'accès PMR"
  },
  suggestBags: {
    en: "Bag policy & restrictions",
    es: "Política de bolsas y restricciones",
    fr: "Objets interdits et sacs"
  },
  suggestTransit: {
    en: "Match kickoff & Shuttle schedule",
    es: "Inicio de partido y autobuses",
    fr: "Horaire match & navettes métro"
  }
};

interface LanguageContextProps {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<LanguageType>('en');

  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
