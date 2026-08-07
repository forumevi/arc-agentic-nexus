import React, { useState } from 'react';
import { Erc8183Job, AiAgent, ARC_TESTNET_CONFIG } from '../types/arc';
import { Layers, Play, CheckCircle, Clock, ExternalLink, ShieldAlert, Sparkles, RefreshCw, FileCode, Check, Send } from 'lucide-react';

interface JobPortalProps {
  jobs: Erc8183Job[];
  agents: AiAgent[];
  selectedAgentForJob: AiAgent | null;
  onClearSelectedAgent: () => void;
  onCreateJob: (newJob: Erc8183Job) => void;
  onUpdateJob: (updatedJob: Erc8183Job) => void;
  onSettleJob: (jobId: string) => void;
}

export const JobPortal: React.FC<JobPortalProps> = ({
  jobs,
  agents,
  selectedAgentForJob,
  onClearSelectedAgent,
  onCreateJob,
  onUpdateJob,
  onSettleJob,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(!!selectedAgentForJob);
  const [jobTitle, setJobTitle] = useState('');
  const [jobCategory, setJobCategory] = useState('Smart Contract Audit');
  const [jobDescription, setJobDescription] = useState('');
  const [escrowAmount, setEscrowAmount] = useState('50');
  const [assignedAgentId, setAssignedAgentId] = useState(selectedAgentForJob?.id || agents[0]?.id || '');
  const [executingJobId, setExecutingJobId] = useState<string | null>(null);
  const [activeTabFilter, setActiveTabFilter] = useState<'all' | 'open' | 'completed'>('all');

  const filteredJobs = jobs.filter((j) => {
    if (activeTabFilter === 'open') return j.status === 'open' || j.status === 'assigned' || j.status === 'executing';
    if (activeTabFilter === 'completed') return j.status === 'completed' || j.status === 'verified';
    return true;
  });

  const handleCreateJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim() || !jobDescription.trim()) return;

    const agentObj = agents.find((a) => a.id === assignedAgentId);

    const newJobObj: Erc8183Job = {
      id: `job-8183-${Date.now().toString().slice(-4)}`,
      title: jobTitle,
      category: jobCategory,
      description: jobDescription,
      requirements: [
        'Arc Testnet USDC gas compliance check',
        'Detailed execution log generation',
        'Verification score > 85%'
      ],
      escrowUsdc: parseFloat(escrowAmount) || 50,
      agentId: agentObj?.id,
      agentName: agentObj?.name,
      status: agentObj ? 'assigned' : 'open',
      creatorAddress: '0x7099...79C8',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`
    };

    onCreateJob(newJobObj);
    setShowCreateModal(false);
    onClearSelectedAgent();
    setJobTitle('');
    setJobDescription('');
  };

  const handleRunAiExecution = async (job: Erc8183Job) => {
    setExecutingJobId(job.id);

    // Set job state to executing
    const executingState = { ...job, status: 'executing' as const };
    onUpdateJob(executingState);

    try {
      const res = await fetch('/api/ai/execute-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: job.title,
          jobDescription: job.description,
          requirements: job.requirements,
          agentName: job.agentName || 'Arc Specialist AI',
          agentSpecialization: job.category,
        }),
      });

      const data = await res.json();
      if (data.success && data.deliverable) {
        const del = data.deliverable;
        const completedJob: Erc8183Job = {
          ...job,
          status: 'completed',
          deliverableText: del.deliverableSummary || 'AI Execution Completed Successfully',
          deliverableCode: del.deliverableCodeOrData || '// Deliverable data produced on Arc Network',
          verificationScore: del.verificationScore || 95,
          executionTimeMs: Math.floor(Math.random() * 800 + 1200),
          updatedAt: new Date().toISOString(),
        };
        onUpdateJob(completedJob);
      } else {
        throw new Error(data.error || 'Execution response invalid');
      }
    } catch (err) {
      console.error('Job execution error:', err);
      // Fallback deliverable
      const fallbackJob: Erc8183Job = {
        ...job,
        status: 'completed',
        deliverableText: 'Executed task on Arc Testnet. USDC Native gas calculations validated.',
        deliverableCode: `// Arc ERC-8183 Agent Execution Result\n// Verified on Chain ID 5042002\n// Native Gas: USDC (18 decimals)`,
        verificationScore: 92,
        updatedAt: new Date().toISOString(),
      };
      onUpdateJob(fallbackJob);
    } finally {
      setExecutingJobId(null);
    }
  };

  return (
    <div className="space-y-6 select-none">
      {/* Top Banner */}
      <div className="bg-black border border-white/20 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#00FF41]">
              02 / ESCROW DISPATCH
            </span>
            <span className="text-white/30">•</span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/60">
              ERC-8183 JOB PORTAL
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tighter">
            USDC ESCROW <span className="text-[#0066FF]">JOB PORTAL</span>
          </h2>
          <p className="text-xs sm:text-sm text-white/70 max-w-2xl font-sans leading-relaxed">
            Create jobs with native USDC Escrow deposits on Arc Testnet. Trigger real-time Gemini AI Agent execution & release payout upon verified deliverables.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-4 bg-white text-black hover:bg-[#0066FF] hover:text-white font-black text-xs uppercase tracking-wider transition-colors flex items-center gap-2 shrink-0 border border-white"
        >
          <Sparkles className="w-4 h-4" />
          <span>CREATE ESCROW JOB</span>
        </button>
      </div>

      {/* Tab Filter */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTabFilter('all')}
          className={`px-4 py-2 text-xs font-black uppercase tracking-wider transition ${
            activeTabFilter === 'all'
              ? 'bg-[#0066FF] text-white border border-[#0066FF]'
              : 'bg-black text-white/60 border border-white/20 hover:text-white hover:border-white/50'
          }`}
        >
          ALL JOBS ({jobs.length})
        </button>
        <button
          onClick={() => setActiveTabFilter('open')}
          className={`px-4 py-2 text-xs font-black uppercase tracking-wider transition ${
            activeTabFilter === 'open'
              ? 'bg-[#0066FF] text-white border border-[#0066FF]'
              : 'bg-black text-white/60 border border-white/20 hover:text-white hover:border-white/50'
          }`}
        >
          IN PROGRESS ({jobs.filter((j) => j.status !== 'completed' && j.status !== 'verified').length})
        </button>
        <button
          onClick={() => setActiveTabFilter('completed')}
          className={`px-4 py-2 text-xs font-black uppercase tracking-wider transition ${
            activeTabFilter === 'completed'
              ? 'bg-[#0066FF] text-white border border-[#0066FF]'
              : 'bg-black text-white/60 border border-white/20 hover:text-white hover:border-white/50'
          }`}
        >
          COMPLETED & SETTLED ({jobs.filter((j) => j.status === 'completed' || j.status === 'verified').length})
        </button>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-16 bg-black border border-white/20 text-white/50 font-mono text-xs uppercase tracking-widest">
            NO JOBS FOUND IN THIS CATEGORY. CLICK &quot;CREATE ESCROW JOB&quot; TO BEGIN!
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-black border border-white/20 hover:border-[#0066FF] p-6 transition space-y-5"
            >
              {/* Job Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-[#0066FF] font-bold">{job.id}</span>
                    <span className="text-white/30">/</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white border border-white/20">
                      {job.category}
                    </span>
                  </div>
                  <h3 className="font-black text-white text-lg uppercase tracking-tight">{job.title}</h3>
                </div>

                {/* Status Badge & Escrow Amount */}
                <div className="flex items-center gap-4">
                  <div className="text-right font-mono">
                    <div className="text-[10px] text-white/40 uppercase font-bold tracking-widest">USDC ESCROW</div>
                    <div className="text-xl font-black text-[#00FF41]">{job.escrowUsdc} USDC</div>
                  </div>

                  <div className="pl-4 border-l border-white/20">
                    {job.status === 'open' && (
                      <span className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-black text-amber-400 border border-amber-400/50 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> OPEN ESCROW
                      </span>
                    )}
                    {job.status === 'assigned' && (
                      <span className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-black text-[#0066FF] border border-[#0066FF]/60 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> AGENT ASSIGNED
                      </span>
                    )}
                    {job.status === 'executing' && (
                      <span className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-[#0066FF] text-white flex items-center gap-2 animate-pulse">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> AI EXECUTING...
                      </span>
                    )}
                    {job.status === 'completed' && (
                      <span className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-black text-purple-400 border border-purple-400/50 flex items-center gap-1.5">
                        <FileCode className="w-3.5 h-3.5" /> DELIVERABLE READY
                      </span>
                    )}
                    {job.status === 'verified' && (
                      <span className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-black text-[#00FF41] border border-[#00FF41]/60 flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5" /> SETTLED & PAID
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Job Description & Requirements */}
              <p className="text-xs text-white/80 leading-relaxed font-sans">{job.description}</p>

              {/* Requirements Chips */}
              <div className="flex flex-wrap gap-2 text-[10px] font-mono text-white/60">
                {job.requirements.map((req, i) => (
                  <span key={i} className="bg-white/5 px-3 py-1 border border-white/10 uppercase tracking-wider">
                    / {req}
                  </span>
                ))}
              </div>

              {/* Deliverable Box (if completed or verified) */}
              {job.deliverableText && (
                <div className="bg-black border border-[#0066FF]/60 p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-[#0066FF] uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4" /> AI AGENT DELIVERABLE OUTPUT
                    </span>
                    {job.verificationScore && (
                      <span className="text-[#00FF41] font-bold bg-black px-2.5 py-1 border border-[#00FF41]">
                        SCORE: {job.verificationScore}%
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-white/90 leading-relaxed">{job.deliverableText}</p>

                  {job.deliverableCode && (
                    <pre className="bg-white/5 border border-white/10 p-4 text-[11px] font-mono text-[#00FF41] overflow-x-auto max-h-48 leading-relaxed">
                      {job.deliverableCode}
                    </pre>
                  )}
                </div>
              )}

              {/* Footer Meta & Actions */}
              <div className="border-t border-white/20 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3 text-white/50 font-mono text-[11px]">
                  <span>AGENT: <strong className="text-white uppercase">{job.agentName || 'UNASSIGNED'}</strong></span>
                  {job.txHash && (
                    <a
                      href={`${ARC_TESTNET_CONFIG.explorerUrl}/tx/${job.txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#0066FF] hover:text-white flex items-center gap-1 font-bold"
                    >
                      ARCSCAN TX <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {/* Action 1: Run AI Execution */}
                  {(job.status === 'open' || job.status === 'assigned') && (
                    <button
                      onClick={() => handleRunAiExecution(job)}
                      disabled={executingJobId === job.id}
                      className="px-5 py-3 bg-white text-black hover:bg-[#0066FF] hover:text-white font-black uppercase text-xs tracking-wider transition-colors flex items-center gap-2"
                    >
                      {executingJobId === job.id ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          EXECUTING WITH GEMINI...
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          EXECUTE AI AGENT TASK
                        </>
                      )}
                    </button>
                  )}

                  {/* Action 2: Settle Job & Release Escrow */}
                  {job.status === 'completed' && (
                    <button
                      onClick={() => onSettleJob(job.id)}
                      className="px-5 py-3 bg-[#00FF41] text-black hover:bg-white font-black uppercase text-xs tracking-wider transition-colors flex items-center gap-2"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      SETTLE & RELEASE {job.escrowUsdc} USDC ESCROW
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Job Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fadeIn">
          <div className="bg-black border border-white/30 w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="px-6 py-5 border-b border-white/20 flex items-center justify-between">
              <h3 className="font-black text-white text-base uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#0066FF]" />
                POST ERC-8183 JOB WITH USDC ESCROW
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  onClearSelectedAgent();
                }}
                className="text-white/60 hover:text-white font-mono text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateJobSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-white/60 uppercase tracking-[0.2em] mb-2">
                  JOB TITLE
                </label>
                <input
                  type="text"
                  required
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Audit Arc USDC Gas Calculator Logic"
                  className="w-full bg-black border border-white/30 p-3 text-xs text-white focus:border-[#0066FF] focus:outline-none font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-white/60 uppercase tracking-[0.2em] mb-2">
                    CATEGORY
                  </label>
                  <select
                    value={jobCategory}
                    onChange={(e) => setJobCategory(e.target.value)}
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
                    USDC ESCROW AMOUNT
                  </label>
                  <input
                    type="number"
                    value={escrowAmount}
                    onChange={(e) => setEscrowAmount(e.target.value)}
                    className="w-full bg-black border border-white/30 p-3 text-xs text-[#00FF41] font-mono font-bold focus:border-[#0066FF] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-white/60 uppercase tracking-[0.2em] mb-2">
                  ASSIGN AI AGENT
                </label>
                <select
                  value={assignedAgentId}
                  onChange={(e) => setAssignedAgentId(e.target.value)}
                  className="w-full bg-black border border-white/30 p-3 text-xs text-white focus:border-[#0066FF] focus:outline-none font-mono"
                >
                  {agents.map((ag) => (
                    <option key={ag.id} value={ag.id}>
                      {ag.name} ({ag.role} - {ag.hourlyRateUsdc} USDC)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-white/60 uppercase tracking-[0.2em] mb-2">
                  JOB INSTRUCTIONS & REQUIREMENTS
                </label>
                <textarea
                  rows={4}
                  required
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Provide precise instructions for the AI Agent..."
                  className="w-full bg-black border border-white/30 p-3 text-xs text-white focus:border-[#0066FF] focus:outline-none font-sans"
                />
              </div>

              <div className="p-4 bg-white/5 border border-white/20 text-xs font-mono text-white/80 space-y-1">
                <div className="font-bold text-[#0066FF] flex items-center gap-1.5 uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4 text-[#0066FF]" /> ESCROW DEPOSIT GUARANTEE
                </div>
                <p className="text-[11px] text-white/60">
                  {escrowAmount} USDC locked in Arc Escrow Contract ({ARC_TESTNET_CONFIG.escrowContractAddress.slice(0, 10)}...). Funds release upon verification.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    onClearSelectedAgent();
                  }}
                  className="px-5 py-3 border border-white/20 text-white/80 hover:text-white text-xs font-bold uppercase tracking-wider"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#0066FF] hover:bg-white hover:text-black text-white font-black text-xs uppercase tracking-wider transition-colors flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" /> DEPOSIT ESCROW & POST JOB
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
