import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, Power, Plus, ShieldAlert, CheckCircle2, AlertTriangle, Trash2, X, Copy, Check } from 'lucide-react';

export default function ApiKeysKillSwitch({ apiKeys, setApiKeys }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newProvider, setNewProvider] = useState('OpenAI');
  const [newQuota, setNewQuota] = useState(1000);
  const [copiedId, setCopiedId] = useState(null);

  const toggleKillSwitch = (id) => {
    setApiKeys(prev => prev.map(k => k.id === id ? { ...k, isActive: !k.isActive } : k));
  };

  const handleCreateKey = (e) => {
    e.preventDefault();
    if (!newKeyName) return;

    const newKey = {
      id: Date.now(),
      name: newKeyName,
      provider: newProvider,
      maskedKey: `sk-${newProvider.toLowerCase().slice(0, 3)}-••••••••${Math.floor(1000 + Math.random() * 9000)}`,
      usage: 0,
      quota: Number(newQuota),
      isActive: true,
    };

    setApiKeys([newKey, ...apiKeys]);
    setNewKeyName('');
    setIsModalOpen(false);
  };

  const copyKey = (id, keyText) => {
    navigator.clipboard.writeText(keyText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">API Keys & Instant Kill-Switch</h2>
          <p className="text-slate-400 text-sm mt-1">Manage gateway keys, enforce token quotas, and instantly revoke compromised credentials.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium shadow-lg shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          <span>Generate New Key</span>
        </button>
      </div>

      {/* API Keys Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Key Name & Provider</th>
                <th className="py-4 px-6">Masked Key</th>
                <th className="py-4 px-6">Monthly Spend / Quota</th>
                <th className="py-4 px-6">Kill-Switch State</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {apiKeys.map((key) => {
                const pct = Math.min(100, Math.round((key.usage / key.quota) * 100));
                const isOverQuota = key.usage >= key.quota;

                return (
                  <motion.tr
                    key={key.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <div className="font-semibold text-white">{key.name}</div>
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono mt-1 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {key.provider}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-300 text-xs">
                      <div className="flex items-center gap-2">
                        <span>{key.maskedKey}</span>
                        <button
                          onClick={() => copyKey(key.id, key.maskedKey)}
                          className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                          title="Copy Key"
                        >
                          {copiedId === key.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-between text-xs mb-1 font-medium">
                        <span className="text-slate-200">${key.usage.toFixed(2)}</span>
                        <span className="text-slate-400">Limit: ${key.quota}</span>
                      </div>
                      <div className="w-36 h-2 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isOverQuota ? 'bg-rose-500 animate-pulse' : pct > 80 ? 'bg-amber-500' : 'bg-indigo-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {/* Animated Spring Kill-Switch Toggle */}
                        <button
                          onClick={() => toggleKillSwitch(key.id)}
                          className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 focus:outline-none ${
                            key.isActive ? 'bg-emerald-500/20 border border-emerald-500/50' : 'bg-rose-500/20 border border-rose-500/50'
                          }`}
                        >
                          <motion.div
                            animate={{ x: key.isActive ? 24 : 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            className={`w-6 h-6 rounded-full shadow-md flex items-center justify-center ${
                              key.isActive ? 'bg-emerald-400 text-slate-950' : 'bg-rose-500 text-white'
                            }`}
                          >
                            <Power className="w-3 h-3 stroke-[3]" />
                          </motion.div>
                        </button>
                        <span className={`text-xs font-semibold ${key.isActive ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {key.isActive ? 'Active' : 'Revoked'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setApiKeys(apiKeys.filter(k => k.id !== key.id))}
                        className="p-2 rounded-xl hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                        title="Delete Key"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Generate Key Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md glass rounded-2xl border border-white/20 shadow-2xl overflow-hidden bg-[#0c0e1a]/95 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Generate New API Key</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateKey} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Key Identifier</label>
                  <input
                    type="text"
                    placeholder="e.g. Production RAG Service"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl glass border border-white/10 bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 uppercase mb-2">AI Provider</label>
                  <select
                    value={newProvider}
                    onChange={(e) => setNewProvider(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl glass border border-white/10 bg-[#0c0e1a] text-white focus:outline-none focus:border-indigo-500 text-sm"
                  >
                    <option value="OpenAI">OpenAI</option>
                    <option value="Anthropic">Anthropic</option>
                    <option value="Google">Google Gemini</option>
                    <option value="Cohere">Cohere</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 uppercase mb-2">Monthly Budget Quota ($)</label>
                  <input
                    type="number"
                    value={newQuota}
                    onChange={(e) => setNewQuota(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl glass border border-white/10 bg-white/5 text-white focus:outline-none focus:border-indigo-500 text-sm font-mono"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl hover:bg-white/10 text-slate-300 font-medium text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/30 transition-all"
                  >
                    Create & Enable
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
