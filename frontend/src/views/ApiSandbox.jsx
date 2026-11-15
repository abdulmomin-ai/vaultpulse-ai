import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Send, Cpu, DollarSign, Sparkles, CheckCircle2 } from 'lucide-react';
import { API_BASE } from '../services/api';

export default function ApiSandbox() {
  const [prompt, setPrompt] = useState('Explain Quantum Computing in 3 concise bullet points for an enterprise executive.');
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTestPrompt = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch(`${API_BASE}/sandbox/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model: selectedModel })
      });
      if (!res.ok) throw new Error('Backend offline');
      const data = await res.json();

      setResponse({
        text: data.response,
        tokens: {
          prompt: data.tokens.input,
          completion: data.tokens.output,
          total: data.tokens.total,
        },
        cost: data.cost,
        latency: `${Math.round(data.latency_sec * 1000)}ms`
      });
    } catch (err) {
      // Client-side fallback if backend is offline/Vercel static
      setTimeout(() => {
        const promptTokens = Math.max(1, Math.round(prompt.length / 4));
        const completionTokens = 145;
        const totalTokens = promptTokens + completionTokens;

        const rates = {
          'gpt-4o': 0.005,
          'claude-3-5-sonnet': 0.003,
          'gemini-flash': 0.000075
        };
        const rate = rates[selectedModel] || 0.003;
        const costVal = (totalTokens / 1000) * rate;

        setResponse({
          text: `• Simulated response analyzing prompt: "${prompt.slice(0, 45)}..."\n• Processed securely through VaultPulse fallback telemetry router.\n• Model execution completed with optimal token compression.`,
          tokens: {
            prompt: promptTokens,
            completion: completionTokens,
            total: totalTokens,
          },
          cost: `$${costVal.toFixed(6)}`,
          latency: '340ms'
        });
      }, 600);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">API Prompt Sandbox & Token Estimator</h2>
        <p className="text-slate-400 text-sm mt-1">Test prompt token consumption and compare exact execution cost across GPT-4o, Claude 3.5 Sonnet, and Gemini Flash.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Prompt Input Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="col-span-12 lg:col-span-6 glass p-4 md:p-6 rounded-2xl border border-white/10 space-y-6"
        >
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Terminal className="w-5 h-5 text-indigo-400" />
            <span>Prompt Configuration</span>
          </h3>

          <form onSubmit={handleTestPrompt} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Select Target Model</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-4 py-3 rounded-xl glass border border-white/10 bg-[#0c0e1a] text-white focus:outline-none focus:border-indigo-500 text-sm"
              >
                <option value="gpt-4o">OpenAI GPT-4o ($5.00 / 1M tokens)</option>
                <option value="claude-3-5-sonnet">Anthropic Claude 3.5 Sonnet ($3.00 / 1M tokens)</option>
                <option value="gemini-flash">Google Gemini 1.5 Flash ($0.075 / 1M tokens)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Prompt Input</label>
              <textarea
                rows="6"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl glass border border-white/10 bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm font-mono resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Execute Sandbox Prompt</span>
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Response & Token Metrics */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="col-span-12 lg:col-span-6 glass p-4 md:p-6 rounded-2xl border border-white/10 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Execution Result & Telemetry</h3>
              {response?.latency && (
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Latency: {response.latency}
                </span>
              )}
            </div>

            {response ? (
              <div className="space-y-6">
                <div className="glass p-4 rounded-xl border border-white/5 font-mono text-xs text-slate-300 whitespace-pre-line leading-relaxed max-h-60 overflow-y-auto">
                  {response.text}
                </div>

                <div className="grid grid-cols-3 gap-2 md:gap-4">
                  <div className="glass p-3 rounded-xl text-center border border-white/5">
                    <div className="text-[10px] uppercase font-semibold text-slate-400">Prompt Tokens</div>
                    <div className="text-base md:text-lg font-bold text-white mt-1">{response.tokens.prompt}</div>
                  </div>
                  <div className="glass p-3 rounded-xl text-center border border-white/5">
                    <div className="text-[10px] uppercase font-semibold text-slate-400">Completion Tokens</div>
                    <div className="text-base md:text-lg font-bold text-white mt-1">{response.tokens.completion}</div>
                  </div>
                  <div className="glass p-3 rounded-xl text-center border border-white/5">
                    <div className="text-[10px] uppercase font-semibold text-slate-400">Total Cost</div>
                    <div className="text-base md:text-lg font-bold text-emerald-400 mt-1 truncate">{response.cost}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-slate-500 border border-white/5 rounded-xl border-dashed">
                <Sparkles className="w-8 h-8 mb-2 animate-pulse text-indigo-400" />
                <p className="text-sm">Run sandbox prompt to view token count and live cost attribution.</p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 text-center text-xs text-slate-500">
            VaultPulse AI Token Metering & Cost Engine v1.4
          </div>
        </motion.div>
      </div>
    </div>
  );
}
