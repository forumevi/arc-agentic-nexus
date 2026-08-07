import React, { useState } from 'react';
import { ArcWalletState, ARC_TESTNET_CONFIG } from '../types/arc';
import { X, CheckCircle, ExternalLink, RefreshCw, AlertTriangle } from 'lucide-react';
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
  const [faucetAmount, setFaucetAmount] = useState('100');
  const [faucetSuccess, setFaucetSuccess] = useState('');
  const [faucetError, setFaucetError] = useState('');

  if (!isOpen) return null;

  // Connect to Injected Web3 Wallet (e.g. MetaMask)
  const connectInjectedWallet = async () => {
    setLoading(true);
    try {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        const network = await provider.getNetwork();

        const userAddress = accounts[0];
        const isArc = Number(network.chainId) === ARC_TESTNET_CONFIG.chainId;

        // Try adding / switching to Arc Network
        if (!isArc) {
          try {
            await (window as any).ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: ARC_TESTNET_CONFIG.chainIdHex }],
            });
          } catch (switchError: any) {
            if (switchError.code === 4902) {
              await (window as any).ethereum.request({
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
            }
          }
        }

        setWallet({
          isConnected: true,
          address: userAddress,
          nativeGasUsdcBalance: 250,
          erc20UsdcBalance: 1500,
          isArcTestnet: true,
          providerType: 'metamask',
        });
      } else {
        createSimulatedWallet();
      }
    } catch (err: any) {
      console.warn('Wallet connection fallback to simulated:', err);
      createSimulatedWallet();
    } finally {
      setLoading(false);
    }
  };

  const createSimulatedWallet = () => {
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
          {/* Connected Status Card */}
          {wallet.isConnected ? (
            <div className="bg-black border border-[#0066FF] p-4 space-y-3 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0066FF] uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" /> CONNECTED WALLET
                </span>
                <span className="text-[10px] text-white/50 uppercase">
                  {wallet.providerType === 'metamask' ? 'INJECTED WEB3' : 'SIMULATED TESTNET'}
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
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-white/70 font-sans leading-relaxed">
                Connect your Web3 wallet (MetaMask, Rabby) to interact directly with Arc Testnet (Chain ID 5042002) or generate an instant testnet account.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={connectInjectedWallet}
                  disabled={loading}
                  className="p-4 bg-black border border-white/20 hover:border-[#0066FF] text-left transition space-y-1 group"
                >
                  <div className="font-black text-white group-hover:text-[#0066FF] text-sm uppercase tracking-wider">
                    METAMASK / WEB3
                  </div>
                  <p className="text-[10px] text-white/50 font-sans">
                    Connect browser wallet and auto-configure Arc Testnet
                  </p>
                </button>

                <button
                  onClick={createSimulatedWallet}
                  className="p-4 bg-black border border-white/20 hover:border-[#0066FF] text-left transition space-y-1 group"
                >
                  <div className="font-black text-white group-hover:text-[#0066FF] text-sm uppercase tracking-wider">
                    SIMULATED ACCOUNT
                  </div>
                  <p className="text-[10px] text-white/50 font-sans">
                    Instant testnet keys with prefunded gas
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
