import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Shield, Users, Trash2, Zap, Send, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

interface VolunteerTask {
  task: string;
  assignee: 'Volunteer Core' | 'Logistics Staff' | 'Medical' | 'Security';
  priority: 'High' | 'Medium' | 'Low';
  completed?: boolean;
}

interface OpsResponse {
  title: string;
  severity: 'low' | 'medium' | 'high';
  checklist: VolunteerTask[];
}

export const OpsDashboard: React.FC = () => {
  const { language, t } = useLanguage();
  const [scenarioInput, setScenarioInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Incident Action Plan State
  const [activePlan, setActivePlan] = useState<OpsResponse | null>(null);
  const [checklistTasks, setChecklistTasks] = useState<VolunteerTask[]>([]);
  const [dispatchAlert, setDispatchAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Telemetry Metrics State
  const [telemetry, setTelemetry] = useState<any>(null);

  const fetchTelemetry = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/stadium/status');
      if (!res.ok) throw new Error('API server offline');
      const json = await res.json();
      if (json.status === 'success') {
        setTelemetry(json.data);
      }
    } catch (err) {
      console.error('Ops Telemetry fetch error:', err);
      // Fallback data
      setTelemetry({
        gates: [
          { id: 'gate_1', name: 'Gate 1', congestion: 20, waitTime: 2, status: 'clear' },
          { id: 'gate_2', name: 'Gate 2', congestion: 45, waitTime: 8, status: 'moderate' },
          { id: 'gate_3', name: 'Gate 3', congestion: 15, waitTime: 2, status: 'clear' },
          { id: 'gate_4', name: 'Gate 4', congestion: 92, waitTime: 28, status: 'critical' },
          { id: 'gate_5', name: 'Gate 5', congestion: 30, waitTime: 5, status: 'clear' }
        ],
        sustainability: {
          wasteBinsAverageFill: 64,
          recycleRate: 78,
          co2SavedKg: 1240,
          energySolarGenerationKwh: 450
        },
        logisticsAlerts: [
          { id: 1, type: 'warning', message: 'Gate 4 Scanner delay reported', timestamp: '11:15' },
          { id: 2, type: 'info', message: 'Metro Shuttle line capacity increased', timestamp: '11:22' }
        ],
        crowdPathStatus: {
          accessibilityRouteOpen: true,
          totalFansInStadium: 48250,
          maxCapacity: 60000
        }
      });
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scenarioInput.trim()) return;

    setLoading(true);
    setErrorMessage(null);
    setDispatchAlert(false);

    try {
      const res = await fetch('http://localhost:5000/api/ops/scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario: scenarioInput, language })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'API Scenario simulator failed');
      }

      const json = await res.json();
      if (json.status === 'success') {
        const responseData = json.data as OpsResponse;
        setActivePlan(responseData);
        // Map elements to support completion checkbox
        setChecklistTasks(
          responseData.checklist.map(t => ({ ...t, completed: false }))
        );
      }
    } catch (err: any) {
      console.error('Scenario error:', err);
      // Mock Fallback Checklist offline response
      let fallbackPlan: OpsResponse;
      const s = scenarioInput.toLowerCase();
      
      if (s.includes('gate 4') || s.includes('bottleneck') || s.includes('congest')) {
        fallbackPlan = {
          title: "Gate 4 Congestion Mitigation Plan",
          severity: 'high',
          checklist: [
            { task: "Deploy 5 volunteers from Zone B to Gate 4 queues", assignee: 'Volunteer Core', priority: 'High' },
            { task: "Update stadium screens to redirect fans to Gate 3 and 5", assignee: 'Logistics Staff', priority: 'High' },
            { task: "Broadcast push alerts on World Cup App to bypass Gate 4", assignee: 'Logistics Staff', priority: 'Medium' }
          ]
        };
      } else if (s.includes('trash') || s.includes('waste') || s.includes('spill') || s.includes('clean')) {
        fallbackPlan = {
          title: "Plaza Clean-Up & Sorting Response",
          severity: 'low',
          checklist: [
            { task: "Dispatch mobile cleaning carts to plaza sector C", assignee: 'Logistics Staff', priority: 'High' },
            { task: "Add 4 temporary recycle bins near Food Court A", assignee: 'Volunteer Core', priority: 'Medium' }
          ]
        };
      } else {
        fallbackPlan = {
          title: "Local Operational Incident Response",
          severity: 'medium',
          checklist: [
            { task: "Contact regional volunteer dispatch team for verification", assignee: 'Volunteer Core', priority: 'High' },
            { task: "Update incident board status logs in Command Center", assignee: 'Logistics Staff', priority: 'Medium' }
          ]
        };
      }
      
      setActivePlan(fallbackPlan);
      setChecklistTasks(fallbackPlan.checklist.map(t => ({ ...t, completed: false })));
      setErrorMessage('Using local scenario parser. Connect server for complete generative checklists.');
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskCompletion = (index: number) => {
    setChecklistTasks(prev => 
      prev.map((t, idx) => idx === index ? { ...t, completed: !t.completed } : t)
    );
  };

  const handleDispatch = () => {
    setDispatchAlert(true);
    setTimeout(() => {
      setDispatchAlert(false);
    }, 4000);
  };

  if (!telemetry) {
    return (
      <div className="flex justify-center items-center h-[400px] text-indigo-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400 mr-2" />
        Loading Operations Control Room...
      </div>
    );
  }

  // Bar chart data formatted
  const gateDataFormatted = telemetry.gates.map((g: any) => ({
    name: g.id.replace('gate_', 'G').toUpperCase(),
    'Congestion (%)': g.congestion,
    'Wait Time (min)': g.waitTime
  }));

  // Pie chart data formatted
  const wastePieData = [
    { name: 'Recycled waste', value: telemetry.sustainability.recycleRate, color: '#10b981' },
    { name: 'Landfill waste', value: 100 - telemetry.sustainability.recycleRate, color: '#ef4444' }
  ];

  return (
    <div className="space-y-8">
      {/* Top operational telemetry cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-indigo-950/30 flex items-center gap-4">
          <div className="bg-indigo-600/20 p-3 rounded-xl border border-indigo-500/20 text-indigo-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block mb-0.5">Total Fans Inside</span>
            <span className="text-xl font-bold tracking-tight text-indigo-100">
              {telemetry.crowdPathStatus.totalFansInStadium.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Capacity: {Math.round((telemetry.crowdPathStatus.totalFansInStadium / telemetry.crowdPathStatus.maxCapacity) * 100)}%
            </span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-indigo-950/30 flex items-center gap-4">
          <div className="bg-emerald-600/20 p-3 rounded-xl border border-emerald-500/20 text-emerald-400">
            <Trash2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block mb-0.5">{t('recycleRate')}</span>
            <span className="text-xl font-bold tracking-tight text-emerald-400">
              {telemetry.sustainability.recycleRate}%
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Target: 75% for Green Cup</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-indigo-950/30 flex items-center gap-4">
          <div className="bg-amber-600/20 p-3 rounded-xl border border-amber-500/20 text-amber-400">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block mb-0.5">{t('solarArray')}</span>
            <span className="text-xl font-bold tracking-tight text-amber-400">
              {telemetry.sustainability.energySolarGenerationKwh} kWh
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Stiffness Load: Self-powered</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-indigo-950/30 flex items-center gap-4">
          <div className="bg-sky-600/20 p-3 rounded-xl border border-sky-500/20 text-sky-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block mb-0.5">Accessibility Status</span>
            <span className="text-xl font-bold tracking-tight text-sky-400">
              {telemetry.crowdPathStatus.accessibilityRouteOpen ? '100% Operational' : 'Alert: Obstruction'}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Ramps G2 & G5 online</span>
          </div>
        </div>
      </div>

      {/* Graphs and Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Gate Congestion Telemetry */}
        <div className="lg:col-span-8 glass-panel rounded-3xl p-6 border border-indigo-950/40">
          <h3 className="text-lg font-bold text-indigo-100 mb-6">{t('gateTitle')}</h3>
          <div className="w-full h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={gateDataFormatted}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid stroke="#1e1b4b" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#131230',
                    borderColor: '#2e2b66',
                    borderRadius: '8px',
                    color: '#e2e8f0'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
                <Bar dataKey="Congestion (%)" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Wait Time (min)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Waste / Recycling separation load */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 border border-indigo-950/40">
          <h3 className="text-lg font-bold text-indigo-100 mb-6">{t('wasteTitle')}</h3>
          <div className="flex flex-col items-center justify-center">
            <div className="w-full h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={wastePieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {wastePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#131230',
                      borderColor: '#2e2b66',
                      borderRadius: '8px',
                      color: '#e2e8f0'
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 w-full bg-slate-900/60 p-4 rounded-xl border border-indigo-950/50 text-center">
              <span className="text-xs text-slate-400 block mb-1">{t('binLevel')}</span>
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-black text-emerald-400">
                  {telemetry.sustainability.wasteBinsAverageFill}%
                </span>
                <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded-full bg-emerald-950/30 border border-emerald-500/20">
                  Fill OK
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Incident Response Volunteer Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Scenario Input */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 border border-indigo-950/40">
          <h3 className="text-lg font-bold text-indigo-100 mb-1">{t('simulatorTitle')}</h3>
          <p className="text-xs text-slate-400 mb-6">{t('simulatorSub')}</p>

          <form onSubmit={handleSimulate} className="space-y-4">
            <div>
              <label htmlFor="scenarioText" className="sr-only">Incident Scenario Description</label>
              <textarea
                id="scenarioText"
                value={scenarioInput}
                onChange={(e) => setScenarioInput(e.target.value)}
                placeholder="e.g., Gate 4 bottleneck detected. 3 volunteer stations need reallocation to divert fans to G3..."
                rows={4}
                className="w-full glass-input rounded-xl p-4 text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none resize-none"
                maxLength={1000}
                required
                disabled={loading}
              />
            </div>

            {/* Prompt Helper Shortcuts */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setScenarioInput("Gate 4 has critical crowding. Divert incoming fans from Metro Sector B to Gates 3 and 5.")}
                className="text-[10px] px-2 py-1 rounded bg-slate-800/40 hover:bg-slate-700/60 border border-indigo-950/80 text-slate-300"
              >
                🚨 Gate 4 Bottleneck
              </button>
              <button
                type="button"
                onClick={() => setScenarioInput("Trash bins in Plaza Sector C are full. Dispatch cleaners and sorting bins immediately.")}
                className="text-[10px] px-2 py-1 rounded bg-slate-800/40 hover:bg-slate-700/60 border border-indigo-950/80 text-slate-300"
              >
                ♻️ Sustainability Waste Spill
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || !scenarioInput.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white font-bold py-3 px-4 rounded-xl transition-all glow-purple flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Generating Checklist...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  {t('simulateBtn')}
                </>
              )}
            </button>
          </form>

          {errorMessage && (
            <div className="mt-4 p-3 bg-indigo-950/30 border border-indigo-500/20 rounded-xl flex items-start gap-2 text-xs text-indigo-300">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-indigo-400" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Action checklist Display */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 border border-indigo-950/40 min-h-[300px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-indigo-950 pb-4 mb-4">
              <h3 className="font-bold text-indigo-100 tracking-wide">
                {activePlan ? activePlan.title : 'Incident Action Plan Checklist'}
              </h3>
              
              {activePlan && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">{t('severity')}:</span>
                  <span className={`text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full border ${
                    activePlan.severity === 'high' ? 'bg-red-950/40 border-red-500/30 text-red-400' :
                    activePlan.severity === 'medium' ? 'bg-amber-950/40 border-amber-500/30 text-amber-400' :
                    'bg-green-950/40 border-green-500/30 text-green-400'
                  }`}>
                    {activePlan.severity}
                  </span>
                </div>
              )}
            </div>

            {checklistTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500">
                <AlertTriangle className="w-12 h-12 mb-3 text-slate-600" />
                <p className="text-sm max-w-xs">{t('emptyChecklist')}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {checklistTasks.map((task, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all duration-150 ${
                      task.completed
                        ? 'bg-slate-950/20 border-slate-900/60 text-slate-500 line-through'
                        : 'bg-slate-900/50 border-indigo-950/50 text-slate-200 hover:border-indigo-900/60'
                    }`}
                  >
                    <input
                      type="checkbox"
                      id={`task-${idx}`}
                      checked={task.completed}
                      onChange={() => toggleTaskCompletion(idx)}
                      className="w-4 h-4 mt-0.5 text-indigo-600 rounded bg-slate-950 border-indigo-900 focus:ring-indigo-500 cursor-pointer"
                    />
                    
                    <div className="flex-1">
                      <label htmlFor={`task-${idx}`} className="text-xs font-semibold block select-none cursor-pointer">
                        {task.task}
                      </label>
                      
                      <div className="flex items-center gap-4 mt-2 text-[10px]">
                        <span className="text-slate-400">
                          {t('assignee')}: <strong className="text-indigo-300">{task.assignee}</strong>
                        </span>
                        <span className={`font-semibold ${
                          task.priority === 'High' ? 'text-red-400' :
                          task.priority === 'Medium' ? 'text-amber-400' :
                          'text-green-400'
                        }`}>
                          {t('priority')}: {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {checklistTasks.length > 0 && (
            <div className="mt-6 pt-4 border-t border-indigo-950 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-xs text-slate-400">
                {checklistTasks.filter(t => t.completed).length} of {checklistTasks.length} tasks marked resolved.
              </p>
              
              <div className="relative">
                <button
                  onClick={handleDispatch}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-5 rounded-xl transition-all glow-green flex items-center justify-center gap-2 cursor-pointer text-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Dispatch Action Plan
                </button>

                {dispatchAlert && (
                  <div className="absolute right-0 bottom-12 w-64 bg-slate-900 border border-emerald-500/30 p-3 rounded-xl shadow-xl z-20 flex items-center gap-2 text-[11px] text-emerald-400 animate-bounce">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{t('dispatchSuccess')}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
