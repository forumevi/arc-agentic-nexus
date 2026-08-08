import { AiAgent, Erc8183Job, EscrowAgreement, CrossChainBridgeTx } from '../types/arc';

export const INITIAL_AI_AGENTS: AiAgent[] = [
  {
    id: 'agent-sentinel',
    name: 'Arc-Sentinel AI Audit',
    role: 'Smart Contract Auditor & Security Guard',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=250&q=80',
    description: 'Specializes in Solidity security vulnerability detection, Arc USDC native gas token compliance, and reentrancy checks.',
    capabilities: ['Solidity Static Analysis', 'Arc Gas Token Checks', 'Reentrancy Vulnerability Scan', 'ERC-8183 Standards Compliance'],
    reputationScore: 99.4,
    completedJobsCount: 142,
    hourlyRateUsdc: 25,
    status: 'active',
    specialization: 'Smart Contract Audit',
    walletAddress: '0x8183...A991'
  },
  {
    id: 'agent-cctp-opt',
    name: 'CCTP Liquidity Keeper',
    role: 'Cross-Chain USDC Bridge Router',
    avatar: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=250&q=80',
    description: 'Monitors Circle CCTP message attestations across Ethereum, Arbitrum, and Arc Testnet to optimize crosschain liquidity routes.',
    capabilities: ['Circle CCTP Attestation Fetching', 'Gas Estimation in Native USDC', 'Cross-chain Arbitrage Analysis', 'Nonce Tracking'],
    reputationScore: 98.1,
    completedJobsCount: 89,
    hourlyRateUsdc: 15,
    status: 'active',
    specialization: 'DeFi Strategy',
    walletAddress: '0x3C4B...D802'
  },
  {
    id: 'agent-data-synth',
    name: 'ArcDataSynthesizer',
    role: 'On-Chain Event Analytics & Report Generator',
    avatar: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=250&q=80',
    description: 'Parses ArcScan transaction logs, tracks stable fee metrics, and outputs executive JSON/Markdown reports.',
    capabilities: ['Arc Event Indexing', 'Stable Fee Calculation', 'CSV/JSON Data Export', 'Deterministic Finality Verification'],
    reputationScore: 97.8,
    completedJobsCount: 64,
    hourlyRateUsdc: 18,
    status: 'active',
    specialization: 'Data Analytics',
    walletAddress: '0x7E12...F910'
  },
  {
    id: 'agent-trading-keeper',
    name: 'DeFi Autonomous Keeper',
    role: 'Automated Arc Swap Executor',
    avatar: 'https://images.unsplash.com/photo-1614680376593-902f749f7bc2?auto=format&fit=crop&w=250&q=80',
    description: 'Executes programmed trading strategies on Arc DEXs with zero-slippage protection using USDC gas limits.',
    capabilities: ['Automated Swap Execution', 'Slippage Guard', 'Stablecoin Peg Monitoring', 'Limit Orders'],
    reputationScore: 96.9,
    completedJobsCount: 112,
    hourlyRateUsdc: 20,
    status: 'active',
    specialization: 'Automated Trading',
    walletAddress: '0x9920...C143'
  }
];

export const INITIAL_ERC8183_JOBS: Erc8183Job[] = [
  {
    id: 'job-8183-101',
    title: 'Audit Arc USDC Escrow Smart Contract',
    category: 'Smart Contract Audit',
    description: 'Perform a comprehensive security audit on an Arc Testnet escrow smart contract. Verify native USDC gas decimal calculations (18 decimals vs 6 decimals ERC20) and reentrancy protections.',
    requirements: [
      'Check native USDC gas calculation math',
      'Verify ERC-8183 job state transitions',
      'Run reentrancy checks',
      'Provide Markdown audit summary'
    ],
    escrowUsdc: 50,
    agentId: 'agent-sentinel',
    agentName: 'Arc-Sentinel AI Audit',
    status: 'completed',
    creatorAddress: '0x7099...79C8',
    deliverableText: 'Audit Completed Successfully. Contract is fully compliant with Arc Testnet gas specifications.',
    deliverableCode: `// Arc Escrow Compliance Audit Result
// Status: PASSED (0 Critical, 0 High, 1 Low Info)
// Gas Token: Native USDC (18 decimals verified)
// Recommendation: Add ReentrancyGuard on releaseEscrow() function.`,
    verificationScore: 98,
    executionTimeMs: 1420,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    txHash: '0x4f82a9d10e34c92b87a12e104f981293a10e71b29a834c9a700192837f6209ef'
  },
  {
    id: 'job-8183-102',
    title: 'Crosschain CCTP Fee & Speed Optimization Analysis',
    category: 'DeFi Strategy',
    description: 'Analyze liquidity transfer efficiency between Arbitrum Sepolia and Arc Testnet using Circle CCTP v2 SDK.',
    requirements: [
      'Estimate message attestation latency',
      'Compare fee structures for native gas USDC vs bridge fees',
      'Generate routing recommendations'
    ],
    escrowUsdc: 30,
    agentId: 'agent-cctp-opt',
    agentName: 'CCTP Liquidity Keeper',
    status: 'open',
    creatorAddress: '0x3C44...1290',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  }
];

