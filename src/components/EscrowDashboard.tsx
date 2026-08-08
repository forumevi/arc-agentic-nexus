import React, { useState } from "react";
import { EscrowJob } from "../types";
import ReactMarkdown from "react-markdown";
import { Shield, Play, CheckCircle2, Clock, AlertTriangle, ExternalLink, ArrowUpRight, Copy, Check, Lock, Sparkles, FileText } from "lucide-react";

interface EscrowDashboardProps {
  jobs: EscrowJob[];
  onExecuteAgentJob: (jobId: string) => Promise<void>;
  onReleaseFunds: (jobId: string) => void;
  onDisputeJob: (jobId: string) => void;
  isExecuting: boolean;
  executingJobId: string | null;
}

export const EscrowDashboard: React.FC<EscrowDashboardProps> = ({
  jobs,
  onExecuteAgentJob,
  onReleaseFunds,
  onDisputeJob,
  isExecuting,
  executingJobId,
}) => {
  const [selectedDeliverableJob, setSelectedDeliverableJob] = useState<EscrowJob | null>(null);
  const [copiedTx, setCopiedTx] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTx(text);
    setTimeout(() => setCopiedTx(null), 2000);
  };

  const getStatusBadge = (status: EscrowJob["status"]) => {
    switch (status) {
      case "created":
      case "funded":
        return (
          <span className="px-2.5 py-1 text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full flex items-center gap-1">
            <Lock className="w-3 h-3" /> Escrow Locked
          </span>
        );
      case "working":
        return (
          <span className="px-2.5 py-1 text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full flex items-center gap-1 animate-pulse">
            <Sparkles className="w-3 h-3" /> Agent AI Executing...
          </span>
        );
      case "review":
        return (
          <span className="px-2.5 py-1 text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-full flex items-center gap-1">
            <FileText className="w-3 h-3" /> Deliverable Ready
          </span>
        );
      case "completed":
        return (
          <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Funds Released
          </span>
        );
      case "disputed":
        return (
          <span className="px-2.5 py-1 text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 rounded-full flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Disputed
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span>Arc USDC Escrow Manager</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Monitor locked USDC funds, trigger server-side AI execution, inspect deliverables, and release payments on Arc Testnet.
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">Total Escrow Active</span>
            <span className="font-extrabold text-emerald-400 font-mono text-sm">
              {jobs
                .filter((j) => j.status !== "completed")
                .reduce((acc, curr) => acc + curr.escrowAmountUsdc, 0)}{" "}
              USDC
            </span>
          </div>
          <div className="h-6 w-px bg-slate-800"></div>
          <div>
            <span className="text-slate-400 block text-[10px]">Total Jobs</span>
            <span className="font-extrabold text-white font-mono text-sm">{jobs.length}</span>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {jobs.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-3">
            <Lock className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-200">No Active Escrow Contracts</h3>
            <p className="text-xs max-w-md mx-auto">
              Select an AI Agent from the Marketplace to deposit USDC and launch a new autonomous job contract on Arc.
            </p>
          </div>
        ) : (
          jobs.map((job) => {
            const isThisExecuting = isExecuting && executingJobId === job.id;

            return (
              <div
                key={job.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-4 transition shadow-md"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-slate-400">#{job.id}</span>
                      <h3 className="font-bold text-slate-100 text-sm sm:text-base">{job.title}</h3>
                      {getStatusBadge(job.status)}
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-2">
                      <span>Assigned Agent: <strong className="text-slate-200">{job.agentName}</strong></span>
                      <span>•</span>
                      <span>Created: {new Date(job.createdAt).toLocaleTimeString()}</span>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-medium">Escrow Locked</span>
                    <span className="text-base font-extrabold text-emerald-400 font-mono">
                      {job.escrowAmountUsdc} USDC
                    </span>
                  </div>
                </div>

                {/* Prompt Details */}
                <div className="bg-slate-950 rounded-xl p-3 text-xs text-slate-300 border border-slate-800/80 font-mono space-y-1">
                  <span className="text-[10px] text-slate-500 font-sans font-semibold uppercase block">Job Prompt Input</span>
                  <div className="line-clamp-2 text-slate-300">{job.prompt}</div>
                </div>

                {/* On-Chain Deposit Tx Link */}
                {job.txHashDeposit && (
                  <div className="text-xs text-slate-400 flex items-center justify-between bg-slate-950/60 rounded-lg px-3 py-1.5 border border-slate-800/50">
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      Deposit Tx: {job.txHashDeposit.substring(0, 10)}...{job.txHashDeposit.substring(job.txHashDeposit.length - 6)}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleCopy(job.txHashDeposit!)}
                        className="p-1 hover:text-white"
                        title="Copy Tx Hash"
                      >
                        {copiedTx === job.txHashDeposit ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <a
                        href={`https://testnet.arcscan.app/tx/${job.txHashDeposit}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 flex items-center gap-0.5"
                      >
                        <span className="text-[10px]">ArcScan</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Actions Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div>
                    {job.deliverable && (
                      <button
                        onClick={() => setSelectedDeliverableJob(job)}
                        className="px-3 py-1.5 text-xs font-semibold bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 rounded-lg border border-indigo-800/60 transition flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Inspect Deliverable Output</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {(job.status === "funded" || job.status === "created") && (
                      <button
                        onClick={() => onExecuteAgentJob(job.id)}
                        disabled={isThisExecuting}
                        className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900 text-white rounded-xl shadow transition flex items-center gap-1.5"
                      >
                        {isThisExecuting ? (
                          <>
                            <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            <span>Executing Agent AI...</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Trigger Agent AI</span>
                          </>
                        )}
                      </button>
                    )}

                    {(job.status === "review" || job.status === "funded" || job.status === "working") && job.deliverable && (
                      <button
                        onClick={() => onReleaseFunds(job.id)}
                        className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow transition flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve & Release {job.escrowAmountUsdc} USDC</span>
                      </button>
                    )}

                    {job.status === "completed" && (
                      <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Paid & Released
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Deliverable Modal */}
      {selectedDeliverableJob && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div>
                <h3 className="font-bold text-slate-100 text-base">
                  Deliverable Output for #{selectedDeliverableJob.id} - {selectedDeliverableJob.title}
                </h3>
                <p className="text-xs text-slate-400">
                  Generated by {selectedDeliverableJob.agentName} • {selectedDeliverableJob.executedAt ? new Date(selectedDeliverableJob.executedAt).toLocaleString() : "Recent"}
                </p>
              </div>
              <button
                onClick={() => setSelectedDeliverableJob(null)}
                className="text-slate-400 hover:text-white font-semibold text-sm p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-slate-200 text-sm leading-relaxed font-sans markdown-body">
              <ReactMarkdown>{selectedDeliverableJob.deliverable || ""}</ReactMarkdown>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Escrow Amount: <strong className="text-emerald-400">{selectedDeliverableJob.escrowAmountUsdc} USDC</strong>
              </span>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSelectedDeliverableJob(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl border border-slate-800 hover:bg-slate-800"
                >
                  Close
                </button>

                {selectedDeliverableJob.status !== "completed" && (
                  <button
                    onClick={() => {
                      onReleaseFunds(selectedDeliverableJob.id);
                      setSelectedDeliverableJob(null);
                    }}
                    className="px-5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow"
                  >
                    Release Escrow Funds Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
<<<<<<< HEAD

export default EscrowDashboard;
=======
>>>>>>> 50a4d1c634a5e056aeb319b5dcd3b8cba237df0e
