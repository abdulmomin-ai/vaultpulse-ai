import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Cpu, KeyRound, TrendingUp, ArrowUpRight, Zap, ShieldCheck } from 'lucide-react';
import { MOCK_KPIS, MOCK_CHART_DATA } from '../services/api';

export default function LiveOverview({ apiKeys }) {
  const activeKeysCount = apiKeys.filter(k => k.isActive).length;

  const kpis = [
    { title: 'Monthly FinOps Spend', value: `$${MOCK_KPIS.monthlySpend.toLocaleString()}`, change: MOCK_KPIS.spendChange, icon: DollarSign, color: 'from-emerald-500 to-teal-500' },
    { title: 'Tokens Burned (MTD)', value: MOCK_KPIS.tokensBurned, change: MOCK_KPIS.tokensChange, icon: Cpu, color: 'from-indigo-500 to-blue-500' },
    { title: 'Active API Keys', value: `${activeKeysCount} / ${apiKeys.length}`, change: '2 killed today', icon: KeyRound, color: 'from-purple-500 to-pink-500' },
    { title: 'Cost Efficiency Score', value: MOCK_KPIS.costEfficiency, change: MOCK_KPIS.efficiencyChange, icon: ShieldCheck, color: 'from-amber-500 to-orange-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Live Telemetry Overview</h2>
          <p className="text-slate-400 text-sm mt-1">Real-time token burn telemetry, model cost attribution, and kill-switch status.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-xl glass border border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Auto-Kill Guard Active
          </span>
        </div>
      </div>

      {/* 4 Animated KPI Cards (Mobile-first responsive grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, type: 'spring', stiffness: 200, damping: 20 }}
              whileHover={{ scale: 1.02, translateY: -4 }}
              className="glass p-6 rounded-2xl border border-white/10 relative overflow-hidden group shadow-xl"
            >
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all duration-500" />
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${kpi.color} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" />
                  {kpi.change}
                </span>
              </div>
              <h3 className="text-slate-400 text-xs font-medium uppercase tracking-wider">{kpi.title}</h3>
              <p className="text-3xl font-extrabold mt-2 tracking-tight">{kpi.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Bento Grid: Live Token Burn Chart & Provider Spend Breakdown */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 md:gap-6">
        {/* Live Token Burn Spline Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="col-span-12 xl:col-span-8 glass p-4 md:p-6 rounded-2xl border border-white/10 relative"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-2">
            <div>
              <h3 className="text-lg md:text-xl font-bold">Live Token Burn Velocity</h3>
              <p className="text-xs text-slate-400 mt-0.5">Hourly token consumption and dollar spend across models</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-500" />
              <span className="text-xs text-slate-300 font-medium">Cost ($)</span>
              <span className="w-3 h-3 rounded-full bg-purple-400 ml-3" />
              <span className="text-xs text-slate-300 font-medium">Tokens (M)</span>
            </div>
          </div>

          {/* SVG Animated Telemetry Chart */}
          <div className="h-64 md:h-72 w-full relative flex items-end pt-8 px-2">
            <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 700 200">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
                d="M 0,150 Q 100,80 200,110 T 400,60 T 600,40 T 700,80"
                fill="none"
                stroke="#6366f1"
                strokeWidth="3"
              />
              <motion.path
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                d="M 0,150 Q 100,80 200,110 T 400,60 T 600,40 T 700,80 L 700,200 L 0,200 Z"
                fill="url(#chartGradient)"
              />
            </svg>

            {/* X-Axis labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] md:text-[11px] font-mono text-slate-500 border-t border-white/10 pt-2">
              {MOCK_CHART_DATA.map((d, i) => (
                <span key={i}>{d.time}</span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Model Cost Breakdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="col-span-12 xl:col-span-4 glass p-4 md:p-6 rounded-2xl border border-white/10 flex flex-col justify-between"
        >
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-1">Provider Attribution</h3>
            <p className="text-xs text-slate-400 mb-4 md:mb-6">Cost breakdown by AI foundation</p>

            <div className="space-y-3 md:space-y-4">
              {[
                { name: 'OpenAI (GPT-4o / 3.5)', spend: '$2,410.00', pct: 56, color: 'bg-emerald-500' },
                { name: 'Anthropic (Claude 3.5 Sonnet)', spend: '$1,480.50', pct: 34, color: 'bg-purple-500' },
                { name: 'Google (Gemini 1.5 Flash)', spend: '$394.00', pct: 10, color: 'bg-amber-500' },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-200 truncate mr-2">{item.name}</span>
                    <span className="font-bold text-white shrink-0">{item.spend}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.pct}%` }}
                      transition={{ duration: 1, delay: 0.4 + idx * 0.1 }}
                      className={`h-full rounded-full ${item.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>Optimization Potential</span>
            <span className="text-indigo-400 font-semibold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> Save ~$1,240/mo
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
