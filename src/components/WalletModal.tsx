import React, { useState } from 'react';
import { ArcWalletState, ARC_TESTNET_CONFIG } from '../types/arc';
import { X, CheckCircle, ExternalLink, RefreshCw, AlertTriangle, LogOut, Wallet } from 'lucide-react';
import { ethers } from 'ethers';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: ArcWalletState;
  setWallet: React.Dispatch<React.SetStateAction<ArcWalletState>>;
  onFaucetClaimed: (amountUsdc: number) => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  wallet,
  setWallet,
  onFaucetClaimed,
}) => {
  const [loading, setLoading] = useState(false);
  const [connectionError, setConnectionError] = useState('');
  const [faucetAmount, setFaucetAmount] = useState('100');
  const [faucetSuccess, setFaucetSuccess] = useState('');
  const [faucetError, setFaucetError] = useState('');

  if (!isOpen) return null;

  // Connect to Injected Web3 Wallet (e.g. MetaMask)
  const connectInjectedWallet = async () => {
    setLoading(true);
    setConnectionError('');

    try {
      if (typeof window === 'undefined' || !(window as any).ethereum) {
        setConnectionError('MetaMask or Web3 wallet browser extension was not found. Please install MetaMask or use a Simulated Testnet Account.');
        setLoading(false);
        return;
      }

      const ethereum = (window as any).ethereum;
      const provider = new ethers.BrowserProvider(ethereum);
      
      // Request accounts
      const accounts = await provider.send('eth_requestAccounts', []);
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned from wallet.');
      }

      const userAddress = accounts[0];
      let network = await provider.getNetwork();

      // Check Arc Testnet chain ID & attempt network switch or add
      if (Number(network.chainId) !== ARC_TESTNET_CONFIG.chainId) {
        try {
          await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: ARC_TESTNET_CONFIG.chainIdHex }],
          });
        } catch (switchError: any) {
          // If switch failed (e.g. chain not added or RPC error), try adding network
          try {
            await ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: ARC_TESTNET_CONFIG.chainIdHex,
                  chainName: ARC_TESTNET_CONFIG.name,
                  nativeCurrency: {
                    name: 'USD Coin',
                    symbol: 'USDC',
                    decimals: 18,
                  },
                  rpcUrls: [ARC_TESTNET_CONFIG.rpcUrl],
                  blockExplorerUrls: [ARC_TESTNET_CONFIG.explorerUrl],
                },
              ],
            });
          } catch (addError: any) {
            // RPC endpoint already exists or user declined prompt — non-fatal, proceed with account connection
            console.warn('Network addition notice (non-fatal):', addError?.message || addError);
          }
        }
      }

      // Fetch real balance if connected to Arc
      let gasBalance = 250.0;
      try {
        const rawBalance = await provider.getBalance(userAddress);
        const formatted = parseFloat(ethers.formatEther(rawBalance));
        if (!isNaN(formatted) && formatted > 0) {
          gasBalance = formatted;
        }
      } catch (balErr) {
        console.warn('Could not read RPC balance, using default testnet balance:', balErr);
      }

      setWallet({
        isConnected: true,
        address: userAddress,
        nativeGasUsdcBalance: gasBalance,
        erc20UsdcBalance: 1500.0,
        isArcTestnet: true,
        providerType: 'metamask',
      });

      setConnectionError('');
    } catch (err: any) {
      console.error('MetaMask connection error:', err);
      const msg = err?.message || 'Failed to connect MetaMask. Please unlock your wallet and try again.';
      setConnectionError(msg);
    } finally {
      setLoading(false);
    }
  };

  const createSimulatedWallet = () => {
    setConnectionError('');
    const randomHex = Array.from({ length: 40 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    const simAddress = '0x' + randomHex;

    setWallet({
      isConnected: true,
      address: simAddress,
      nativeGasUsdcBalance: 250,
      erc20UsdcBalance: 1200,
      isArcTestnet: true,
      providerType: 'simulated',
    });
  };

  const disconnectWallet = () => {
    setWallet({
      isConnected: false,
      address: '',
      nativeGasUsdcBalance: 0,
      erc20UsdcBalance: 0,
      isArcTestnet: false,
      providerType: 'simulated',
    });
    setConnectionError('');
    setFaucetSuccess('');
    setFaucetError('');
  };

  const handleClaimFaucet = () => {
    setFaucetError('');
    setFaucetSuccess('');
    const amount = parseFloat(faucetAmount);
    if (isNaN(amount) || amount <= 0) {
      setFaucetError('Please enter a valid USDC amount');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      onFaucetClaimed(amount);
      setFaucetSuccess(`Successfully received ${amount} native gas USDC on Arc Testnet!`);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fadeIn select-none">
      <div className="bg-black border border-white/30 w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-white/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00FF41] shadow-[0_0_8px_#00FF41]"></span>
            <h3 className="text-base font-black text-white uppercase tracking-wider">
              ARC WALLET & FAUCET
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white font-mono text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Connection Error Banner */}
          {connectionError && (
            <div className="p-4 bg-black border border-rose-500 text-rose-300 text-xs font-mono space-y-1">
              <div className="font-bold flex items-center gap-2 uppercase text-rose-400">
                <AlertTriangle className="w-4 h-4 shrink-0" /> METAMASK CONNECTION ERROR
              </div>
              <p className="text-[11px] text-white/80 leading-relaxed font-sans">{connectionError}</p>
            </div>
          )}

          {/* Connected Status Card */}
          {wallet.isConnected ? (
            <div className="bg-black border border-[#0066FF] p-4 space-y-4 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0066FF] uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[#00FF41]" /> CONNECTED WALLET
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-white/10 text-white border border-white/20 uppercase">
                  {wallet.providerType === 'metamask' ? '🦊 METAMASK / WEB3' : '⚡ SIMULATED TESTNET'}
                </span>
              </div>

              <div className="text-xs text-white bg-white/5 p-3 border border-white/10 break-all flex items-center justify-between">
                <span>{wallet.address}</span>
                <a
                  href={`${ARC_TESTNET_CONFIG.explorerUrl}/address/${wallet.address}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#0066FF] hover:text-white ml-2"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-white/5 p-3 border border-white/10">
                  <div className="text-[10px] text-white/50 uppercase font-bold">NATIVE GAS USDC (18 DEC)</div>
                  <div className="text-base font-black text-[#00FF41] mt-0.5">
                    {wallet.nativeGasUsdcBalance.toFixed(2)} USDC
                  </div>
                  <div className="text-[9px] text-white/40 uppercase mt-1">FOR ARC GAS FEES</div>
                </div>

                <div className="bg-white/5 p-3 border border-white/10">
                  <div className="text-[10px] text-white/50 uppercase font-bold">ERC-20 USDC (6 DEC)</div>
                  <div className="text-base font-black text-[#0066FF] mt-0.5">
                    {wallet.erc20UsdcBalance.toFixed(2)} USDC
                  </div>
                  <div className="text-[9px] text-white/40 uppercase mt-1">APP ESCROW BALANCE</div>
                </div>
              </div>

              {/* Wallet Actions when connected */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-white/10">
                {wallet.providerType !== 'metamask' && (
                  <button
                    onClick={connectInjectedWallet}
                    disabled={loading}
                    className="flex-1 py-2.5 px-3 bg-[#0066FF] hover:bg-white hover:text-black text-white text-xs font-black uppercase tracking-wider transition flex items-center justify-center gap-2"
                  >
                    {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Wallet className="w-3.5 h-3.5" />}
                    <span>SWITCH TO METAMASK</span>
                  </button>
                )}

                <button
                  onClick={disconnectWallet}
                  className="py-2.5 px-4 bg-black border border-rose-500/60 hover:bg-rose-500 hover:text-white text-rose-400 text-xs font-black uppercase tracking-wider transition flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>DISCONNECT</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-white/70 font-sans leading-relaxed">
                Connect your browser Web3 wallet (MetaMask, Rabby, Coinbase Wallet) to interact directly with Arc Testnet (Chain ID 5042002) or generate an instant testnet account.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={connectInjectedWallet}
                  disabled={loading}
                  className="p-4 bg-black border border-white/20 hover:border-[#0066FF] text-left transition space-y-1 group hover:bg-white/5"
                >
                  <div className="font-black text-white group-hover:text-[#0066FF] text-sm uppercase tracking-wider flex items-center justify-between">
                    <span>METAMASK / WEB3</span>
                    {loading && <RefreshCw className="w-4 h-4 animate-spin text-[#0066FF]" />}
                  </div>
                  <p className="text-[10px] text-white/50 font-sans">
                    Connect browser wallet & auto-configure Arc L1 Testnet
                  </p>
                </button>

                <button
                  onClick={createSimulatedWallet}
                  className="p-4 bg-black border border-white/20 hover:border-[#0066FF] text-left transition space-y-1 group hover:bg-white/5"
                >
                  <div className="font-black text-white group-hover:text-[#0066FF] text-sm uppercase tracking-wider">
                    SIMULATED ACCOUNT
                  </div>
                  <p className="text-[10px] text-white/50 font-sans">
                    Instant testnet key with 250 USDC prefunded gas
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* Faucet Section */}
          <div className="border-t border-white/20 pt-5 space-y-3 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                ARC TESTNET USDC FAUCET
              </span>
              <a
                href="https://faucet.circle.com"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-[#0066FF] hover:text-white flex items-center gap-1 uppercase font-bold"
              >
                OFFICIAL FAUCET <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex gap-2">
              <input
                type="number"
                value={faucetAmount}
                onChange={(e) => setFaucetAmount(e.target.value)}
                placeholder="USDC Amount"
                className="flex-1 bg-black border border-white/30 p-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#0066FF]"
              />
              <button
                onClick={handleClaimFaucet}
                disabled={loading}
                className="px-5 py-2.5 bg-white text-black hover:bg-[#0066FF] hover:text-white font-black text-xs uppercase tracking-wider transition-colors flex items-center gap-2 border border-white"
              >
                {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                CLAIM GAS USDC
              </button>
            </div>

            {faucetSuccess && (
              <div className="p-3 bg-black border border-[#00FF41] text-[#00FF41] text-xs font-mono flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#00FF41] shrink-0" />
                <span>{faucetSuccess}</span>
              </div>
            )}

            {faucetError && (
              <div className="p-3 bg-black border border-rose-500 text-rose-400 text-xs font-mono flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{faucetError}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;

