import { initializePetraWallet } from "@/services/aptosService";

/**
 * Connects to Petra wallet and saves the wallet address to the user database
 * @returns Object containing success status, wallet address, and error message if any
 */
export async function connectWalletAndSaveUser(): Promise<{
  success: boolean;
  address?: string;
  error?: string;
}> {
  try {
    if (typeof window === 'undefined') {
      return {
        success: false,
        error: "This function can only be called on the client side"
      };
    }

    if (!window.aptos) {
      return {
        success: false,
        error: "Petra Wallet not detected. Please install the Petra extension."
      };
    }

    const walletResult = await initializePetraWallet();

    if (!walletResult.success) {
      return {
        success: false,
        error: walletResult.error || "Failed to initialize Petra wallet"
      };
    }

    if (!walletResult.isConnected) {
      try {
        const response = await window.aptos.connect();
        const { address } = response;

        if (!address) {
          throw new Error("No address found in connection response");
        }

        localStorage.setItem('userWalletAddress', address);

        const apiResponse = await fetch('/api/user/wallet', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!apiResponse.ok) {
          const errorData = await apiResponse.json();
          console.error("Error saving wallet address to database:", errorData);
        }

        return {
          success: true,
          address
        };
      } catch (error) {
        console.error("Failed to connect to Petra Wallet:", error);
        return {
          success: false,
          error: (error as Error).message
        };
      }
    }

    const address = walletResult.address;
    try {
      const apiResponse = await fetch('/api/user/wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        console.error("Error saving wallet address to database:", errorData);
      }
    } catch (error) {
      console.error("Error saving wallet address to database:", error);
    }

    return {
      success: true,
      address
    };
  } catch (error) {
    console.error("Error connecting wallet and saving user:", error);
    return {
      success: false,
      error: (error as Error).message
    };
  }
}

/**
 * Disconnects from Petra wallet
 * @returns Object containing success status and error message if any
 */
export async function disconnectWallet(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    if (typeof window === 'undefined') {
      return {
        success: false,
        error: "This function can only be called on the client side"
      };
    }

    if (!window.aptos) {
      return {
        success: false,
        error: "Petra Wallet not detected"
      };
    }

    await window.aptos.disconnect();

    localStorage.removeItem('userWalletAddress');

    return {
      success: true
    };
  } catch (error) {
    console.error("Error disconnecting wallet:", error);
    return {
      success: false,
      error: (error as Error).message
    };
  }
}

/**
 * Gets the current wallet address from localStorage
 * @returns The wallet address or null if not connected
 */
export function getCurrentWalletAddress(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return localStorage.getItem('userWalletAddress');
} 