/**
 * Utility for safe Web3 / Ethereum provider detection and handling
 * extension script injection edge-cases (e.g., Zerion, MetaMask, Rabby).
 */

// Global guard for extension redefinition errors (e.g. "Cannot redefine property: isZerion")
export function patchPropertyRedefinitionProtection() {
  if (typeof window === 'undefined') return;

  const win = window as any;
  if (win.__arc_property_protection_patched) return;
  win.__arc_property_protection_patched = true;

  try {
    const originalDefineProperty = Object.defineProperty;
    Object.defineProperty = function (obj: any, prop: PropertyKey, descriptor: PropertyDescriptor) {
      try {
        return originalDefineProperty.call(this, obj, prop, descriptor);
      } catch (err: any) {
        const propStr = String(prop);
        if (
          propStr === 'isZerion' ||
          propStr === 'ethereum' ||
          propStr === 'isMetaMask' ||
          err?.message?.includes('Cannot redefine property')
        ) {
          console.warn(`[Arc Shield] Safely caught property redefinition for '${propStr}':`, err?.message || err);
          try {
            obj[prop] = descriptor.value;
          } catch (_) {
            // Ignore failure on read-only properties
          }
          return obj;
        }
        throw err;
      }
    };
  } catch (e) {
    console.warn('[Arc Shield] Could not patch Object.defineProperty:', e);
  }

  // Handle uncaught window errors for extension script failures
  window.addEventListener('error', (event) => {
    const msg = event.message || '';
    if (
      msg.includes('Cannot redefine property: isZerion') ||
      msg.includes('Cannot redefine property') ||
      msg.includes('Failed to connect to MetaMask')
    ) {
      console.warn('[Arc Shield] Intercepted extension runtime error:', msg);
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reasonMsg = event.reason?.message || String(event.reason || '');
    if (
      reasonMsg.includes('Cannot redefine property: isZerion') ||
      reasonMsg.includes('Cannot redefine property') ||
      reasonMsg.includes('Failed to connect to MetaMask')
    ) {
      console.warn('[Arc Shield] Intercepted unhandled promise rejection:', reasonMsg);
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  });
}

/**
 * Safely resolves the active Ethereum provider from window or EIP-6963 provider list.
 */
export function getEthereumProvider(): any {
  if (typeof window === 'undefined') return null;
  const win = window as any;
  if (!win.ethereum) return null;

  // Handle multi-provider arrays (EIP-6963 / Zerion + MetaMask coexistence)
  if (Array.isArray(win.ethereum.providers) && win.ethereum.providers.length > 0) {
    const metamaskProvider =
      win.ethereum.providers.find((p: any) => p.isMetaMask && !p.isZerion) ||
      win.ethereum.providers.find((p: any) => p.isMetaMask) ||
      win.ethereum.providers[0];
    return metamaskProvider;
  }

  return win.ethereum;
}
