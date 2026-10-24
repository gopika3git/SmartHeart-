import React, { useState } from 'react';
import axios from 'axios';
import { 
  Heart, 
  Activity, 
  ShieldAlert, 
  CheckCircle2, 
  RefreshCw, 
  ChevronRight, 
  Sliders, 
  Zap, 
  FileText,
  UserCheck,
  Stethoscope,
  TrendingUp
} from 'lucide-react';

const FEATURE_CONFIGS = [
  // Category 1: Vitals & Demographics
  { key: 'age', name: 'Age', category: 'vitals', min: 1, max: 120, default: 55, unit: 'yrs' },
  { key: 'sex', name: 'Sex', category: 'vitals', type: 'select', options: [{ label: 'Female', value: 0 }, { label: 'Male', value: 1 }], default: 1 },
  { key: 'trestbps', name: 'Resting Blood Pressure', category: 'vitals', min: 80, max: 200, default: 130, unit: 'mmHg' },
  { key: 'chol', name: 'Serum Cholesterol', category: 'vitals', min: 100, max: 600, default: 240, unit: 'mg/dl' },

  // Category 2: ECG & Exercise
  { key: 'cp', name: 'Chest Pain Type', category: 'ecg', type: 'select', options: [
      { label: '0: Typical Angina', value: 0 },
      { label: '1: Atypical Angina', value: 1 },
      { label: '2: Non-anginal Pain', value: 2 },
      { label: '3: Asymptomatic', value: 3 }
    ], default: 0 },
  { key: 'fbs', name: 'Fasting Blood Sugar > 120 mg/dl', category: 'ecg', type: 'select', options: [{ label: 'No (<= 120)', value: 0 }, { label: 'Yes (> 120)', value: 1 }], default: 0 },
  { key: 'restecg', name: 'Resting ECG Results', category: 'ecg', type: 'select', options: [
      { label: '0: Normal', value: 0 },
      { label: '1: ST-T Wave Abnormality', value: 1 },
      { label: '2: Left Ventricular Hypertrophy', value: 2 }
    ], default: 0 },
  { key: 'thalach', name: 'Max Heart Rate Achieved', category: 'ecg', min: 60, max: 220, default: 150, unit: 'bpm' },

  // Category 3: Advanced Diagnostic & Vessels
  { key: 'exang', name: 'Exercise Induced Angina', category: 'advanced', type: 'select', options: [{ label: 'No', value: 0 }, { label: 'Yes', value: 1 }], default: 0 },
  { key: 'oldpeak', name: 'ST Depression (Oldpeak)', category: 'advanced', step: 0.1, min: 0, max: 6.2, default: 1.0, unit: 'mm' },
  { key: 'slope', name: 'Slope of Peak Exercise ST', category: 'advanced', type: 'select', options: [
      { label: '0: Upsloping', value: 0 },
      { label: '1: Flat', value: 1 },
      { label: '2: Downsloping', value: 2 }
    ], default: 1 },
  { key: 'ca', name: 'Major Vessels (Flourosopy)', category: 'advanced', min: 0, max: 4, default: 0, unit: 'vessels' }
];

