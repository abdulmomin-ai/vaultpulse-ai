import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, KeyRound, Zap, Bell, Terminal,
  Search, ShieldAlert, Cpu, Sparkles, ChevronDown,
  Activity, CheckCircle2, AlertTriangle, Plus, X, Power
} from 'lucide-react';
import { MOCK_WORKSPACES, MOCK_API_KEYS, MOCK_OPTIMIZATIONS, MOCK_ALERTS } from '../services/api';

import LiveOverview from '../views/LiveOverview';
import ApiKeysKillSwitch from '../views/ApiKeysKillSwitch';
import CostOptimizer from '../views/CostOptimizer';
import AlertRules from '../views/AlertRules';
import ApiSandbox from '../views/ApiSandbox';

export default function Layout() {
  const [currentView, setCurrentView] = useState('overview');
  const [activeWorkspace, setActiveWorkspace] = useState(MOCK_WORKSPACES[0]);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Global state that can be mutated by views
  const [apiKeys, setApiKeys] = useState(MOCK_API_KEYS);
  const [optimizations, setOptimizations] = useState(MOCK_OPTIMIZATIONS);
  const [alerts, setAlerts] = useState(MOCK_ALERTS);

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCmdOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = [
    { id: 'overview', name: 'Live Overview', icon: LayoutDashboard },
    { id: 'keys', name: 'API Keys & Kill-Switch', icon: KeyRound },
    { id: 'optimizer', name: 'Cost Optimizer', icon: Zap },
    { id: 'alerts', name: 'Alert Rules', icon: Bell },
    { id: 'sandbox', name: 'API Sandbox', icon: Terminal },
  ];

  const renderView = () => {
    switch (currentView) {
      case 'overview':
        return <LiveOverview apiKeys={apiKeys} />;
      case 'keys':
        return <ApiKeysKillSwitch apiKeys={apiKeys} setApiKeys={setApiKeys} />;
      case 'optimizer':
        return <CostOptimizer optimizations={optimizations} setOptimizations={setOptimizations} />;
      case 'alerts':
        return <AlertRules alerts={alerts} setAlerts={setAlerts} />;
      case 'sandbox':
        return <ApiSandbox />;
      default:
        return <LiveOverview apiKeys={apiKeys} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#07080f] text-white overflow-hidden font-sans">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-72 glass border-r border-white/10 flex flex-col justify-between p-6 z-20"
      >
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent">
                VaultPulse AI
              </h1>
              <p className="text-xs text-indigo-300/60 font-medium">FinOps & Token Engine</p>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`relative flex items-center gap-3.5 w-full px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                    isActive
                      ? 'text-white bg-indigo-600/20 border border-indigo-500/30 shadow-lg shadow-indigo-900/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-2 bottom-2 w-1 bg-indigo-500 rounded-r-full"
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Workspace Card & Status */}
        <div className="space-y-4">
          <div className="glass p-3 rounded-xl border border-white/10 bg-white/[0.02]">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Telemetry Status</span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Live Feed
              </span>
            </div>
            <div className="text-xs font-mono text-slate-300 truncate">
              Connected to FastAPI v1.4
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gradient-to-br from-[#07080f] via-[#0b0e1b] to-[#07080f]">

        {/* Top Command Bar */}
        <header className="h-20 border-b border-white/10 px-8 flex items-center justify-between glass z-10">
          <div className="flex items-center gap-4">
            {/* Workspace Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl glass border border-white/10 hover:bg-white/5 transition-all text-sm font-medium"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <span>{activeWorkspace.name}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isWorkspaceOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isWorkspaceOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute left-0 mt-2 w-64 glass rounded-2xl shadow-2xl border border-white/10 p-2 z-50 bg-[#0c0e1a]/95 backdrop-blur-xl"
                  >
                    {MOCK_WORKSPACES.map(ws => (
                      <button
                        key={ws.id}
                        onClick={() => {
                          setActiveWorkspace(ws);
                          setIsWorkspaceOpen(false);
                        }}
                        className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm transition-colors ${
                          activeWorkspace.id === ws.id ? 'bg-indigo-600/20 text-indigo-300 font-medium' : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <span>{ws.name}</span>
                        {activeWorkspace.id === ws.id && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Quick Search & User Profile */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCmdOpen(true)}
              className="flex items-center gap-3 px-4 py-2 rounded-xl glass border border-white/10 text-slate-400 hover:text-white hover:border-indigo-500/50 transition-all text-sm"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span>Search metrics, keys, models...</span>
              <kbd className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-mono text-slate-300">⌘K</kbd>
            </button>

            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-sm shadow-lg shadow-purple-500/20 border border-white/20">
              VP
            </div>
          </div>
        </header>

        {/* Dynamic View Container */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="max-w-7xl mx-auto pb-12"
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Ctrl+K Command Palette Modal */}
      <AnimatePresence>
        {isCmdOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-start justify-center pt-24 px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="w-full max-w-2xl glass rounded-2xl border border-white/20 shadow-2xl overflow-hidden bg-[#0a0d18]/95"
            >
              <div className="flex items-center px-4 py-3 border-b border-white/10">
                <Search className="w-5 h-5 text-indigo-400 mr-3" />
                <input
                  type="text"
                  placeholder="Type a command or search (e.g., kill-switch, export logs)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none text-sm"
                />
                <button
                  onClick={() => setIsCmdOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
                <div className="text-xs font-semibold text-slate-500 uppercase px-3 py-1">Quick Navigation</div>
                {[
                  { name: 'Go to Live Overview', view: 'overview', icon: LayoutDashboard },
                  { name: 'Manage API Keys & Kill-Switch', view: 'keys', icon: KeyRound },
                  { name: 'View Cost Optimizer Recommendations', view: 'optimizer', icon: Zap },
                  { name: 'Configure Alert Rules & Webhooks', view: 'alerts', icon: Bell },
                  { name: 'Open API Prompt Sandbox', view: 'sandbox', icon: Terminal },
                ].filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())).map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setCurrentView(item.view);
                        setIsCmdOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-indigo-600/20 text-slate-300 hover:text-white transition-colors text-sm group"
                    >
                      <Icon className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </div>

              <div className="px-4 py-3 bg-white/[0.02] border-t border-white/10 flex items-center justify-between text-xs text-slate-500">
                <span>Use arrow keys to navigate or click option</span>
                <span className="font-mono">ESC to close</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
