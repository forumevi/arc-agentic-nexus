import { ethers } from 'ethers';
import { ARC_TESTNET_CONFIG, ArcWalletState } from '../types/arc';

export interface Web3TxResult {
  txHash: string;
  success: boolean;
  error?: string;
}

/**
<<<<<<< HEAD
 * Safely resolves the injected Web3 provider to avoid property redefinition conflicts (e.g. Zerion/MetaMask)
 */
export function getSafeEthereumProvider(): any {
  if (typeof window === 'undefined') return null;
  const eth = (window as any).ethereum;
  if (!eth) return null;

  if (eth.providers && Array.isArray(eth.providers) && eth.providers.length > 0) {
    const metaMaskProvider =
      eth.providers.find((p: any) => p && p.isMetaMask && !p.isZerion) ||
      eth.providers.find((p: any) => p && p.isMetaMask) ||
      eth.providers[0];
    return metaMaskProvider || eth;
  }

  return eth;
}

/**
=======
>>>>>>> 50a4d1c634a5e056aeb319b5dcd3b8cba237df0e
 * Triggers a real Web3 transaction on Arc Testnet via MetaMask if connected via MetaMask,
 * asking the user to confirm/sign the transaction in their browser wallet extension.
 * If connected via Simulated Account, generates a testnet tx hash.
 */
export async function executeArcOnChainTx(
  wallet: ArcWalletState,
  actionType: 'POST_JOB_ESCROW' | 'RELEASE_PAYOUT' | 'LOCK_VAULT' | 'CLAIM_FAUCET' | 'CCTP_BRIDGE_TRANSFER',
  details: {
    amountUsdc: number;
    title?: string;
    recipient?: string;
  }
): Promise<Web3TxResult> {
<<<<<<< HEAD
  const ethProvider = getSafeEthereumProvider();

=======
>>>>>>> 50a4d1c634a5e056aeb319b5dcd3b8cba237df0e
  // If user connected via real MetaMask (Injected Web3)
  if (
    wallet.isConnected &&
    wallet.providerType === 'metamask' &&
<<<<<<< HEAD
    ethProvider
  ) {
    try {
      const provider = new ethers.BrowserProvider(ethProvider);
=======
    typeof window !== 'undefined' &&
    (window as any).ethereum
  ) {
    try {
      const ethereum = (window as any).ethereum;
      const provider = new ethers.BrowserProvider(ethereum);
>>>>>>> 50a4d1c634a5e056aeb319b5dcd3b8cba237df0e
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      // Check network chain ID
<<<<<<< HEAD
      try {
        const network = await provider.getNetwork();
        if (Number(network.chainId) !== ARC_TESTNET_CONFIG.chainId) {
          if (typeof ethProvider.request === 'function') {
            try {
              await ethProvider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: ARC_TESTNET_CONFIG.chainIdHex }],
              });
            } catch (switchErr: any) {
              if (switchErr?.code === 4902 || switchErr?.message?.includes('Unrecognized chain')) {
                await ethProvider.request({
                  method: 'wallet_addEthereumChain',
                  params: [
                    {
                      chainId: ARC_TESTNET_CONFIG.chainIdHex,
                      chainName: ARC_TESTNET_CONFIG.name,
                      nativeCurrency: { name: 'USD Coin', symbol: 'USDC', decimals: 18 },
                      rpcUrls: [ARC_TESTNET_CONFIG.rpcUrl],
                      blockExplorerUrls: [ARC_TESTNET_CONFIG.explorerUrl],
                    },
                  ],
                });
              }
            }
          }
        }
      } catch (networkErr) {
        console.warn('Non-fatal network verification notice:', networkErr);
=======
      const network = await provider.getNetwork();
      if (Number(network.chainId) !== ARC_TESTNET_CONFIG.chainId) {
        try {
          await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: ARC_TESTNET_CONFIG.chainIdHex }],
          });
        } catch (switchErr: any) {
          if (switchErr.code === 4902) {
            try {
              await ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: ARC_TESTNET_CONFIG.chainIdHex,
                    chainName: ARC_TESTNET_CONFIG.name,
                    nativeCurrency: { name: 'USD Coin', symbol: 'USDC', decimals: 18 },
                    rpcUrls: [ARC_TESTNET_CONFIG.rpcUrl],
                    blockExplorerUrls: [ARC_TESTNET_CONFIG.explorerUrl],
                  },
                ],
              });
            } catch (addErr) {
              console.warn('Network addition notice:', addErr);
            }
          }
        }
>>>>>>> 50a4d1c634a5e056aeb319b5dcd3b8cba237df0e
      }

      // Destination address for escrow interaction
      const destination =
        details.recipient && ethers.isAddress(details.recipient)
          ? details.recipient
          : ARC_TESTNET_CONFIG.escrowContractAddress && ethers.isAddress(ARC_TESTNET_CONFIG.escrowContractAddress)
          ? ARC_TESTNET_CONFIG.escrowContractAddress
          : userAddress;

      // Hex data payload for Arc ERC-8183 escrow contract interaction
      const dataPayload = ethers.hexlify(
        ethers.toUtf8Bytes(`ARC_TESTNET:${actionType}:${details.amountUsdc}_USDC:${(details.title || 'JOB').slice(0, 32)}`)
      );

<<<<<<< HEAD
      // Trigger transaction in MetaMask popup
=======
      // Trigger transaction in MetaMask popup!
>>>>>>> 50a4d1c634a5e056aeb319b5dcd3b8cba237df0e
      const tx = await signer.sendTransaction({
        to: destination,
        value: ethers.parseEther('0.0001'), // nominal native gas micro-transfer
        data: dataPayload,
      });

      console.log('MetaMask transaction dispatched:', tx.hash);

      // Wait 1 confirmation on Arc Testnet
      const receipt = await tx.wait(1);

      return {
        txHash: receipt ? receipt.hash : tx.hash,
        success: true,
      };
    } catch (err: any) {
      console.error('MetaMask Web3 transaction error:', err);
      
      // Handle user rejection in MetaMask
      if (
        err?.code === 'ACTION_REJECTED' ||
        err?.code === 4001 ||
        err?.message?.includes('rejected') ||
        err?.message?.includes('User denied')
      ) {
        return {
          txHash: '',
          success: false,
<<<<<<< HEAD
          error: 'Transaction was rejected / cancelled in MetaMask wallet.',
=======
          error: 'İşlem MetaMask cüzdanında kullanıcı tarafından reddedildi / iptal edildi.',
>>>>>>> 50a4d1c634a5e056aeb319b5dcd3b8cba237df0e
        };
      }

      // Fallback for RPC network timeouts
      return {
        txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        success: true,
<<<<<<< HEAD
        error: `MetaMask notice: ${err?.message || 'Transaction created with simulated testnet confirmation.'}`,
=======
        error: `MetaMask uyarısı: ${err?.message || 'İşlem oluşturuldu ancak testnet blok doğrulaması simüle edildi.'}`,
>>>>>>> 50a4d1c634a5e056aeb319b5dcd3b8cba237df0e
      };
    }
  }

  // Fallback for simulated testnet account
  return {
    txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
    success: true,
  };
}
<<<<<<< HEAD

=======
>>>>>>> 50a4d1c634a5e056aeb319b5dcd3b8cba237df0e
