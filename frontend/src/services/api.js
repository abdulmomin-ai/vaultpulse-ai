export const MOCK_WORKSPACES = [
  { id: 1, name: 'Production (US-East)' },
  { id: 2, name: 'Staging & QA' },
  { id: 3, name: 'Enterprise R&D' },
];

export const MOCK_KPIS = {
  monthlySpend: 4284.50,
  spendChange: '+14.2%',
  tokensBurned: '184.2M',
  tokensChange: '+8.4%',
  activeKeys: 14,
  killedKeysCount: 2,
  costEfficiency: '92.4%',
  efficiencyChange: '+3.1%',
};

export const MOCK_CHART_DATA = [
  { time: '00:00', spend: 45, tokens: 1.2 },
  { time: '03:00', spend: 30, tokens: 0.8 },
  { time: '06:00', spend: 65, tokens: 2.1 },
  { time: '09:00', spend: 180, tokens: 7.5 },
  { time: '12:00', spend: 320, tokens: 14.2 },
  { time: '15:00', spend: 280, tokens: 11.8 },
  { time: '18:00', spend: 210, tokens: 8.9 },
  { time: '21:00', spend: 140, tokens: 5.4 },
];

export const MOCK_API_KEYS = [
  { id: 1, name: 'Production API Key - OpenAI GPT-4o', provider: 'OpenAI', maskedKey: 'sk-proj-••••••••9482', usage: 1420.50, quota: 2000, isActive: true },
  { id: 2, name: 'Claude 3.5 Sonnet - Backend Service', provider: 'Anthropic', maskedKey: 'sk-ant-••••••••1109', usage: 1850.00, quota: 1500, isActive: true },
  { id: 3, name: 'Gemini 1.5 Flash - Document Parsing', provider: 'Google', maskedKey: 'AIzaSy••••••••8841', usage: 320.40, quota: 1000, isActive: true },
  { id: 4, name: 'Legacy QA Embeddings Key', provider: 'OpenAI', maskedKey: 'sk-proj-••••••••3310', usage: 694.00, quota: 500, isActive: false },
];

export const MOCK_OPTIMIZATIONS = [
  { id: 1, title: 'Route simple summarization to Gemini Flash', savings: '$1,240 /mo', impact: 'High', applied: false, description: 'Redirect 65% of summarization requests from GPT-4o to Gemini 1.5 Flash without quality degradation.' },
  { id: 2, title: 'Enable semantic caching for repeated prompts', savings: '$850 /mo', impact: 'Medium', applied: true, description: 'Cache frequent knowledge base queries in Redis with 0.85 similarity threshold.' },
  { id: 3, title: 'Downgrade embedding model from ada-002 to 3-small', savings: '$310 /mo', impact: 'Low', applied: false, description: 'Switch vector embedding pipeline to text-embedding-3-small for 5x lower per-token cost.' },
];

export const MOCK_ALERTS = [
  { id: 1, title: 'Budget Threshold Reached', description: 'Anthropic Workspace reached 85% of monthly $2,000 limit.', time: '12 mins ago', type: 'warning', active: true },
  { id: 2, title: 'Auto Kill-Switch Triggered', description: 'OpenAI Legacy QA Key exceeded daily quota and was automatically disabled.', time: '2 hours ago', type: 'danger', active: true },
  { id: 3, title: 'Unusual Token Spike Detected', description: 'GPT-4o token volume spiked by 340% over baseline in US-East.', time: '5 hours ago', type: 'info', active: false },
];

export const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
