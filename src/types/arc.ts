export interface ArcNetworkConfig {
  chainId: number;
  chainIdHex: string;
  name: string;
  rpcUrl: string;
  explorerUrl: string;
  nativeGasSymbol: string;
  nativeGasDecimals: number;
  erc20UsdcDecimals: number;
  usdcContractAddress: string;
  escrowContractAddress: string;
  jobRegistryContractAddress: string;
}

export const ARC_TESTNET_CONFIG: ArcNetworkConfig = {
  chainId: 5042002,
  chainIdHex: '0x4cef52',
  name: 'Arc Testnet',
  rpcUrl: 'https://rpc.testnet.arc.io',
  explorerUrl: 'https://testnet.arcscan.app',
  nativeGasSymbol: 'USDC',
  nativeGasDecimals: 18,
  erc20UsdcDecimals: 6,
  usdcContractAddress: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
  escrowContractAddress: '0x3A9b1C4d5E8f7023419999120Aa1139488Cc20A1',
  jobRegistryContractAddress: '0x8183A1C29f04128490a039d9101BC44781C200EF',
};

export interface AiAgent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  description: string;
  capabilities: string[];
  reputationScore: number; // e.g. 98.5
  completedJobsCount: number;
  hourlyRateUsdc: number;
  status: 'active' | 'busy' | 'offline';
  specialization: 'Smart Contract Audit' | 'DeFi Strategy' | 'Data Analytics' | 'Automated Trading' | 'Content & Marketing';
  walletAddress: string;
}

export type JobStatus = 'open' | 'assigned' | 'executing' | 'completed' | 'verified' | 'disputed';

export interface Erc8183Job {
  id: string;
  title: string;
  category: string;
  description: string;
  requirements: string[];
  escrowUsdc: number;
  agentId?: string;
  agentName?: string;
  status: JobStatus;
  creatorAddress: string;
  deliverableText?: string;
  deliverableCode?: string;
  verificationScore?: number;
  executionTimeMs?: number;
  createdAt: string;
  updatedAt: string;
  txHash?: string;
}

export interface EscrowAgreement {
  id: string;
  title: string;
  payer: string;
  payee: string;
  amountUsdc: number;
  purpose: string;
  status: 'funded' | 'released' | 'disputed' | 'refunded';
  createdAt: string;
  txHash: string;
  releaseConditions: string;
}

export interface CrossChainBridgeTx {
  id: string;
  sourceChain: 'Ethereum Sepolia' | 'Arbitrum Sepolia' | 'Solana Devnet';
  destChain: 'Arc Testnet';
  usdcAmount: number;
  status: 'initiated' | 'attesting' | 'completed' | 'failed';
  cctpNonce: string;
  timestamp: string;
  txHash: string;
  feeUsdc: number;
}

export interface ArcWalletState {
  isConnected: boolean;
  address: string;
  nativeGasUsdcBalance: number; // 18 decimals representation
  erc20UsdcBalance: number;     // 6 decimals representation
  isArcTestnet: boolean;
  providerType: 'simulated' | 'metamask' | 'injected';
}
