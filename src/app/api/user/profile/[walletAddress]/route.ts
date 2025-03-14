import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';

type RouteParams = {
  params: {
    walletAddress: string;
  };
};

export async function GET(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const walletAddress = context.params.walletAddress;
    
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    await dbConnect();
    
    const db = mongoose.connection;
    const user = await db.collection('users').findOne({ walletAddress });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        _id: user._id.toString(),
        walletAddress: user.walletAddress,
        name: user.name || null,
        bio: user.bio || null,
        skills: user.skills || [],
        interests: user.interests || [],
        experienceLevel: user.experienceLevel || null,
        lookingForTeam: user.lookingForTeam || false,
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
} 