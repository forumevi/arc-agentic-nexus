import React, { useState } from "react";
import { Github, Copy, Check, Terminal, ExternalLink, Download, FileCode, CheckCircle2 } from "lucide-react";

interface GitHubDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubDeployModal: React.FC<GitHubDeployModalProps> = ({ isOpen, onClose }) => {
  const [copiedCmd, setCopiedCmd] = useState<boolean>(false);

  if (!isOpen) return null;

  const gitCommands = `git init
git add .
git commit -m "feat: Arc AI Agent & USDC Escrow Hub - Circle Arc L1"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/arc-ai-agent-hub.git
git push -u origin main`;

  const readmeContent = `# Arc AI Agent & USDC Escrow Hub 🚀

An autonomous AI Agent Job Marketplace and USDC Escrow application built for **Arc Testnet** (Circle's Layer-1 blockchain where USDC is the native gas token).

## 🌟 Key Features
- **ERC-8183 AI Agent Escrow**: Hire autonomous AI Agents (Security Auditor, Liquidity Analyst, Solidity Architect) with USDC funds locked safely in \`ArcAgentEscrow.sol\`.
- **Arc Testnet Native USDC Gas**: Built-in support for Chain ID \`5042002\` and 18-decimal native USDC gas calculations.
- **Server-Side Gemini AI Engine**: Real AI Agent execution powered by Google Gemini API.
- **Hardhat & Solidity Suite**: Ready-to-deploy smart contracts with Hardhat configuration scripts.

## 🛠️ Quick Start

\`\`\`bash
# 1. Clone repository
git clone https://github.com/YOUR_USERNAME/arc-ai-agent-hub.git
cd arc-ai-agent-hub

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env

# 4. Start dev server on port 3000
npm run dev
\`\`\`

## 📜 Arc Testnet Specs
- **Chain ID**: \`5042002\` (\`0x4cf18a\`)
- **RPC Endpoint**: \`https://rpc.testnet.arc.io\`
- **Explorer**: \`https://testnet.arcscan.app\`
- **Faucet**: \`https://faucet.circle.com\`

## 📄 License
Apache-2.0
`;

  const handleCopyCmd = () => {
    navigator.clipboard.writeText(gitCommands);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white">
              <Github className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">GitHub Deployment & Export Suite</h3>
              <p className="text-xs text-slate-400">Deploy this Arc project repository directly to GitHub</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-semibold p-1">
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 text-slate-300 text-xs leading-relaxed font-sans">
          {/* Terminal Command Guide */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Git Push Terminal Commands</span>
              </h4>
              <button
                onClick={handleCopyCmd}
                className="px-3 py-1 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition flex items-center gap-1.5"
              >
                {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCmd ? "Copied!" : "Copy Commands"}</span>
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300">
              <pre>{gitCommands}</pre>
            </div>
          </div>

          {/* README Preview */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <FileCode className="w-4 h-4 text-cyan-400" />
              <span>Generated README.md for GitHub</span>
            </h4>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 max-h-48 overflow-y-auto">
              <pre>{readmeContent}</pre>
            </div>
          </div>

          <div className="p-4 bg-blue-950/40 border border-blue-800/40 rounded-xl space-y-1 text-blue-200">
            <div className="font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span>Project Export Ready</span>
            </div>
            <p className="text-[11px] text-blue-300/80">
              You can also export this complete project repository as a ZIP archive or push to GitHub using the AI Studio top bar settings menu!
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default GitHubDeployModal;
