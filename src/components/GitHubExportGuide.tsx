import React, { useState } from 'react';
import { Github, Copy, Check, ExternalLink, Server } from 'lucide-react';

export const GitHubExportGuide: React.FC = () => {
  const [copiedStep, setCopiedStep] = useState<string | null>(null);

  const copyToClipboard = (text: string, stepId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(stepId);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const gitCommands = `# 1. Initialize Git repository
git init
git add .
git commit -m "feat: initial commit for Arc Agentic Economy & USDC Nexus"

# 2. Add your GitHub remote repository
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/arc-agentic-nexus.git

# 3. Push code to GitHub
git push -u origin main`;

  const hardhatConfig = `// hardhat.config.ts for Arc Testnet Deployment
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    arcTestnet: {
      url: "https://rpc.testnet.arc.io",
      chainId: 5042002,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      // Arc Network uses native USDC as gas token with 18 decimals
    }
  },
  etherscan: {
    apiKey: {
      arcTestnet: "abc"
    },
    customChains: [
      {
        network: "arcTestnet",
        chainId: 5042002,
        urls: {
          apiURL: "https://testnet.arcscan.app/api",
          browserURL: "https://testnet.arcscan.app"
        }
      }
    ]
  }
};

export default config;`;

  const deployScript = `// scripts/deploy.ts
import { ethers } from "hardhat";

async function main() {
  console.log("Deploying Arc USDC Escrow to Arc Testnet...");

  const [deployer] = await ethers.getSigners();
  console.log("Deployer Address:", deployer.address);

  const ArcEscrow = await ethers.getContractFactory("ArcUsdcEscrow");
  // Deploying with 10 native gas USDC (18 decimals parseEther)
  const escrow = await ArcEscrow.deploy(deployer.address, {
    value: ethers.parseEther("10.0")
  });

  await escrow.waitForDeployment();
  console.log("ArcUsdcEscrow deployed to:", await escrow.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});`;

  return (
    <div className="space-y-6 select-none">
      {/* Banner */}
      <div className="bg-black border border-white/20 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#00FF41]">
              06 / DEPLOYMENT GUIDE
            </span>
            <span className="text-white/30">•</span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/60">
              GITHUB & HARDHAT
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tighter">
            GITHUB EXPORT <span className="text-[#0066FF]">& CLOUD RUN</span>
          </h2>
          <p className="text-xs sm:text-sm text-white/70 max-w-2xl font-sans leading-relaxed">
            Step-by-step instructions to export this application to your GitHub repository, configure Hardhat smart contract deployment scripts for Arc Testnet (Chain ID 5042002), and host live production apps.
          </p>
        </div>

        <a
          href="https://github.com/new"
          target="_blank"
          rel="noreferrer"
          className="px-6 py-4 bg-white text-black hover:bg-[#0066FF] hover:text-white font-black text-xs uppercase tracking-wider transition-colors flex items-center gap-2 shrink-0 border border-white"
        >
          <span>CREATE GITHUB REPO</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Deployment Steps */}
      <div className="space-y-6">
        {/* Step 1: Git Push */}
        <div className="bg-black border border-white/20 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="h-7 w-7 bg-white text-black font-black text-xs flex items-center justify-center">
                1
              </span>
              <h3 className="font-black text-white text-base uppercase tracking-wider">PUSH APPLICATION TO GITHUB</h3>
            </div>

            <button
              onClick={() => copyToClipboard(gitCommands, 'git')}
              className="px-3 py-1.5 text-xs font-mono font-bold uppercase bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center gap-1.5"
            >
              {copiedStep === 'git' ? <Check className="w-3.5 h-3.5 text-[#00FF41]" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedStep === 'git' ? 'COPIED!' : 'COPY COMMANDS'}
            </button>
          </div>

          <pre className="bg-white/5 p-4 border border-white/10 font-mono text-xs text-[#00FF41] overflow-x-auto leading-relaxed">
            {gitCommands}
          </pre>
        </div>

        {/* Step 2: Hardhat Configuration */}
        <div className="bg-black border border-white/20 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="h-7 w-7 bg-white text-black font-black text-xs flex items-center justify-center">
                2
              </span>
              <h3 className="font-black text-white text-base uppercase tracking-wider">
                HARDHAT CONFIG FOR ARC TESTNET (<code className="text-[#0066FF]">hardhat.config.ts</code>)
              </h3>
            </div>

            <button
              onClick={() => copyToClipboard(hardhatConfig, 'hardhat')}
              className="px-3 py-1.5 text-xs font-mono font-bold uppercase bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center gap-1.5"
            >
              {copiedStep === 'hardhat' ? <Check className="w-3.5 h-3.5 text-[#00FF41]" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedStep === 'hardhat' ? 'COPIED!' : 'COPY CONFIG'}
            </button>
          </div>

          <p className="text-xs text-white/70 font-sans">
            Target Arc Testnet RPC (<code className="text-[#00FF41] font-mono">https://rpc.testnet.arc.io</code>) with Chain ID 5042002. Gas fees are paid in native USDC.
          </p>

          <pre className="bg-white/5 p-4 border border-white/10 font-mono text-xs text-[#0066FF] overflow-x-auto max-h-64 leading-relaxed">
            {hardhatConfig}
          </pre>
        </div>

        {/* Step 3: Smart Contract Deploy Script */}
        <div className="bg-black border border-white/20 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="h-7 w-7 bg-white text-black font-black text-xs flex items-center justify-center">
                3
              </span>
              <h3 className="font-black text-white text-base uppercase tracking-wider">
                DEPLOYMENT SCRIPT (<code className="text-[#0066FF]">scripts/deploy.ts</code>)
              </h3>
            </div>

            <button
              onClick={() => copyToClipboard(deployScript, 'deploy')}
              className="px-3 py-1.5 text-xs font-mono font-bold uppercase bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center gap-1.5"
            >
              {copiedStep === 'deploy' ? <Check className="w-3.5 h-3.5 text-[#00FF41]" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedStep === 'deploy' ? 'COPIED!' : 'COPY SCRIPT'}
            </button>
          </div>

          <pre className="bg-white/5 p-4 border border-white/10 font-mono text-xs text-purple-300 overflow-x-auto leading-relaxed">
            {deployScript}
          </pre>
        </div>

        {/* Step 4: Environment Variables */}
        <div className="bg-black border border-white/20 p-6 space-y-4">
          <h3 className="font-black text-white text-base uppercase tracking-wider flex items-center gap-2">
            <Server className="w-4 h-4 text-[#0066FF]" /> ENVIRONMENT VARIABLES
          </h3>
          <p className="text-xs text-white/70 font-sans">
            Set these environment variables in your deployment dashboard or secrets manager:
          </p>
          <div className="bg-white/5 p-4 border border-white/10 font-mono text-xs text-[#00FF41] space-y-1">
            <div>GEMINI_API_KEY=your_gemini_api_key_from_google_ai_studio</div>
            <div>NODE_ENV=production</div>
            <div>PORT=3000</div>
          </div>
        </div>
      </div>
    </div>
  );
};
