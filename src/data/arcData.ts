import { Agent, ArcNetworkDetails, EscrowJob } from "../types";

export const ARC_NETWORK_INFO: ArcNetworkDetails = {
  name: "Arc Testnet",
  chainId: 5042002,
  chainIdHex: "0x4cf18a",
  rpcUrl: "https://rpc.testnet.arc.io",
  explorerUrl: "https://testnet.arcscan.app",
  faucetUrl: "https://faucet.circle.com",
  nativeGasToken: "USDC (18 decimals)",
  cctpDomain: 12,
};

export const INITIAL_AGENTS: Agent[] = [
  {
    id: "agent-1",
    name: "Arc Guard AI",
    role: "Smart Contract & Security Auditor",
    type: "auditor",
    category: "Security & Auditing",
    description: "Performs instant deep-security static analysis and logic auditing for EVM contracts on Arc, verifying USDC decimal mechanics & reentrancy guards.",
    pricePerJob: 15,
    rating: 4.9,
    completedJobs: 142,
    avatar: "🛡️",
    capabilities: [
      "Reentrancy & Overflow Checks",
      "Arc USDC Decimal Verification (18 vs 6 decimals)",
      "Gas Optimization Analysis",
      "ERC-8183 Escrow Standard Audit"
    ],
    samplePrompt: `// Audit this contract for Arc Testnet deployment:
contract SimpleVault {
    mapping(address => uint256) public balances;
    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }
    function withdraw(uint256 _amount) external {
        require(balances[msg.sender] >= _amount);
        (bool sent, ) = msg.sender.call{value: _amount}("");
        require(sent, "Failed");
        balances[msg.sender] -= _amount;
    }
}`
  },
  {
    id: "agent-2",
    name: "Arc Pulse Intel",
    role: "Liquidity & CCTP Market Analyst",
    type: "market",
    category: "DeFi & Cross-Chain",
    description: "Monitors Circle CCTP V2 transfers, cross-chain USDC bridging routes, and Arc Testnet liquidity depth for optimal yield and swap efficiency.",
    pricePerJob: 10,
    rating: 4.8,
    completedJobs: 98,
    avatar: "📊",
    capabilities: [
      "Cross-Chain CCTP Bridging Routes",
      "Arc Native USDC Gas Cost Forecasting",
      "Liquidity Pool Depth Analysis",
      "Unified Balance Spend Optimization"
    ],
    samplePrompt: "Provide a cross-chain liquidity and bridging report for moving 10,000 USDC from Arbitrum and Ethereum to Arc Testnet using Circle CCTP."
  },
  {
    id: "agent-3",
    name: "Arc Code Architect",
    role: "EVM & Solidity Contract Synthesizer",
    type: "architect",
    category: "Development",
    description: "Generates production-grade, audited Solidity smart contracts custom tailored for Arc's native USDC gas model and deterministic finality.",
    pricePerJob: 25,
    rating: 5.0,
    completedJobs: 215,
    avatar: "⚡",
    capabilities: [
      "ERC-8183 Agent Escrow Implementation",
      "Sub-second Deterministic Finality Patterns",
      "Native USDC Fee Handlers",
      "Hardhat & Foundry Deploy Scripts"
    ],
    samplePrompt: "Generate a complete ERC-8183 compliant AI Agent Escrow Smart Contract in Solidity 0.8.24 with milestone payouts and owner arbitration."
  },
  {
    id: "agent-4",
    name: "Arc Chain Indexer",
    role: "On-Chain Data & Event Analyzer",
    type: "indexer",
    category: "Data & Analytics",
    description: "Inspects Arc block logs, monitors deterministic transaction finality times, and generates telemetry dashboards for Arc dApps.",
    pricePerJob: 8,
    rating: 4.7,
    completedJobs: 76,
    avatar: "🔍",
    capabilities: [
      "Arc Testnet Block Log Parsing",
      "Sub-second Finality Benchmark Reports",
      "Event Listener Code Snippets",
      "Gas Usage Diagnostics in Native USDC"
    ],
    samplePrompt: "Analyze Arc Testnet transaction execution patterns, average block times, and produce event indexing code for tracking USDC Escrow events."
  }
];

