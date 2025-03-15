import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Hackathon, { IHackathon } from '@/models/HackRegister';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const id = req.nextUrl.searchParams.get('id');
    
    if (id) {
        // @ts-ignore
      const hackathon: IHackathon | null = await Hackathon.findById(id).exec();
      // console.log("Found hackathon:", hackathon);
      
      if (!hackathon) {
        return NextResponse.json({ success: false, message: 'Hackathon not found' }, { status: 404 });
      }
      
      return NextResponse.json({ success: true, data: hackathon }, { status: 200 });
    } else {
      // If no ID is provided, return all hackathons
      // @ts-ignore
      const hackathons: IHackathon[] = await Hackathon.find({}).exec();
      return NextResponse.json({ success: true, data: hackathons }, { status: 200 });
    }

  } catch (error) {
    console.error('Error fetching hackathon:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}

