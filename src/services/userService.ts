import dbConnect from "@/lib/mongodb";
import User, { IUser } from "@/models/User";
import { initializePetraWallet } from "./aptosService";
import mongoose from "mongoose";
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type UserDocument = mongoose.Document<unknown, {}, IUser> & IUser;

/**
 * Fetches the wallet address from Aptos wallet and saves it to the user database
 * @param walletAddress Optional wallet address to save directly
 * @returns Object containing success status and user data or error message
 */
export async function saveWalletAddressToUser(walletAddress?: string): Promise<{ 
  success: boolean; 
  user?: UserDocument; 
  error?: string;
}> {
  try {
    await dbConnect();
    
    let addressToSave: string;
    
    if (walletAddress) {
      addressToSave = walletAddress;
    } else {
      const walletResult = await initializePetraWallet();
      
      if (!walletResult.success || !walletResult.address) {
        return { 
          success: false, 
          error: walletResult.error || "Failed to get wallet address" 
        };
      }
      
      addressToSave = walletResult.address;
    }
    
    
    const existingUser = await (User as any).findOne({ walletAddress: addressToSave });
    
    if (existingUser) {
      return { success: true, user: existingUser };
    }
    
    const newUser = new User({
      walletAddress: addressToSave,
      lookingForTeam: false, //false by default
    });
    
    await newUser.save();
    
    return { success: true, user: newUser };
  } catch (error) {
    console.error("Error saving wallet address to user:", error);
    return { 
      success: false, 
      error: (error as Error).message 
    };
  }
}

/**
 * Updates an existing user with the provided data
 * @param walletAddress The wallet address of the user to update
 * @param userData The user data to update
 * @returns Object containing success status and updated user data or error message
 */
export async function updateUser(
  walletAddress: string, 
  userData: Partial<Omit<IUser, 'walletAddress'>>
): Promise<{ 
  success: boolean; 
  user?: UserDocument; 
  error?: string;
}> {
  try {
    await dbConnect();
    
    const updatedUser = await (User as any).findOneAndUpdate(
      { walletAddress },
      { ...userData },
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      return { 
        success: false, 
        error: "User not found" 
      };
    }
    
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Error updating user:", error);
    return { 
      success: false, 
      error: (error as Error).message 
    };
  }
}

/**
 * Gets a user by wallet address
 * @param walletAddress The wallet address of the user to get
 * @returns Object containing success status and user data or error message
 */
export async function getUserByWalletAddress(walletAddress: string): Promise<{ 
  success: boolean; 
  user?: UserDocument; 
  error?: string;
}> {
  try {
    await dbConnect();
    
    const user = await (User as any).findOne({ walletAddress });
    
    if (!user) {
      return { 
        success: false, 
        error: "User not found" 
      };
    }
    
    return { success: true, user };
  } catch (error) {
    console.error("Error getting user by wallet address:", error);
    return { 
      success: false, 
      error: (error as Error).message 
    };
  }
} 