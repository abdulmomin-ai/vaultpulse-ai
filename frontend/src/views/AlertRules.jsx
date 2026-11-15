import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, ShieldAlert, CheckCircle2, AlertTriangle, Plus, Trash2, Mail, MessageSquare } from 'lucide-react';

export default function AlertRules({ alerts, setAlerts }) {
  const [budgetThreshold, setBudgetThreshold] = useState(85);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [slackWebhook, setSlackWebhook] = useState(true);
  const [autoKill, setAutoKill] = useState(true);

  const toggleAlertActive = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Alert Rules & Webhooks</h2>
        <p className="text-slate-400 text-sm mt-1">Configure automated budget threshold triggers, notification channels, and fail-safes.</p>
      </div>

      {/* Grid: Threshold Sliders & Webhooks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Threshold Configuration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="col-span-12 lg:col-span-7 glass p-6 rounded-2xl border border-white/10 space-y-6"
        >
          <h3 className="text-xl font-bold">Budget Threshold Triggers</h3>
          <p className="text-sm text-slate-400">Trigger automated alerts and kill-switches when monthly spending reaches a specific percentage.</p>

          <div className="space-y-4 pt-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-sm">Warning Threshold</span>
              <span className="font-mono text-indigo-400 font-bold text-lg">{budgetThreshold}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="99"
              value={budgetThreshold}
              onChange={(e) => setBudgetThreshold(e.target.value)}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <div className="flex justify-between text-xs font-mono text-slate-500">
              <span>50% (Early Notice)</span>
              <span>85% (Recommended)</span>
              <span>99% (Emergency)</span>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 space-y-4">
            <h4 className="font-semibold text-sm">Notification Channels & Action</h4>

            <div className="flex items-center justify-between p-4 rounded-xl glass border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Email Alerts (CTO & DevOps)</div>
                  <div className="text-xs text-slate-400">Send instant email when threshold is crossed</div>
                </div>
              </div>
              <button
                onClick={() => setEmailAlerts(!emailAlerts)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${emailAlerts ? 'bg-indigo-600' : 'bg-white/10'}`}
              >
                <motion.div animate={{ x: emailAlerts ? 24 : 0 }} className="w-4 h-4 rounded-full bg-white shadow-md" />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl glass border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Slack Webhook (#finops-alerts)</div>
                  <div className="text-xs text-slate-400">Post rich webhook card to Slack channel</div>
                </div>
              </div>
              <button
                onClick={() => setSlackWebhook(!slackWebhook)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${slackWebhook ? 'bg-indigo-600' : 'bg-white/10'}`}
              >
                <motion.div animate={{ x: slackWebhook ? 24 : 0 }} className="w-4 h-4 rounded-full bg-white shadow-md" />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl glass border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Autonomous Kill-Switch</div>
                  <div className="text-xs text-slate-400">Instantly revoke API keys exceeding 100% quota</div>
                </div>
              </div>
              <button
                onClick={() => setAutoKill(!autoKill)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${autoKill ? 'bg-rose-600' : 'bg-white/10'}`}
              >
                <motion.div animate={{ x: autoKill ? 24 : 0 }} className="w-4 h-4 rounded-full bg-white shadow-md" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Live Alert Feed */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="col-span-12 lg:col-span-5 glass p-6 rounded-2xl border border-white/10 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Recent Alert Feed</h3>
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                {alerts.filter(a => a.active).length} Active
              </span>
            </div>

            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="glass p-4 rounded-xl border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={`w-4 h-4 ${alert.type === 'danger' ? 'text-rose-400' : 'text-amber-400'}`} />
                      <span className="font-semibold text-sm text-white">{alert.title}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{alert.time}</span>
                  </div>
                  <p className="text-xs text-slate-300">{alert.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 text-center text-xs text-slate-500">
            Powered by VaultPulse Autonomous Telemetry Engine
          </div>
        </motion.div>
      </div>
    </div>
  );
}
