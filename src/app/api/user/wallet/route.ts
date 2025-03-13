import { NextRequest, NextResponse } from "next/server";
import { saveWalletAddressToUser, getUserByWalletAddress } from "@/services/userService";

//POST /api/user/wallet - Save wallet address to user database
export async function POST(req: NextRequest) {
  try {
    const result = await saveWalletAddressToUser();
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to save wallet address" },
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
    console.error("Error in wallet API route:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

//GET /api/user/wallet?address=0x123... - Get user by wallet address
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
    
    const result = await getUserByWalletAddress(walletAddress);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "User not found" },
        { status: 404 }
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
    console.error("Error in wallet API route:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
} 