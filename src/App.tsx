import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { WalletModal } from './components/WalletModal';
import { AgentMarketplace } from './components/AgentMarketplace';
import { JobPortal } from './components/JobPortal';
import { ArcEscrowStudio } from './components/ArcEscrowStudio';
import { CctpBridgeView } from './components/CctpBridgeView';
import { ArcExplorerView } from './components/ArcExplorerView';
import { GitHubExportGuide } from './components/GitHubExportGuide';

import {
  AiAgent,
  Erc8183Job,
  EscrowAgreement,
  CrossChainBridgeTx,
  ArcWalletState,
} from './types/arc';

import {
  INITIAL_AI_AGENTS,
  INITIAL_ERC8183_JOBS,
  INITIAL_ESCROW_AGREEMENTS,
  INITIAL_BRIDGE_TXS,
} from './data/mockArcData';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('agents');
  const [showWalletModal, setShowWalletModal] = useState<boolean>(false);

  // Wallet State
  const [wallet, setWallet] = useState<ArcWalletState>({
    isConnected: false,
    address: '',
    nativeGasUsdcBalance: 0,
    erc20UsdcBalance: 0,
    isArcTestnet: false,
    providerType: 'simulated',
  });

  // Auto-detect existing Web3 wallet on mount & listen for changes
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      const ethereum = (window as any).ethereum;

      // Check if accounts already authorized
      ethereum
        .request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts && accounts.length > 0) {
            setWallet({
              isConnected: true,
              address: accounts[0],
              nativeGasUsdcBalance: 250.0,
              erc20UsdcBalance: 1500.0,
              isArcTestnet: true,
              providerType: 'metamask',
            });
          }
        })
        .catch((err: any) => console.warn('eth_accounts check error:', err));

      // Handle account changes
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          setWallet({
            isConnected: false,
            address: '',
            nativeGasUsdcBalance: 0,
            erc20UsdcBalance: 0,
            isArcTestnet: false,
            providerType: 'simulated',
          });
        } else {
          setWallet((prev) => ({
            ...prev,
            isConnected: true,
            address: accounts[0],
            providerType: 'metamask',
          }));
        }
      };

      // Handle chain changes
      const handleChainChanged = () => {
        window.location.reload();
      };

      ethereum.on?.('accountsChanged', handleAccountsChanged);
      ethereum.on?.('chainChanged', handleChainChanged);

      return () => {
        ethereum.removeListener?.('accountsChanged', handleAccountsChanged);
        ethereum.removeListener?.('chainChanged', handleChainChanged);
      };
    }
  }, []);

  // Data Collections
  const [agents, setAgents] = useState<AiAgent[]>(INITIAL_AI_AGENTS);
  const [jobs, setJobs] = useState<Erc8183Job[]>(INITIAL_ERC8183_JOBS);
  const [escrows, setEscrows] = useState<EscrowAgreement[]>(INITIAL_ESCROW_AGREEMENTS);
  const [bridgeTxs, setBridgeTxs] = useState<CrossChainBridgeTx[]>(INITIAL_BRIDGE_TXS);

  // Agent Selection state for Job Creation
  const [selectedAgentForJob, setSelectedAgentForJob] = useState<AiAgent | null>(null);

  // Handler: Faucet Claim
  const handleFaucetClaimed = (amount: number) => {
    setWallet((prev) => ({
      ...prev,
      nativeGasUsdcBalance: prev.nativeGasUsdcBalance + amount,
    }));
  };

  // Handler: Assign Agent to Job
  const handleSelectAgentForJob = (agent: AiAgent) => {
    setSelectedAgentForJob(agent);
    setActiveTab('jobs');
  };

  // Handler: Add Custom Agent
  const handleAddAgent = (newAgent: AiAgent) => {
    setAgents((prev) => [newAgent, ...prev]);
  };

  // Handler: Create Job
  const handleCreateJob = (newJob: Erc8183Job) => {
    setJobs((prev) => [newJob, ...prev]);

    // Deduct USDC escrow from wallet balance
    setWallet((prev) => ({
      ...prev,
      erc20UsdcBalance: Math.max(0, prev.erc20UsdcBalance - newJob.escrowUsdc),
    }));
  };

  // Handler: Update Job
  const handleUpdateJob = (updatedJob: Erc8183Job) => {
    setJobs((prev) => prev.map((j) => (j.id === updatedJob.id ? updatedJob : j)));
  };

  // Handler: Settle Job (Release Escrow Payout to Agent)
  const handleSettleJob = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          return {
            ...j,
            status: 'verified',
            updatedAt: new Date().toISOString(),
          };
        }
        return j;
      })
    );
  };

  // Handler: Create Escrow Agreement
  const handleCreateEscrow = (newEscrow: EscrowAgreement) => {
    setEscrows((prev) => [newEscrow, ...prev]);
    setWallet((prev) => ({
      ...prev,
      nativeGasUsdcBalance: Math.max(0, prev.nativeGasUsdcBalance - newEscrow.amountUsdc),
    }));
  };

  // Handler: Update Escrow Status
  const handleUpdateEscrowStatus = (escrowId: string, status: EscrowAgreement['status']) => {
    setEscrows((prev) =>
      prev.map((e) => (e.id === escrowId ? { ...e, status } : e))
    );
  };

  // Handler: Initiate CCTP Bridge
  const handleInitiateBridge = (newTx: CrossChainBridgeTx) => {
    setBridgeTxs((prev) => [newTx, ...prev]);
    setWallet((prev) => ({
      ...prev,
      nativeGasUsdcBalance: prev.nativeGasUsdcBalance + newTx.usdcAmount - newTx.feeUsdc,
    }));
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col font-sans selection:bg-[#0066FF] selection:text-white">
      {/* Top Sticky Header */}
      <Header
        wallet={wallet}
        onConnectWallet={() => setShowWalletModal(true)}
        onOpenFaucet={() => setShowWalletModal(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'agents' && (
          <AgentMarketplace
            agents={agents}
            onSelectAgentForJob={handleSelectAgentForJob}
            onAddAgent={handleAddAgent}
          />
        )}

        {activeTab === 'jobs' && (
          <JobPortal
            jobs={jobs}
            agents={agents}
            selectedAgentForJob={selectedAgentForJob}
            wallet={wallet}
            onClearSelectedAgent={() => setSelectedAgentForJob(null)}
            onCreateJob={handleCreateJob}
            onUpdateJob={handleUpdateJob}
            onSettleJob={handleSettleJob}
          />
        )}

        {activeTab === 'escrow' && (
          <ArcEscrowStudio
            escrows={escrows}
            wallet={wallet}
            onCreateEscrow={handleCreateEscrow}
            onUpdateEscrowStatus={handleUpdateEscrowStatus}
          />
        )}

        {activeTab === 'bridge' && (
          <CctpBridgeView
            bridgeTxs={bridgeTxs}
            wallet={wallet}
            onInitiateBridge={handleInitiateBridge}
          />
        )}

        {activeTab === 'explorer' && <ArcExplorerView />}

        {activeTab === 'github' && <GitHubExportGuide />}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/20 bg-[#000000] py-6 text-[10px] font-mono opacity-60 uppercase tracking-[0.3em]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white">ARC BUILD FLOW</span>
            <span>/</span>
            <span>CHAIN ID: 5042002</span>
            <span>/</span>
            <span>NATIVE GAS: USDC (18 DECIMALS)</span>
          </div>

          <div className="flex items-center gap-6 text-white/70">
            <a
              href="https://testnet.arcscan.app"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#0066FF] transition"
            >
              ARCSCAN EXPLORER
            </a>
            <a
              href="https://faucet.circle.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#0066FF] transition"
            >
              CIRCLE FAUCET
            </a>
            <a
              href="https://docs.arc.io"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#0066FF] transition"
            >
              ARC DOCUMENTATION
            </a>
          </div>
        </div>
      </footer>

      {/* Wallet & Faucet Modal */}
      <WalletModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        wallet={wallet}
        setWallet={setWallet}
        onFaucetClaimed={handleFaucetClaimed}
      />
    </div>
  );
}