export const INITIAL_ESCROW_AGREEMENTS: EscrowAgreement[] = [
  {
    id: 'escrow-arc-001',
    title: 'AI Code Audit Service Escrow',
    payer: '0x7099...79C8',
    payee: '0x8183...A991 (Arc-Sentinel)',
    amountUsdc: 50,
    purpose: 'Smart Contract Audit for Arc Escrow Vault',
    status: 'released',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    txHash: '0x123a9f82d10e34c92b87a12e104f981293a10e71b29a834c9a700192837f6209e',
    releaseConditions: 'Satisfactory audit report delivered with verification score > 90%'
  },
  {
    id: 'escrow-arc-002',
    title: 'Crosschain Liquidity Routing Job',
    payer: '0x3C44...1290',
    payee: '0x3C4B...D802 (CCTP Keeper)',
    amountUsdc: 30,
    purpose: 'CCTP Arbitrum -> Arc Routing Analysis',
    status: 'funded',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    txHash: '0x88f2a9d10e34c92b87a12e104f981293a10e71b29a834c9a700192837f6209f',
    releaseConditions: 'Delivery of CCTP latency & fee report'
  }
];

export const INITIAL_BRIDGE_TXS: CrossChainBridgeTx[] = [
  {
    id: 'cctp-tx-991',
    sourceChain: 'Arbitrum Sepolia',
    destChain: 'Arc Testnet',
    usdcAmount: 100,
    status: 'completed',
    cctpNonce: '8492019',
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    txHash: '0x7711a9d10e34c92b87a12e104f981293a10e71b29a834c9a700192837f6209a',
    feeUsdc: 0.25
  },
  {
    id: 'cctp-tx-992',
    sourceChain: 'Ethereum Sepolia',
    destChain: 'Arc Testnet',
    usdcAmount: 250,
    status: 'completed',
    cctpNonce: '8492025',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    txHash: '0x3344a9d10e34c92b87a12e104f981293a10e71b29a834c9a700192837f6209b',
    feeUsdc: 0.50
  }
];

export const ARC_SOLAR_SMART_CONTRACT_SAMPLES = {
  escrowSol: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ArcUsdcEscrow
 * @dev Escrow contract for Arc Testnet where native gas is USDC (18 decimals)
 */
contract ArcUsdcEscrow {
    address public payer;
    address public payee;
    uint256 public amountNativeUsdc;
    bool public isReleased;
    bool public isDisputed;

    event EscrowFunded(address indexed payer, address indexed payee, uint256 amount);
    event EscrowReleased(address indexed payee, uint256 amount);
    event EscrowDisputed(address indexed disputer);

    constructor(address _payee) payable {
        require(msg.value > 0, "Escrow requires native USDC gas deposit");
        payer = msg.sender;
        payee = _payee;
        amountNativeUsdc = msg.value;
        emit EscrowFunded(msg.sender, _payee, msg.value);
    }

    function release() external {
        require(msg.sender == payer, "Only payer can release funds");
        require(!isReleased, "Already released");
        require(!isDisputed, "Escrow is in dispute");

        isReleased = true;
        (bool success, ) = payable(payee).call{value: amountNativeUsdc}("");
        require(success, "USDC transfer failed");

        emit EscrowReleased(payee, amountNativeUsdc);
    }

    function dispute() external {
        require(msg.sender == payer || msg.sender == payee, "Not party to escrow");
        isDisputed = true;
        emit EscrowDisputed(msg.sender);
    }
}`,

  erc8183RegistrySol: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ArcErc8183JobRegistry
 * @dev ERC-8183 Standard Job Registry for Autonomous AI Agents on Arc Network
 */
contract ArcErc8183JobRegistry {
    enum JobState { Open, Assigned, Executing, Completed, Verified }

    struct Job {
        uint256 jobId;
        address creator;
        address agentWallet;
        uint256 escrowUsdc;
        JobState state;
        string deliverableHash;
    }

    mapping(uint256 => Job) public jobs;
    uint256 public nextJobId = 1;

    event JobCreated(uint256 indexed jobId, address creator, uint256 escrowAmount);
    event JobAssigned(uint256 indexed jobId, address agent);
    event JobCompleted(uint256 indexed jobId, string deliverableHash);
    event JobSettled(uint256 indexed jobId, address agent, uint256 payoutAmount);

    function createJob() external payable returns (uint256) {
        require(msg.value > 0, "Must stake USDC escrow");
        uint256 jobId = nextJobId++;
        jobs[jobId] = Job({
            jobId: jobId,
            creator: msg.sender,
            agentWallet: address(0),
            escrowUsdc: msg.value,
            state: JobState.Open,
            deliverableHash: ""
        });
        emit JobCreated(jobId, msg.sender, msg.value);
        return jobId;
    }

    function assignAgent(uint256 jobId, address agent) external {
        Job storage job = jobs[jobId];
        require(msg.sender == job.creator, "Only creator can assign");
        require(job.state == JobState.Open, "Job not open");
        job.agentWallet = agent;
        job.state = JobState.Assigned;
        emit JobAssigned(jobId, agent);
    }

    function submitDeliverable(uint256 jobId, string memory deliverableHash) external {
        Job storage job = jobs[jobId];
        require(msg.sender == job.agentWallet, "Only assigned agent can submit");
        job.deliverableHash = deliverableHash;
        job.state = JobState.Completed;
        emit JobCompleted(jobId, deliverableHash);
    }

    function settleJob(uint256 jobId) external {
        Job storage job = jobs[jobId];
        require(msg.sender == job.creator, "Only creator can settle");
        require(job.state == JobState.Completed, "Job not completed");
        
        job.state = JobState.Verified;
        (bool success, ) = payable(job.agentWallet).call{value: job.escrowUsdc}("");
        require(success, "Payout failed");
        
        emit JobSettled(jobId, job.agentWallet, job.escrowUsdc);
    }
}`
};
