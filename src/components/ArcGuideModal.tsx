import React from "react";
import { ARC_NETWORK_INFO } from "../data/arcData";
import { BookOpen, CheckCircle2, ShieldAlert, Zap, ExternalLink, Cpu } from "lucide-react";

interface ArcGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArcGuideModal: React.FC<ArcGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">Arc Builder AI Guide & Blueprint</h3>
              <p className="text-xs text-slate-400">Verified Testnet Specs from Official Circle Arc Documentation</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-semibold p-1">
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 text-slate-300 text-xs leading-relaxed font-sans">
          {/* Key Principles */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Core Arc Blockchain Principles</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-emerald-400 block">USDC Native Gas</span>
                <p className="text-slate-400">Gas is paid in USDC, not ETH. Native Gas USDC uses 18 decimals (wei scale).</p>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-cyan-400 block">Sub-Second Finality</span>
                <p className="text-slate-400">Deterministic consensus settlement in under 1 second without block reorgs.</p>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-indigo-400 block">EVM Tooling Standard</span>
                <p className="text-slate-400">Fully compatible with Solidity, Hardhat, Foundry, Viem, Ethers, and Wagmi.</p>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-amber-400 block">Circle App Kit & CCTP</span>
                <p className="text-slate-400">Native integration with Circle CCTP V2 for unified balance cross-chain spending.</p>
              </div>
            </div>
          </div>

          {/* Network Details */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-400" />
              <span>Arc Testnet Network Configuration</span>
            </h4>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono space-y-2 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Network Name:</span>
                <span className="text-white font-bold">{ARC_NETWORK_INFO.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Chain ID:</span>
                <span className="text-emerald-400 font-bold">{ARC_NETWORK_INFO.chainId} ({ARC_NETWORK_INFO.chainIdHex})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">RPC Endpoint:</span>
                <span className="text-cyan-300">{ARC_NETWORK_INFO.rpcUrl}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Native Currency:</span>
                <span className="text-slate-200">{ARC_NETWORK_INFO.nativeGasToken}</span>
              </div>
            </div>
          </div>

          {/* Verification Checklist */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Arc Builder Verification Checklist</span>
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Confirmed Chain ID 5042002 & RPC endpoints from official Circle Arc documentation.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Handled Native Gas USDC (18 decimals) vs ERC-20 USDC (6 decimals) conversion safely.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Implemented ERC-8183 compliant AI Agent Escrow Smart Contract in Solidity.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
