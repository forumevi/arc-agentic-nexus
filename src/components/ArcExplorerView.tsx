import React, { useState } from 'react';
import { ethers } from 'ethers';
import { CrossChainBridgeTx, ARC_TESTNET_CONFIG, ArcWalletState } from '../types/arc';
import { ArrowUpRight, ArrowRight, RefreshCw, CheckCircle, ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react';

interface CctpBridgeViewProps {
  bridgeTxs: CrossChainBridgeTx[];
  wallet?: ArcWalletState;
  onInitiateBridge: (tx: CrossChainBridgeTx) => void;
}

export const CctpBridgeView: React.FC<CctpBridgeViewProps> = ({
  bridgeTxs,
  wallet,
  onInitiateBridge,
}) => {
  const [sourceChain, setSourceChain] = useState<'Ethereum Sepolia' | 'Arbitrum Sepolia' | 'Solana Devnet'>('Arbitrum Sepolia');
  const [amount, setAmount] = useState('100');
  const [bridging, setBridging] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [bridgeError, setBridgeError] = useState('');

  const estimatedFee = (parseFloat(amount) * 0.0025 || 0.25).toFixed(2);

  const handleBridgeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const usdcVal = parseFloat(amount);
    if (isNaN(usdcVal) || usdcVal <= 0) return;
    setBridgeError('');

    let realTxHash = '';

    // If MetaMask is connected, request real transaction confirmation popup
    if (wallet?.isConnected && wallet?.providerType === 'metamask' && typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        setBridging(true);
        setActiveStep(1);
        const ethereum = (window as any).ethereum;
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();

        const tx = await signer.sendTransaction({
          to: ARC_TESTNET_CONFIG.cctpMessageTransmitter,
          value: ethers.parseEther('0'),
          data: ethers.hexlify(ethers.toUtf8Bytes(`CCTP DepositForBurn: ${usdcVal} USDC from ${sourceChain} to Arc Testnet`)),
        });

        realTxHash = tx.hash;
      } catch (err: any) {
        console.error('CCTP Bridge MetaMask Error:', err);
        setBridging(false);
        setActiveStep(null);
        if (err?.code === 4001 || err?.message?.toLowerCase().includes('user rejected')) {
          setBridgeError('MetaMask köprü işlemi kullanıcı tarafından iptal edildi.');
        } else {
          setBridgeError(`MetaMask Hata: ${err?.reason || err?.message || 'Köprü işlemi başarısız'}`);
        }
        return;
      }
    } else {
      setBridging(true);
      setActiveStep(1);
    }

    setTimeout(() => {
      // Step 2: Fetch Circle CCTP Attestation
      setActiveStep(2);

      setTimeout(() => {
        // Step 3: Mint Native USDC Gas on Arc Testnet
        setActiveStep(3);

        setTimeout(() => {
          const newTx: CrossChainBridgeTx = {
            id: `cctp-tx-${Date.now().toString().slice(-4)}`,
            sourceChain,
            destChain: 'Arc Testnet',
            usdcAmount: usdcVal,
            status: 'completed',
            cctpNonce: Math.floor(Math.random() * 899999 + 100000).toString(),
            timestamp: new Date().toISOString(),
            txHash: realTxHash || `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
            feeUsdc: parseFloat(estimatedFee),
          };

          onInitiateBridge(newTx);
          setBridging(false);
          setActiveStep(null);
        }, 1200);
      }, 1200);
    }, 1200);
  };

  return (
    <div className="space-y-6 select-none">
      {/* CCTP Header */}
      <div className="bg-black border border-white/20 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#00FF41]">
                04 / CROSS-CHAIN ENGINE
              </span>
              <span className="text-white/30">•</span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/60">
                CIRCLE CCTP PROTOCOL
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tighter">
              CROSS-CHAIN <span className="text-[#0066FF]">USDC BRIDGE</span>
            </h2>
            <p className="text-xs sm:text-sm text-white/70 max-w-2xl font-sans leading-relaxed">
              Burn USDC on source chains (Ethereum, Arbitrum, Solana) and mint native USDC gas directly on Arc Testnet using Circle CCTP zero-slippage cross-chain messaging protocol.
            </p>
          </div>

          <div className="bg-white/5 p-5 border border-white/10 space-y-2 font-mono text-xs shrink-0">
            <div className="text-white/40 text-[10px] font-bold uppercase tracking-widest">UNIFIED BALANCE SUMMARY</div>
            <div className="text-2xl font-black text-[#00FF41]">2,850.00 USDC</div>
            <div className="text-[10px] text-white/50 flex items-center gap-2">
              <span>Arbitrum: 1,000</span> / <span>Ethereum: 500</span> / <span className="text-[#0066FF] font-bold">Arc: 1,350</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bridge Widget */}
        <div className="lg:col-span-1 bg-black border border-white/20 p-6 space-y-6">
          <h3 className="font-black text-white text-base uppercase tracking-wider flex items-center gap-2">
            <ArrowUpRight className="w-4 h-4 text-[#0066FF]" /> CCTP TRANSFER FORM
          </h3>

          <form onSubmit={handleBridgeSubmit} className="space-y-5">
            {/* Source Chain */}
            <div>
              <label className="block text-[10px] font-bold text-white/60 uppercase tracking-[0.2em] mb-2">SOURCE CHAIN</label>
              <select
                value={sourceChain}
                onChange={(e) => setSourceChain(e.target.value as any)}
                disabled={bridging}
                className="w-full bg-black border border-white/30 p-3 text-xs text-white focus:border-[#0066FF] focus:outline-none font-mono"
              >
                <option value="Arbitrum Sepolia">Arbitrum Sepolia (Domain 3)</option>
                <option value="Ethereum Sepolia">Ethereum Sepolia (Domain 0)</option>
                <option value="Solana Devnet">Solana Devnet (Domain 5)</option>
              </select>
            </div>

            {/* Destination Chain */}
            <div>
              <label className="block text-[10px] font-bold text-white/60 uppercase tracking-[0.2em] mb-2">DESTINATION CHAIN</label>
              <input
                type="text"
                disabled
                value="Arc Testnet (Native USDC Gas)"
                className="w-full bg-black border border-[#0066FF] p-3 text-xs text-[#0066FF] font-bold font-mono cursor-not-allowed"
              />
            </div>

            {/* USDC Amount */}
            <div>
              <label className="block text-[10px] font-bold text-white/60 uppercase tracking-[0.2em] mb-2">AMOUNT (USDC)</label>
              <input
                type="number"
                required
                disabled={bridging}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-black border border-white/30 p-3 text-sm font-black font-mono text-[#00FF41] focus:border-[#0066FF] focus:outline-none"
              />
            </div>

            {/* Estimated Fees */}
            {bridgeError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500 text-rose-400 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{bridgeError}</span>
              </div>
            )}

            <div className="bg-white/5 p-4 border border-white/10 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-white/50">
                <span>CCTP FEE (0.25%):</span>
                <span className="text-white font-bold">{estimatedFee} USDC</span>
              </div>
              <div className="flex justify-between text-white/50">
                <span>ARC NATIVE GAS MINTED:</span>
                <span className="text-[#00FF41] font-bold">
                  {(parseFloat(amount) || 0) - parseFloat(estimatedFee)} USDC
                </span>
              </div>
            </div>

            {/* Bridge Progress Tracker */}
            {bridging && (
              <div className="bg-black border border-[#0066FF] p-4 space-y-3 text-xs font-mono">
                <div className="font-bold text-[#0066FF] uppercase tracking-wider">CCTP ATTESTATION PIPELINE</div>
                <div className="space-y-2 text-[11px]">
                  <div className={`flex items-center gap-2 ${activeStep === 1 ? 'text-[#00FF41] font-bold' : 'text-white/40'}`}>
                    <RefreshCw className={`w-3.5 h-3.5 ${activeStep === 1 ? 'animate-spin' : ''}`} /> 1. BURN USDC ON {sourceChain.toUpperCase()}
                  </div>
                  <div className={`flex items-center gap-2 ${activeStep === 2 ? 'text-[#00FF41] font-bold' : 'text-white/40'}`}>
                    <RefreshCw className={`w-3.5 h-3.5 ${activeStep === 2 ? 'animate-spin' : ''}`} /> 2. CIRCLE OFF-CHAIN ATTESTATION
                  </div>
                  <div className={`flex items-center gap-2 ${activeStep === 3 ? 'text-[#00FF41] font-bold' : 'text-white/40'}`}>
                    <RefreshCw className={`w-3.5 h-3.5 ${activeStep === 3 ? 'animate-spin' : ''}`} /> 3. MINT NATIVE GAS USDC ON ARC TESTNET
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={bridging}
              className="w-full py-4 bg-white hover:bg-[#0066FF] hover:text-white text-black font-black text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 border border-white"
            >
              {bridging ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> BRIDGING VIA CCTP...
                </>
              ) : (
                <>
                  <ArrowUpRight className="w-4 h-4" /> INITIATE CCTP TRANSFER
                </>
              )}
            </button>
          </form>
        </div>

        {/* Bridge History */}
        <div className="lg:col-span-2 bg-black border border-white/20 p-6 space-y-5">
          <h3 className="font-black text-white text-base uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0066FF]" /> CIRCLE CCTP TRANSACTION LEDGER
          </h3>

          <div className="space-y-3">
            {bridgeTxs.map((tx) => (
              <div
                key={tx.id}
                className="bg-black border border-white/10 hover:border-white/30 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold text-white uppercase">{tx.sourceChain}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#0066FF]" />
                    <span className="font-bold text-[#0066FF] uppercase">ARC TESTNET</span>
                  </div>
                  <div className="text-[10px] text-white/50 font-mono">
                    NONCE: #{tx.cctpNonce} / {new Date(tx.timestamp).toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right font-mono">
                    <div className="text-base font-black text-[#00FF41]">+{tx.usdcAmount} USDC</div>
                    <div className="text-[10px] text-white/40">FEE: {tx.feeUsdc} USDC</div>
                  </div>

                  <span className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider bg-black text-[#00FF41] border border-[#00FF41] flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-[#00FF41]" /> MINTED
                  </span>

                  <a
                    href={`${ARC_TESTNET_CONFIG.explorerUrl}/tx/${tx.txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-black hover:bg-white hover:text-black text-white border border-white/20 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
