import React from "react";
import { ArcWalletState, ARC_TESTNET_CONFIG } from "../types/arc";
import { Wallet, Zap, ExternalLink, Bot, Shield, Send, Code, Terminal, Layers } from "lucide-react";

interface HeaderProps {
  wallet: ArcWalletState;
  onConnectWallet: () => void;
  onOpenFaucet: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  wallet,
  onConnectWallet,
  onOpenFaucet,
  activeTab,
  setActiveTab,
}) => {
  const navItems = [
    { id: "agents", label: "01 / AI AGENTS", icon: Bot },
    { id: "jobs", label: "02 / ERC-8183 JOBS", icon: Layers },
    { id: "escrow", label: "03 / USDC ESCROW", icon: Shield },
    { id: "bridge", label: "04 / CCTP BRIDGE", icon: Send },
    { id: "explorer", label: "05 / ARC EXPLORER", icon: Code },
    { id: "github", label: "06 / GITHUB DEPLOY", icon: Terminal },
  ];

  return (
    <header className="bg-[#000000] border-b border-white/20 sticky top-0 z-40 text-white select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4 flex flex-wrap items-center justify-between gap-4 border-b border-white/10">
          {/* Brand */}
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-white text-black font-black text-xl flex items-center justify-center tracking-tighter uppercase">
              ARC
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <span className="text-xs font-bold tracking-[0.25em] uppercase text-white/60">
                  PROJECT STATUS: STAGING
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-white/10 text-white border border-white/20 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00FF41] shadow-[0_0_8px_#00FF41]"></span>
                  ACTIVE L1 TESTNET
                </span>
              </div>
              <h1 className="font-black text-xl text-white tracking-tight uppercase flex items-center gap-2">
                ARC <span className="text-[#0066FF]">AGENTIC</span> HUB
              </h1>
            </div>
          </div>

          {/* Quick Wallet & Actions */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex flex-col text-right font-mono text-[11px] text-white/60">
              <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/40">CHAIN TARGET</span>
              <span className="text-white font-bold">ID: {ARC_TESTNET_CONFIG.chainId} (USDC GAS)</span>
            </div>

            <a
              href={ARC_TESTNET_CONFIG.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 text-xs font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white border border-white/20 transition flex items-center gap-1"
            >
              <span>ARCSCAN</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* Wallet State Pill */}
            {wallet.isConnected ? (
              <button
                onClick={onConnectWallet}
                className="flex items-center space-x-3 bg-black border border-white/30 hover:border-white/60 px-3.5 py-1.5 text-xs transition"
              >
                <div className="w-2 h-2 rounded-full bg-[#00FF41] shadow-[0_0_8px_#00FF41]"></div>
                <div className="flex flex-col text-left font-mono">
                  <span className="text-white font-bold">
                    {wallet.address.substring(0, 6)}...{wallet.address.substring(wallet.address.length - 4)}
                  </span>
                  <span className="text-[10px] text-[#00FF41] font-bold">
                    {wallet.nativeGasUsdcBalance.toFixed(2)} USDC GAS
                  </span>
                </div>
              </button>
            ) : (
              <button
                onClick={onConnectWallet}
                className="px-5 py-2 text-xs font-black uppercase tracking-wider bg-[#0066FF] hover:bg-white hover:text-black text-white transition flex items-center gap-2"
              >
                <Wallet className="w-4 h-4" />
                <span>CONNECT WALLET</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-4 py-2.5 text-xs font-black tracking-wider uppercase whitespace-nowrap transition flex items-center gap-2 border ${
                  isActive
                    ? "bg-[#0066FF] text-white border-[#0066FF]"
                    : "bg-transparent text-white/60 border-transparent hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-white/60"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
