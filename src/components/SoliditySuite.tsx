import React, { useState } from "react";
import { SOLIDITY_ESCROW_CONTRACT, HARDHAT_CONFIG_SNIPPET, ARC_NETWORK_INFO } from "../data/arcData";
import { Code2, Copy, Check, Play, ShieldAlert, Cpu, Terminal, Sparkles, Download, CheckCircle2 } from "lucide-react";

export const SoliditySuite: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"solidity" | "hardhat">("solidity");
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [isSimulatingDeploy, setIsSimulatingDeploy] = useState<boolean>(false);
  const [deployedAddress, setDeployedAddress] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSimulateDeploy = () => {
    setIsSimulatingDeploy(true);
    setDeployedAddress(null);
    setTimeout(() => {
      setIsSimulatingDeploy(false);
      setDeployedAddress(`0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`);
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Code2 className="w-5 h-5 text-indigo-400" />
            <span>Arc Smart Contract Suite & Deployment Studio</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Production-ready ERC-8183 AI Agent Escrow contract optimized for Arc L1 native USDC gas fees.
          </p>
        </div>

        <button
          onClick={handleSimulateDeploy}
          disabled={isSimulatingDeploy}
          className="px-4 py-2.5 text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-slate-800 text-white rounded-xl shadow transition flex items-center gap-2"
        >
          {isSimulatingDeploy ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              <span>Deploying to Chain ID 5042002...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Simulate Deploy on Arc Testnet</span>
            </>
          )}
        </button>
      </div>

      {deployedAddress && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-800/60 rounded-2xl text-xs space-y-2 animate-in fade-in">
          <div className="font-bold text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Contract Successfully Compiled & Deployed on Arc Testnet!</span>
          </div>
          <p className="font-mono text-emerald-200 text-xs">
            Contract Address: <strong>{deployedAddress}</strong>
          </p>
          <div className="flex items-center space-x-3 text-[11px] text-emerald-400/90 pt-1">
            <span>Gas Used: 0.012 USDC</span>
            <span>•</span>
            <span>Finality: 0.6s</span>
            <span>•</span>
            <a
              href={`${ARC_NETWORK_INFO.explorerUrl}/address/${deployedAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white"
            >
              Inspect on ArcScan
            </a>
          </div>
        </div>
      )}

      {/* Code Editor Preview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {/* Editor Bar */}
        <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab("solidity")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeTab === "solidity"
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              ArcAgentEscrow.sol
            </button>
            <button
              onClick={() => setActiveTab("hardhat")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeTab === "hardhat"
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              hardhat.config.js
            </button>
          </div>

          <button
            onClick={() => handleCopy(activeTab === "solidity" ? SOLIDITY_ESCROW_CONTRACT : HARDHAT_CONFIG_SNIPPET)}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition flex items-center gap-1.5"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? "Copied!" : "Copy Code"}</span>
          </button>
        </div>

        {/* Code Body */}
        <div className="p-4 bg-slate-950 overflow-x-auto font-mono text-xs text-slate-300 leading-relaxed max-h-[500px] overflow-y-auto">
          <pre>{activeTab === "solidity" ? SOLIDITY_ESCROW_CONTRACT : HARDHAT_CONFIG_SNIPPET}</pre>
        </div>
      </div>
    </div>
  );
};

export default SoliditySuite;
