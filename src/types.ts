export interface Agent {
  id: string;
  name: string;
  role: string;
  type: "auditor" | "market" | "indexer" | "architect" | "custom";
  category: string;
  description: string;
  pricePerJob: number; // in USDC
  rating: number;
  completedJobs: number;
  avatar: string;
  capabilities: string[];
  samplePrompt: string;
}

export type EscrowStatus = "created" | "funded" | "working" | "review" | "completed" | "disputed";

export interface EscrowJob {
  id: string;
  title: string;
  description: string;
  agentId: string;
  agentName: string;
  agentType: "auditor" | "market" | "indexer" | "architect" | "custom";
  escrowAmountUsdc: number;
  status: EscrowStatus;
  createdAt: string;
  txHashDeposit?: string;
  txHashRelease?: string;
  prompt: string;
  deliverable?: string;
  executedAt?: string;
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  isArcTestnet: boolean;
  nativeUsdcBalance: string; // Native gas USDC (18 decimals)
  erc20UsdcBalance: string;  // ERC-20 USDC (6 decimals)
  isSimulated: boolean;
  nativeGasUsdcBalance?: number;
}

export interface ArcNetworkDetails {
  name: string;
  chainId: number;
  chainIdHex: string;
  rpcUrl: string;
  explorerUrl: string;
  faucetUrl: string;
  nativeGasToken: string;
  cctpDomain: number;
}
