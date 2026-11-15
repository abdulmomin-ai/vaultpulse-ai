import React from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingDown, CheckCircle2, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';

export default function CostOptimizer({ optimizations, setOptimizations }) {
  const toggleOptimization = (id) => {
    setOptimizations(prev => prev.map(opt => opt.id === id ? { ...opt, applied: !opt.applied } : opt));
  };

  const totalSavings = optimizations
    .filter(opt => opt.applied)
    .reduce((acc, curr) => {
      const num = parseInt(curr.savings.replace(/[^0-9]/g, ''));
      return acc + num;
    }, 0);

  return (
    <div className="space-y-8">
      {/* Header - stacks on mobile */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">AI Cost Optimizer & Smart Routing</h2>
          <p className="text-slate-400 text-sm mt-1">Autonomous recommendations to reduce LLM token expenditure without sacrificing output fidelity.</p>
        </div>
        <div className="glass px-4 md:px-5 py-2.5 rounded-xl border border-emerald-500/30 flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-semibold text-slate-400">Active Monthly Savings</div>
            <div className="text-lg font-bold text-emerald-400">${totalSavings.toLocaleString()} /mo</div>
          </div>
        </div>
      </div>

      {/* Recommendations Cards - single column, responsive padding */}
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        {optimizations.map((opt, idx) => (
          <motion.div
            key={opt.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`glass p-4 md:p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
              opt.applied ? 'border-emerald-500/40 bg-emerald-950/10' : 'border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex flex-col gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    opt.impact === 'High' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                    opt.impact === 'Medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                  }`}>
                    {opt.impact} Impact
                  </span>
                  <span className="text-emerald-400 font-mono font-bold text-sm flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Saves {opt.savings}
                  </span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white">{opt.title}</h3>
                <p className="text-slate-400 text-sm">{opt.description}</p>
              </div>

              <div className="flex items-center">
                <button
                  onClick={() => toggleOptimization(opt.id)}
                  className={`w-full md:w-auto px-5 py-3 rounded-xl font-semibold text-sm transition-all shadow-lg flex items-center justify-center gap-2 ${
                    opt.applied
                      ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/30'
                  }`}
                >
                  {opt.applied ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Optimization Applied</span>
                    </>
                  ) : (
                    <>
                      <span>Apply Optimization</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}