// Presets for fast input switching
const PRESETS = {
  normal: { age: 41, sex: 0, cp: 1, trestbps: 110, chol: 175, fbs: 0, restecg: 0, thalach: 180, exang: 0, oldpeak: 0.0, slope: 0, ca: 0 },
  highRisk: { age: 67, sex: 1, cp: 0, trestbps: 160, chol: 286, fbs: 0, restecg: 2, thalach: 108, exang: 1, oldpeak: 1.5, slope: 1, ca: 3 }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('vitals');
  const [formData, setFormData] = useState(() => {
    const initial = {};
    FEATURE_CONFIGS.forEach(f => initial[f.key] = f.default);
    return initial;
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: Number(value) }));
  };

  const applyPreset = (type) => {
    setFormData(PRESETS[type]);
    setResult(null);
    setError('');
  };

  const handlePredict = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');

    const featuresList = FEATURE_CONFIGS.map(f => formData[f.key]);

    try {
      const response = await axios.post('http://127.0.0.1:8000/predict', {
        features: featuresList
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to connect to the prediction server.');
    } finally {
      setLoading(false);
    }
  };

  // Rotation angle for needle gauge (-90deg for low risk, +90deg for high risk)
  const needleAngle = result ? (result.prediction === 1 ? 65 : -65) : 0;

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Background Decorative Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-tr from-rose-600 to-rose-400 rounded-xl shadow-lg shadow-rose-900/30 text-white">
              <Heart className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                HealthPredict AI
              </span>
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400">
                Command Center
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 bg-slate-800/60 px-3.5 py-1.5 rounded-full border border-slate-700/60 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>FastAPI Port 8000</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Left Column: Form & Presets */}
        <section className="lg:col-span-7 space-y-6">
          
          {/* Presets Toolbar */}
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-xl flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center space-x-2 text-xs text-slate-400 font-medium">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Quick Patient Profiles:</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => applyPreset('normal')}
                className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all font-medium flex items-center space-x-1.5"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Normal Case</span>
              </button>
              <button
                onClick={() => applyPreset('highRisk')}
                className="text-xs px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-all font-medium flex items-center space-x-1.5"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>High Risk Case</span>
              </button>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-xl space-y-6">
            
            {/* Tab Navigation */}
            <div className="flex border-b border-slate-800/80 pb-3 gap-2">
              {[
                { id: 'vitals', label: '1. Vitals', icon: Activity },
                { id: 'ecg', label: '2. ECG & Exercise', icon: Stethoscope },
                { id: 'advanced', label: '3. Advanced Test', icon: Sliders }
              ].map(tab => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 text-xs font-semibold px-4 py-2 rounded-xl transition-all ${
                      active 
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-md shadow-rose-950/20' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {FEATURE_CONFIGS.filter(f => f.category === activeTab).map((field) => (
                <div key={field.key} className="space-y-1.5 bg-slate-800/20 p-3.5 rounded-xl border border-slate-800/60">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-medium text-slate-300">{field.name}</label>
                    {field.unit && <span className="text-slate-500">{field.unit}</span>}
                  </div>

                  {field.type === 'select' ? (
                    <select
                      value={formData[field.key]}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className="w-full bg-slate-900/80 border border-slate-700/60 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500 transition-colors"
                    >
                      {field.options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="number"
                      step={field.step || 1}
                      min={field.min}
                      max={field.max}
                      value={formData[field.key]}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className="w-full bg-slate-900/80 border border-slate-700/60 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500 transition-colors"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex gap-3">
              <button
                onClick={handlePredict}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 hover:opacity-95 text-white font-semibold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-rose-950/50 flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Evaluating Classifier...</span>
                  </>
                ) : (
                  <>
                    <span>Execute Heart Prediction</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Right Column: Dynamic Gauge & Results */}
        <section className="lg:col-span-5 flex flex-col space-y-6">
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-xl flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
                <div className="flex items-center space-x-2 text-slate-300">
                  <TrendingUp className="w-4 h-4 text-rose-500" />
                  <h2 className="text-sm font-semibold tracking-wide">Risk Assessment Gauge</h2>
                </div>
                <span className="text-xs text-slate-500 font-mono">Model: Random Forest / ML</span>
              </div>

              {/* Gauge Meter Visualizer */}
              <div className="py-8 flex flex-col items-center justify-center relative">
                <svg className="w-64 h-36" viewBox="0 0 200 110">
                  {/* Gauge Arc Background */}
                  <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="18"
                    strokeLinecap="round"
                  />
                  {/* Gauge Gradient Arc */}
                  <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="url(#gaugeGradient)"
                    strokeWidth="18"
                    strokeLinecap="round"
                    strokeDasharray="251.2"
                    strokeDashoffset="0"
                  />
                  <defs>
                    <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="50%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#f43f5e" />
                    </linearGradient>
                  </defs>

                  {/* Dynamic Needle */}
                  <g transform={`rotate(${needleAngle}, 100, 100)`} className="transition-transform duration-700 ease-out">
                    <polygon points="96,100 104,100 100,25" fill="#ffffff" />
                    <circle cx="100" cy="100" r="8" fill="#ffffff" />
                    <circle cx="100" cy="100" r="4" fill="#0f172a" />
                  </g>
                </svg>

                <div className="flex justify-between w-64 text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-1 px-2">
                  <span className="text-emerald-400">Low Risk</span>
                  <span className="text-amber-400">Moderate</span>
                  <span className="text-rose-400">High Risk</span>
                </div>
              </div>

              {/* Result Display Box */}
              {error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs flex items-start space-x-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {result && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className={`p-5 rounded-xl border ${
                    result.prediction === 1 
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' 
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  }`}>
                    <div className="flex items-center space-x-3">
                      {result.prediction === 1 ? (
                        <ShieldAlert className="w-8 h-8 text-rose-500 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-8 h-8 text-emerald-500 shrink-0" />
                      )}
                      <div>
                        <div className="text-[10px] uppercase font-bold tracking-wider opacity-75">Diagnostic Evaluation</div>
                        <div className="text-lg font-bold">
                          {result.prediction === 1 ? 'High Risk Detected' : 'Low Risk / Normal'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-800/80 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Server Status:</span>
                      <span className="text-slate-200 font-mono capitalize">{result.status}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Predicted Target Class:</span>
                      <span className="text-slate-200 font-mono font-bold">{result.prediction}</span>
                    </div>
                  </div>
                </div>
              )}

              {!result && !error && (
                <div className="text-center py-6 text-slate-500 text-xs space-y-2">
                  <FileText className="w-8 h-8 mx-auto text-slate-600 stroke-1" />
                  <p>Click "Execute Heart Prediction" or select a preset profile above to analyze clinical indicators.</p>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-slate-800/80 text-[11px] text-slate-500 text-center">
              Scikit-Learn Standardized Model &bull; Real-time FastAPI Output
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}