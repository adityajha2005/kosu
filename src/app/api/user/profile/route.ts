import { NextRequest, NextResponse } from "next/server";
import { getUserByWalletAddress, updateUser, saveWalletAddressToUser } from "@/services/userService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const walletAddress = searchParams.get("address");
    
    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }
    
    let result = await getUserByWalletAddress(walletAddress);
    
    if (!result.success && result.error === "User not found") {
      const createResult = await saveWalletAddressToUser(walletAddress);
      
      if (createResult.success) {
        result = createResult;
      } else {
        return NextResponse.json(
          { error: createResult.error || "Failed to create user profile" },
          { status: 500 }
        );
      }
    } else if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Error retrieving user profile" },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      user: {
        walletAddress: result.user?.walletAddress,
        name: result.user?.name,
        skills: result.user?.skills,
        bio: result.user?.bio,
        interests: result.user?.interests,
        experienceLevel: result.user?.experienceLevel,
        lookingForTeam: result.user?.lookingForTeam,
      }
    });
  } catch (error) {
    console.error("Error in profile API route:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

// PUT /api/user/profile - Update user profile
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { walletAddress, ...userData } = body;
    
    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }
    
    const userExists = await getUserByWalletAddress(walletAddress);
    
    if (!userExists.success) {
      const createResult = await saveWalletAddressToUser(walletAddress);
      if (!createResult.success) {
        return NextResponse.json(
          { error: createResult.error || "Failed to create user profile" },
          { status: 500 }
        );
      }
    }
    
    const result = await updateUser(walletAddress, userData);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to update user profile" },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      user: {
        walletAddress: result.user?.walletAddress,
        name: result.user?.name,
        skills: result.user?.skills,
        bio: result.user?.bio,
        interests: result.user?.interests,
        experienceLevel: result.user?.experienceLevel,
        lookingForTeam: result.user?.lookingForTeam,
      }
    });
  } catch (error) {
    console.error("Error in profile API route:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
} 