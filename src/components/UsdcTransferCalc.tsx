import React, { useState } from "react";
import { ARC_NETWORK_INFO } from "../data/arcData";
import { Zap, Send, RefreshCw, CheckCircle2, ArrowRightLeft, ShieldCheck, ExternalLink, HelpCircle } from "lucide-react";

interface UsdcTransferCalcProps {
  nativeUsdcBalance: string;
  erc20UsdcBalance: string;
  onSendUsdc: (to: string, amount: string, tokenType: "native" | "erc20") => void;
  isConnected: boolean;
  onConnectWallet: () => void;
}

export const UsdcTransferCalc: React.FC<UsdcTransferCalcProps> = ({
  nativeUsdcBalance,
  erc20UsdcBalance,
  onSendUsdc,
  isConnected,
  onConnectWallet,
}) => {
  const [recipient, setRecipient] = useState<string>("");
  const [amount, setAmount] = useState<string>("5");
  const [tokenType, setTokenType] = useState<"native" | "erc20">("native");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sentTxHash, setSentTxHash] = useState<string | null>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !amount) return;

    setIsSending(true);
    setTimeout(() => {
      onSendUsdc(recipient, amount, tokenType);
      const hash = `0x${Math.random().toString(16).substring(2)}${Math.random().toString(16).substring(2)}`;
      setSentTxHash(hash);
      setIsSending(false);
    }, 1200);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Transfer Card */}
      <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Send className="w-5 h-5 text-blue-400" />
              <span>Arc Testnet USDC Transfer & Gas Station</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Send native gas USDC (18 decimals) or ERC-20 USDC (6 decimals) with deterministic sub-second finality.
            </p>
          </div>
          <a
            href={ARC_NETWORK_INFO.explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800"
          >
            <span>ArcScan</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Token Selector */}
        <div className="grid grid-cols-2 gap-3 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setTokenType("native")}
            className={`py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center justify-between transition ${
              tokenType === "native"
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-300" />
              <div className="text-left">
                <span className="block font-bold">Native Gas USDC</span>
                <span className="text-[10px] opacity-80">18 Decimals (Wei)</span>
              </div>
            </div>
            <span className="font-mono text-xs font-bold">{parseFloat(nativeUsdcBalance).toFixed(2)}</span>
          </button>

          <button
            type="button"
            onClick={() => setTokenType("erc20")}
            className={`py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center justify-between transition ${
              tokenType === "erc20"
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-cyan-300" />
              <div className="text-left">
                <span className="block font-bold">ERC-20 USDC</span>
                <span className="text-[10px] opacity-80">6 Decimals</span>
              </div>
            </div>
            <span className="font-mono text-xs font-bold">{parseFloat(erc20UsdcBalance).toFixed(2)}</span>
          </button>
        </div>

        {/* Transfer Form */}
        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Recipient Address (EVM / Arc Testnet)
            </label>
            <input
              type="text"
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Amount to Transfer ({tokenType === "native" ? "Native USDC" : "ERC-20 USDC"})
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.001"
                min="0.001"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 pr-16 text-sm text-emerald-400 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                USDC
              </span>
            </div>
          </div>

          {/* Fee & Finality Metrics */}
          <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span>Estimated Network Gas Fee:</span>
              <span className="font-mono text-emerald-400 font-semibold">~0.001 USDC (Native Gas)</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Deterministic Finality Speed:</span>
              <span className="font-mono text-cyan-400 font-semibold">&lt; 0.8 seconds</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Target Chain ID:</span>
              <span className="font-mono text-slate-200 font-semibold">5042002 (Arc Testnet)</span>
            </div>
          </div>

          {isConnected ? (
            <button
              type="submit"
              disabled={isSending}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-800 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
            >
              {isSending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Broadcasting Transaction to Arc Node...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send {amount} USDC on Arc</span>
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={onConnectWallet}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow"
            >
              Connect Wallet
            </button>
          )}
        </form>

        {sentTxHash && (
          <div className="p-4 bg-emerald-950/40 border border-emerald-800/50 rounded-xl text-xs space-y-2 animate-in fade-in">
            <div className="font-bold text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Transaction Finalized in 0.7s!</span>
            </div>
            <p className="font-mono text-emerald-200 text-[11px] break-all">
              Tx Hash: {sentTxHash}
            </p>
            <a
              href={`https://testnet.arcscan.app/tx/${sentTxHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-cyan-400 hover:underline text-[11px]"
            >
              <span>View on ArcScan Explorer</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>

      {/* Arc Gas & Decimal Facts Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl flex flex-col justify-between">
        <div className="space-y-4">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <span>Arc Gas Architecture</span>
          </h3>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="font-bold text-emerald-400 block">1. USDC as Native Gas</span>
              <p className="text-[11px] text-slate-400">
                Unlike standard EVM chains that use ETH for gas fees, Arc L1 uses USDC natively. Gas is paid directly in USDC.
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="font-bold text-cyan-400 block">2. Decimals Distinction</span>
              <p className="text-[11px] text-slate-400">
                <strong>Native Gas USDC</strong> uses <strong>18 decimals</strong> (wei scale in smart contract <code className="text-slate-200">msg.value</code>).<br/>
                <strong>ERC-20 Wrapped USDC</strong> uses <strong>6 decimals</strong>.
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="font-bold text-indigo-400 block">3. Sub-Second Finality</span>
              <p className="text-[11px] text-slate-400">
                Arc uses Circle's deterministic consensus engine providing &lt;1 second settlement without probabilistic reorgs.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 text-center">
          <a
            href={ARC_NETWORK_INFO.faucetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition border border-slate-700 flex items-center justify-center gap-2"
          >
            <span>Request Testnet Gas from Circle Faucet</span>
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
          </a>
        </div>
      </div>
    </div>
  );
};
