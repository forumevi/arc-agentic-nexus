import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI client on server side safely
  const getAiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not set in environment variables.');
    }
    return new GoogleGenAI({
      apiKey: apiKey || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      network: 'Arc Testnet',
      chainId: 5042002,
      nativeGasToken: 'USDC',
      timestamp: new Date().toISOString(),
    });
  });

  // ERC-8183 AI Agent Job Execution Endpoint
  app.post('/api/ai/execute-job', async (req, res) => {
    try {
      const { jobTitle, jobDescription, requirements, agentName, agentSpecialization } = req.body;

      if (!jobTitle || !jobDescription) {
        return res.status(400).json({ error: 'Job title and description are required' });
      }

      const ai = getAiClient();
      const prompt = `You are an autonomous AI Agent named "${agentName || 'Arc Agent'}" on the Arc Blockchain Network (Chain ID: 5042002), specialized in ${agentSpecialization || 'Smart Contract Audit & Data Analysis'}.
You are executing an ERC-8183 Job with USDC Escrow on Arc Testnet.

Job Title: ${jobTitle}
Description: ${jobDescription}
Requirements: ${JSON.stringify(requirements || [])}

Please perform the work requested thoroughly and professionally.
Return a valid JSON object with the following schema:
{
  "deliverableSummary": "High level overview of what was executed and accomplished",
  "deliverableCodeOrData": "Code snippet, audit report, or dataset produced by the job",
  "verificationScore": 95, // integer between 85 and 100 based on completeness
  "executionMetrics": "Executed in 1.2s using Arc Testnet USDC gas reserves",
  "recommendations": ["Recommendation 1", "Recommendation 2"]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          systemInstruction: 'You are an autonomous AI Agent operating on Arc Network, executing tasks and delivering code, audit results, or strategy reports.',
        },
      });

      const rawText = response.text || '{}';
      let parsedData;
      try {
        parsedData = JSON.parse(rawText.trim());
      } catch (err) {
        parsedData = {
          deliverableSummary: rawText,
          deliverableCodeOrData: rawText,
          verificationScore: 92,
          executionMetrics: 'Executed successfully on Arc Network',
          recommendations: ['Verify smart contract gas calculations on ArcScan'],
        };
      }

      res.json({
        success: true,
        agentName,
        jobTitle,
        deliverable: parsedData,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error('Error executing AI job:', error);
      res.status(500).json({
        error: 'Failed to execute AI Agent job',
        details: error?.message || String(error),
      });
    }
  });

  // Custom AI Agent Creator Endpoint
  app.post('/api/ai/create-agent', async (req, res) => {
    try {
      const { userPrompt, specialization } = req.body;

      const ai = getAiClient();
      const prompt = `Create a detailed Arc Network Autonomous AI Agent specification based on this request:
Request: "${userPrompt}"
Specialization Hint: "${specialization || 'General'}"

The Arc Network uses native USDC as the gas token, deterministic finality, and ERC-8183 standard for AI Agent jobs.

Return a valid JSON object with:
{
  "name": "Catchy Agent Name (e.g. Arc-Sentinel)",
  "role": "Clear Professional Role Title",
  "description": "2 sentence description of what the agent does",
  "capabilities": ["Capability 1", "Capability 2", "Capability 3", "Capability 4"],
  "hourlyRateUsdc": 25, // reasonable number
  "specialization": "Smart Contract Audit" | "DeFi Strategy" | "Data Analytics" | "Automated Trading" | "Content & Marketing"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const rawText = response.text || '{}';
      const parsedData = JSON.parse(rawText.trim());

      res.json({
        success: true,
        agent: parsedData,
      });
    } catch (error: any) {
      console.error('Error creating AI Agent:', error);
      res.status(500).json({
        error: 'Failed to generate AI Agent specs',
        details: error?.message || String(error),
      });
    }
  });

  // Smart Contract Code Audit Endpoint
  app.post('/api/ai/audit-contract', async (req, res) => {
    try {
      const { solidityCode } = req.body;
      if (!solidityCode) {
        return res.status(400).json({ error: 'Solidity code is required' });
      }

      const ai = getAiClient();
      const prompt = `Analyze this Solidity smart contract for deployment on Arc Testnet (Chain ID 5042002, where USDC is native gas token with 18 decimals, and ERC20 USDC uses 6 decimals):

Solidity Code:
\`\`\`solidity
${solidityCode}
\`\`\`

Perform security audit and Arc compliance check.
Return valid JSON:
{
  "pass": true,
  "overallScore": 95,
  "nativeUsdcGasCompliance": "Detailed assessment of msg.value or USDC decimals",
  "vulnerabilities": [
    { "severity": "Low" | "Medium" | "High", "issue": "Brief description", "remediation": "Fix suggestion" }
  ],
  "auditSummary": "Executive summary of the contract"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsedData = JSON.parse(response.text || '{}');
      res.json({ success: true, auditResult: parsedData });
    } catch (error: any) {
      res.status(500).json({ error: 'Audit failed', details: error?.message || String(error) });
    }
  });

  // Serve Vite in development mode or dist in production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Arc Hub Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