export const INITIAL_JOBS: EscrowJob[] = [
  {
    id: "job-101",
    title: "Arc Vault Security Audit",
    description: "Security check for Arc testnet vault contract handling native USDC gas deposits.",
    agentId: "agent-1",
    agentName: "Arc Guard AI",
    agentType: "auditor",
    escrowAmountUsdc: 15,
    status: "completed",
    createdAt: "2026-08-07T09:15:00Z",
    txHashDeposit: "0x8f3a9e12b4d5c6f7a8b9c0d1e2f3a4b5c6d7e8f9",
    txHashRelease: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
    prompt: "Audit the SimpleVault contract for reentrancy and USDC gas token edge cases on Arc.",
    deliverable: `### 🛡️ Arc Guard AI Security Audit Report

**Target Chain:** Arc Testnet (Chain ID 5042002)  
**Contract Examined:** \`SimpleVault.sol\`  
**Severity Summary:** 1 High Vulnerability, 1 Arc-Specific Warning

#### 🚨 1. High Vulnerability: Reentrancy in \`withdraw\`
- **Issue:** \`msg.sender.call{value: _amount}("")\` sends native USDC before updating \`balances[msg.sender]\`.
- **Impact:** An attacker can re-enter \`withdraw\` recursively and drain the entire vault balance.
- **Fix:** Apply Checks-Effects-Interactions pattern or OpenZeppelin \`ReentrancyGuard\`.

\`\`\`solidity
function withdraw(uint256 _amount) external {
    require(balances[msg.sender] >= _amount, "Insufficient balance");
    balances[msg.sender] -= _amount; // Effect first
    (bool sent, ) = msg.sender.call{value: _amount}(""); // Interaction last
    require(sent, "USDC transfer failed");
}
\`\`\`

#### ⚠️ 2. Arc Ecosystem Recommendation: Native USDC Decimals
- **Note:** On Arc L1, Native Gas USDC uses **18 decimals** (\`msg.value\` in wei), whereas ERC-20 USDC uses **6 decimals**. Always verify whether your vault receives native gas USDC or ERC-20 wrapped USDC!

**Audit Status:** ✅ Remediation Code Provided & Verified.`,
    executedAt: "2026-08-07T09:16:30Z"
  }
];

export const SOLIDITY_ESCROW_CONTRACT = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title ArcAgentEscrow
 * @dev ERC-8183 compliant AI Agent Escrow & Job Marketplace Contract for Arc Testnet.
 * Arc utilizes USDC as the native gas token (18 decimals for native value).
 */
contract ArcAgentEscrow {
    enum JobState { Created, Funded, InProgress, Delivered, Completed, Disputed }

    struct Job {
        uint256 id;
        address client;
        address agent;
        uint256 amountUsdc; // Amount in wei (Native USDC gas token = 18 decimals)
        JobState state;
        string promptHash;
        string deliverableHash;
        uint256 createdAt;
    }

    uint256 public jobCount;
    address public arbitrator;
    mapping(uint256 => Job) public jobs;

    event JobCreated(uint256 indexed jobId, address indexed client, address indexed agent, uint256 amount);
    event JobFunded(uint256 indexed jobId, address indexed client);
    event DeliverableSubmitted(uint256 indexed jobId, string deliverableHash);
    event FundsReleased(uint256 indexed jobId, address indexed agent, uint256 amount);
    event JobDisputed(uint256 indexed jobId, address indexed party);

    modifier onlyClient(uint256 _jobId) {
        require(msg.sender == jobs[_jobId].client, "Not job client");
        _;
    }

    modifier onlyAgent(uint256 _jobId) {
        require(msg.sender == jobs[_jobId].agent, "Not assigned agent");
        _;
    }

    constructor() {
        arbitrator = msg.sender;
    }

    /// @notice Create a new job with Native USDC Escrow deposit on Arc
    function createAndFundJob(address _agent, string calldata _promptHash) external payable returns (uint256) {
        require(msg.value > 0, "Escrow deposit required in native USDC");
        
        jobCount++;
        jobs[jobCount] = Job({
            id: jobCount,
            client: msg.sender,
            agent: _agent,
            amountUsdc: msg.value,
            state: JobState.Funded,
            promptHash: _promptHash,
            deliverableHash: "",
            createdAt: block.timestamp
        });

        emit JobCreated(jobCount, msg.sender, _agent, msg.value);
        emit JobFunded(jobCount, msg.sender);
        return jobCount;
    }

    /// @notice Agent submits completed work deliverable
    function submitDeliverable(uint256 _jobId, string calldata _deliverableHash) external onlyAgent(_jobId) {
        Job storage job = jobs[_jobId];
        require(job.state == JobState.Funded || job.state == JobState.InProgress, "Invalid state");
        
        job.deliverableHash = _deliverableHash;
        job.state = JobState.Delivered;

        emit DeliverableSubmitted(_jobId, _deliverableHash);
    }

    /// @notice Client approves deliverable and releases USDC escrow to Agent
    function releaseFunds(uint256 _jobId) external onlyClient(_jobId) {
        Job storage job = jobs[_jobId];
        require(job.state == JobState.Delivered || job.state == JobState.Funded, "Cannot release yet");

        job.state = JobState.Completed;
        uint256 payout = job.amountUsdc;

        (bool success, ) = payable(job.agent).call{value: payout}("");
        require(success, "USDC transfer failed");

        emit FundsReleased(_jobId, job.agent, payout);
    }
}
`;

export const HARDHAT_CONFIG_SNIPPET = `// hardhat.config.js for Arc Testnet
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.24",
  networks: {
    arcTestnet: {
      url: "https://rpc.testnet.arc.io",
      chainId: 5042002,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
};
`;
