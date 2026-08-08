import React, { useState } from 'react';
import { ethers } from 'ethers';
import { EscrowAgreement, ARC_TESTNET_CONFIG, ArcWalletState } from '../types/arc';
import { Lock, Unlock, AlertTriangle, ExternalLink, Plus, RefreshCw, AlertCircle } from 'lucide-react';
import { executeArcOnChainTx } from '../utils/web3Tx';

interface ArcEscrowStudioProps {
  escrows: EscrowAgreement[];
  wallet?: ArcWalletState;
  onCreateEscrow: (escrow: EscrowAgreement) => void;
  onUpdateEscrowStatus: (escrowId: string, status: EscrowAgreement['status']) => void;
}

export const ArcEscrowStudio: React.FC<ArcEscrowStudioProps> = ({
  escrows,
  wallet,
  onCreateEscrow,
  onUpdateEscrowStatus,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [payee, setPayee] = useState('');
  const [amountUsdc, setAmountUsdc] = useState('100');
  const [purpose, setPurpose] = useState('');
  const [conditions, setConditions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txError, setTxError] = useState('');

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !payee.trim()) return;
    setTxError('');

    let realTxHash = '';
    const numAmount = parseFloat(amountUsdc) || 100;

    // Only invoke real MetaMask transaction if user specifically connected via MetaMask
    if (wallet?.isConnected && wallet?.providerType === 'metamask') {
      setIsSubmitting(true);
      const txRes = await executeArcOnChainTx(wallet, 'LOCK_VAULT', {
        amountUsdc: numAmount,
        title: `Escrow:${title}`,
        recipient: payee,
      });

      setIsSubmitting(false);

      if (!txRes.success) {
        setTxError(txRes.error || 'MetaMask transaction was cancelled or rejected.');
        return;
      }
      realTxHash = txRes.txHash;
    }

    const newEscrow: EscrowAgreement = {
      id: `escrow-arc-${Date.now().toString().slice(-4)}`,
      title,
      payer: wallet?.address ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}` : '0x7099...79C8 (Connected Wallet)',
      payee,
      amountUsdc: numAmount,
      purpose,
      status: 'funded',
      createdAt: new Date().toISOString(),
      txHash: realTxHash || `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      releaseConditions: conditions || 'Satisfactory completion of task deliverables',
    };

    onCreateEscrow(newEscrow);
    setShowModal(false);
    setTitle('');
    setPayee('');
    setPurpose('');
    setConditions('');
  };

  const handleUpdateStatusWithMetaMask = async (escrowId: string, status: EscrowAgreement['status']) => {
    if (wallet?.isConnected && wallet?.providerType === 'metamask') {
      const txRes = await executeArcOnChainTx(wallet, 'RELEASE_PAYOUT', {
        amountUsdc: 0,
        title: `Update:${escrowId}:${status}`,
      });

      if (!txRes.success) {
        alert('MetaMask transaction was cancelled or rejected.');
        return;
      }
    }
    onUpdateEscrowStatus(escrowId, status);
  };

  return (
    <div className="space-y-6 select-none">
      {/* Header Banner */}
      <div className="bg-black border border-white/20 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#00FF41]">
              03 / VAULT CONTRACTS
            </span>
            <span className="text-white/30">•</span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/60">
              DETERMINISTIC FINALITY
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tighter">
            USDC SMART <span className="text-[#0066FF]">ESCROW VAULT</span>
          </h2>
          <p className="text-xs sm:text-sm text-white/70 max-w-2xl font-sans leading-relaxed">
            Escrow contract engine optimized for Arc Network where native gas is USDC. Funds are held in a deterministic finality contract until release conditions or dispute settlements occur.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-4 bg-white text-black hover:bg-[#0066FF] hover:text-white font-black text-xs uppercase tracking-wider transition-colors flex items-center gap-2 shrink-0 border border-white"
        >
          <Plus className="w-4 h-4" />
          <span>CREATE ESCROW VAULT</span>
        </button>
      </div>

      {/* Escrow Agreements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {escrows.map((e) => (
          <div
            key={e.id}
            className="bg-black border border-white/20 hover:border-[#0066FF] p-6 transition space-y-5 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#0066FF] font-bold">{e.id}</span>
                {e.status === 'funded' && (
                  <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider bg-black text-amber-400 border border-amber-400/50 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" /> FUNDED & LOCKED
                  </span>
                )}
                {e.status === 'released' && (
                  <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider bg-black text-[#00FF41] border border-[#00FF41] flex items-center gap-1.5">
                    <Unlock className="w-3.5 h-3.5" /> RELEASED & SETTLED
                  </span>
                )}
                {e.status === 'disputed' && (
                  <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider bg-black text-rose-400 border border-rose-400/50 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> IN DISPUTE
                  </span>
                )}
              </div>

              <h3 className="font-black text-white text-lg uppercase tracking-tight">{e.title}</h3>

              <div className="bg-white/5 p-4 border border-white/10 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-white/40 uppercase font-bold">AMOUNT LOCKED:</span>
                  <span className="text-[#00FF41] font-bold">{e.amountUsdc} USDC</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/40 uppercase font-bold">PAYER:</span>
                  <span className="text-white">{e.payer}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/40 uppercase font-bold">PAYEE:</span>
                  <span className="text-white">{e.payee}</span>
                </div>
              </div>

              <p className="text-xs text-white/80 leading-relaxed font-sans">{e.purpose}</p>

              <div className="p-3 bg-black border border-white/10 text-[11px] font-mono space-y-1">
                <span className="font-bold text-[#0066FF] uppercase tracking-wider block">RELEASE CONDITION:</span>
                <p className="text-white/70">{e.releaseConditions}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-white/20 pt-4 flex items-center justify-between gap-3 text-xs">
              <a
                href={`${ARC_TESTNET_CONFIG.explorerUrl}/tx/${e.txHash}`}
                target="_blank"
                rel="noreferrer"
                className="text-[#0066FF] hover:text-white font-mono text-[11px] font-bold flex items-center gap-1"
              >
                ARCSCAN TX <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {e.status === 'funded' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateStatusWithMetaMask(e.id, 'disputed')}
                    className="px-3.5 py-2 border border-rose-500/50 text-rose-400 hover:bg-rose-500 hover:text-black font-bold uppercase text-[10px] tracking-wider transition-colors"
                  >
                    RAISE DISPUTE
                  </button>
                  <button
                    onClick={() => handleUpdateStatusWithMetaMask(e.id, 'released')}
                    className="px-4 py-2 bg-[#00FF41] text-black hover:bg-white font-black uppercase text-xs tracking-wider transition-colors flex items-center gap-1"
                  >
                    <Unlock className="w-3.5 h-3.5" /> RELEASE PAYOUT
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fadeIn">
          <div className="bg-black border border-white/30 w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="px-6 py-5 border-b border-white/20 flex items-center justify-between">
              <h3 className="font-black text-white text-base uppercase tracking-wider flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#0066FF]" /> CREATE ARC ESCROW AGREEMENT
              </h3>
              <button onClick={() => setShowModal(false)} className="text-white/60 hover:text-white font-mono text-lg font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-white/60 uppercase tracking-[0.2em] mb-2">AGREEMENT TITLE</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. AI Security Audit Service"
                  className="w-full bg-black border border-white/30 p-3 text-xs text-white focus:border-[#0066FF] focus:outline-none font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-white/60 uppercase tracking-[0.2em] mb-2">PAYEE WALLET / AGENT</label>
                  <input
                    type="text"
                    required
                    value={payee}
                    onChange={(e) => setPayee(e.target.value)}
                    placeholder="0x8183... or AI Agent ID"
                    className="w-full bg-black border border-white/30 p-3 text-xs text-white focus:border-[#0066FF] focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-white/60 uppercase tracking-[0.2em] mb-2">AMOUNT (NATIVE USDC)</label>
                  <input
                    type="number"
                    required
                    value={amountUsdc}
                    onChange={(e) => setAmountUsdc(e.target.value)}
                    className="w-full bg-black border border-white/30 p-3 text-xs text-[#00FF41] font-mono font-bold focus:border-[#0066FF] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-white/60 uppercase tracking-[0.2em] mb-2">PURPOSE & SCOPE</label>
                <input
                  type="text"
                  required
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="Audit Solidity contracts on Arc Testnet"
                  className="w-full bg-black border border-white/30 p-3 text-xs text-white focus:border-[#0066FF] focus:outline-none font-sans"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-white/60 uppercase tracking-[0.2em] mb-2">RELEASE CONDITIONS</label>
                <textarea
                  rows={3}
                  required
                  value={conditions}
                  onChange={(e) => setConditions(e.target.value)}
                  placeholder="Delivery of full security report with pass score > 90%"
                  className="w-full bg-black border border-white/30 p-3 text-xs text-white focus:border-[#0066FF] focus:outline-none font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-3 border border-white/20 text-white/80 hover:text-white text-xs font-bold uppercase tracking-wider"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#0066FF] hover:bg-white hover:text-black text-white font-black text-xs uppercase tracking-wider transition-colors flex items-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5" /> LOCK ESCROW VAULT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArcEscrowStudio;
