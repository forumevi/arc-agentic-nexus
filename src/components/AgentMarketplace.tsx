import React, { useState } from 'react';
import { AiAgent } from '../types/arc';
import { Cpu, Star, ShieldCheck, Sparkles, RefreshCw, ArrowRight } from 'lucide-react';

interface AgentMarketplaceProps {
  agents: AiAgent[];
  onSelectAgentForJob: (agent: AiAgent) => void;
  onAddAgent: (newAgent: AiAgent) => void;
}

export const AgentMarketplace: React.FC<AgentMarketplaceProps> = ({
  agents,
  onSelectAgentForJob,
  onAddAgent,
}) => {
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [customCategory, setCustomCategory] = useState('Smart Contract Audit');
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState('');

  const specializations = [
    'All',
    'Smart Contract Audit',
    'DeFi Strategy',
    'Data Analytics',
    'Automated Trading',
  ];

  const filteredAgents = agents.filter(
    (a) => selectedSpecialization === 'All' || a.specialization === selectedSpecialization
  );

  const handleGenerateCustomAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;

    setGenerating(true);
    setGenError('');

    try {
      const res = await fetch('/api/ai/create-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPrompt: customPrompt,
          specialization: customCategory,
        }),
      });

      const data = await res.json();
      if (data.success && data.agent) {
        const agentData = data.agent;
        const newAgentObj: AiAgent = {
          id: `agent-${Date.now()}`,
          name: agentData.name || 'Arc AI Specialist',
          role: agentData.role || 'Autonomous Worker',
          avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=250&q=80',
          description: agentData.description || 'Specialized AI Agent created on Arc Network.',
          capabilities: agentData.capabilities || ['ERC-8183 Task Execution', 'Smart Contract Analysis'],
          reputationScore: 98.0,
          completedJobsCount: 0,
          hourlyRateUsdc: agentData.hourlyRateUsdc || 20,
          status: 'active',
          specialization: (agentData.specialization as any) || customCategory,
          walletAddress: `0x8183...${Math.floor(Math.random() * 8999 + 1000)}`,
        };

        onAddAgent(newAgentObj);
        setShowCreateModal(false);
        setCustomPrompt('');
      } else {
        setGenError(data.error || 'Failed to generate agent parameters');
      }
    } catch (err: any) {
      setGenError(err.message || 'Error generating AI Agent');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6 select-none">
      {/* Banner */}
      <div className="bg-black border border-white/20 p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#00FF41]">
                01 / REGISTRY ENGINE
              </span>
              <span className="text-white/30">•</span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/60 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00FF41] shadow-[0_0_8px_#00FF41]"></span>
                ERC-8183 VERIFIED
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tighter leading-none">
              AUTONOMOUS <span className="text-[#0066FF]">AI AGENTS</span> MARKETPLACE
            </h2>
            <p className="text-white/70 text-xs sm:text-sm leading-relaxed max-w-2xl font-sans">
              Hire verified AI Agents capable of auditing smart contracts, analyzing CCTP cross-chain routes, and executing automated tasks with USDC escrow security on Arc Testnet.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-4 bg-white hover:bg-[#0066FF] hover:text-white text-black font-black text-xs uppercase tracking-wider transition-colors flex items-center gap-3 shrink-0 border border-white"
          >
            <Sparkles className="w-4 h-4" />
            <span>GENERATE AGENT WITH GEMINI</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/10 pb-4">
        {specializations.map((spec) => (
          <button
            key={spec}
            onClick={() => setSelectedSpecialization(spec)}
            className={`px-4 py-2 text-xs font-black uppercase tracking-wider whitespace-nowrap transition ${
              selectedSpecialization === spec
                ? 'bg-[#0066FF] text-white border border-[#0066FF]'
                : 'bg-black text-white/60 border border-white/20 hover:text-white hover:border-white/50'
            }`}
          >
            {spec}
          </button>
        ))}
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAgents.map((agent) => (
          <div
            key={agent.id}
            className="bg-black border border-white/20 hover:border-[#0066FF] p-6 transition-all duration-200 flex flex-col justify-between space-y-6 group"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start gap-4">
                <img
                  src={agent.avatar}
                  alt={agent.name}
                  className="w-16 h-16 object-cover border border-white/20 group-hover:border-[#0066FF] transition"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-black text-white text-lg uppercase tracking-tight group-hover:text-[#0066FF] transition">
                      {agent.name}
                    </h3>
                    <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider bg-black text-[#00FF41] border border-[#00FF41]/40 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#00FF41] shadow-[0_0_6px_#00FF41]"></span>
                      ERC-8183 READY
                    </span>
                  </div>
                  <p className="text-xs text-[#0066FF] font-bold uppercase tracking-wider mt-0.5">{agent.role}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-white/50 font-mono">
                    <span className="flex items-center gap-1 text-white font-bold">
                      <Star className="w-3.5 h-3.5 text-[#00FF41] fill-[#00FF41]" />
                      {agent.reputationScore}%
                    </span>
                    <span>/</span>
                    <span>{agent.completedJobsCount} SETTLED</span>
                    <span>/</span>
                    <span className="text-white/70">{agent.walletAddress}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-white/80 leading-relaxed font-sans">{agent.description}</p>

              {/* Capabilities */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">
                  CAPABILITIES & SKILLS:
                </span>
                <div className="flex flex-wrap gap-2">
                  {agent.capabilities.map((cap, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-[10px] font-mono bg-white/5 text-white/90 border border-white/10 flex items-center gap-1.5"
                    >
                      <ShieldCheck className="w-3 h-3 text-[#0066FF]" /> {cap}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="border-t border-white/20 pt-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest block">ESCROW RATE</span>
                <div className="text-lg font-black text-white font-mono">
                  {agent.hourlyRateUsdc} <span className="text-xs text-[#0066FF] font-sans">USDC / JOB</span>
                </div>
              </div>

              <button
                onClick={() => onSelectAgentForJob(agent)}
                className="px-5 py-3 bg-white text-black hover:bg-[#0066FF] hover:text-white font-black text-xs uppercase tracking-wider transition-colors flex items-center gap-2"
              >
                <span>ASSIGN ERC-8183 JOB</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Custom AI Agent Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fadeIn">
          <div className="bg-black border border-white/30 w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="px-6 py-5 border-b border-white/20 flex items-center justify-between">
              <h3 className="font-black text-white text-base uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0066FF]" />
                GENERATE CUSTOM ARC AI AGENT
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-white/60 hover:text-white font-mono text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGenerateCustomAgent} className="p-6 space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-white/60 uppercase tracking-[0.2em] mb-2">
                  AGENT SPECIALIZATION AREA
                </label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full bg-black border border-white/30 p-3 text-xs text-white focus:border-[#0066FF] focus:outline-none font-mono"
                >
                  <option value="Smart Contract Audit">Smart Contract Audit</option>
                  <option value="DeFi Strategy">DeFi Strategy & CCTP</option>
                  <option value="Data Analytics">Data Analytics & Reports</option>
                  <option value="Automated Trading">Automated Trading Keeper</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-white/60 uppercase tracking-[0.2em] mb-2">
                  SPECIALIZATION PROMPT FOR GEMINI
                </label>
                <textarea
                  rows={4}
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g., An AI agent that inspects Arc Testnet transaction gas spikes and verifies 18-decimal native USDC calculations for DeFi pools..."
                  className="w-full bg-black border border-white/30 p-3 text-xs text-white focus:border-[#0066FF] focus:outline-none font-sans"
                />
              </div>

              {genError && (
                <div className="text-xs text-rose-400 bg-rose-950/80 border border-rose-800 p-3 font-mono">
                  {genError}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-3 border border-white/20 text-white/80 hover:text-white text-xs font-bold uppercase tracking-wider"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={generating || !customPrompt.trim()}
                  className="px-6 py-3 bg-[#0066FF] hover:bg-white hover:text-black text-white font-black text-xs uppercase tracking-wider transition-colors flex items-center gap-2"
                >
                  {generating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      GENERATING WITH GEMINI...
                    </>
                  ) : (
                    'REGISTER AGENT ON ARC'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
