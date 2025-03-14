import { NextRequest, NextResponse } from 'next/server';
import { pipeline } from '@xenova/transformers';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';

interface UserDocument {
  _id: mongoose.Types.ObjectId;
  walletAddress: string;
  skills?: string[];
  interests?: string[];
  lookingForTeam?: boolean;
  __v?: number;
  bio?: string;
  experienceLevel?: string;
  name?: string;
  similarityScore?: number;
}

let embeddingModel: any = null;

export async function POST(req: NextRequest) {
  try {
    const { skills, experience, userId } = await req.json();

    if (!skills || !skills.length) {
      return NextResponse.json(
        { error: 'Skills are required' },
        { status: 400 }
      );
    }

    await dbConnect();
    
    const db = mongoose.connection;
    const currentUser = await db.collection('users').findOne({ walletAddress: userId });
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const userProfile = `Skills: ${skills.join(', ')}. Experience: ${experience || 'Not specified'}`;

    if (!embeddingModel) {
      embeddingModel = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }

    const userEmbedding = await embeddingModel(userProfile, {
      pooling: 'mean',
      normalize: true,
    });

    const otherUsers = await db.collection('users')
      .find({ 
        walletAddress: { $ne: userId },
        lookingForTeam: true
      })
      .toArray() as UserDocument[];

    const usersWithScores = await Promise.all(
      otherUsers.map(async (user) => {
        const otherUserProfile = `Skills: ${user.skills?.join(', ') || ''}. Experience: ${user.experienceLevel || 'Not specified'}. Bio: ${user.bio || ''}`;
        
        const otherUserEmbedding = await embeddingModel(otherUserProfile, {
          pooling: 'mean',
          normalize: true,
        });
        
        const similarity = calculateCosineSimilarity(
          userEmbedding.data,
          otherUserEmbedding.data
        );
        
        return {
          ...user,
          similarityScore: similarity,
        };
      })
    );

    const sortedUsers = usersWithScores
      .sort((a, b) => b.similarityScore! - a.similarityScore!)
      .slice(0, 5); // Return top 5 matches

    return NextResponse.json({
      matches: sortedUsers.map(user => ({
        id: user._id.toString(),
        name: user.name || 'Anonymous User',
        skills: user.skills || [],
        experience: user.experienceLevel || '',
        bio: user.bio || '',
        walletAddress: user.walletAddress,
        similarityScore: user.similarityScore,
      }))
    });
  } catch (error) {
    console.error('Error finding teammates:', error);
    return NextResponse.json(
      { error: 'Failed to find teammates' },
      { status: 500 }
    );
  }
}

function calculateCosineSimilarity(vec1: number[], vec2: number[]): number {
  if (vec1.length !== vec2.length) {
    throw new Error('Vectors must have the same length');
  }
  
  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;
  
  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    mag1 += vec1[i] * vec1[i];
    mag2 += vec2[i] * vec2[i];
  }
  
  mag1 = Math.sqrt(mag1);
  mag2 = Math.sqrt(mag2);
  
  if (mag1 === 0 || mag2 === 0) {
    return 0;
  }
  
  return dotProduct / (mag1 * mag2);
} 