import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Hackathon, { IHackathon } from '@/models/HackRegister';

// Handle GET requests
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    // @ts-ignore
    const hackathons: IHackathon[] = await Hackathon.find({}).exec();
    return NextResponse.json({ success: true, data: hackathons }, { status: 200 });
  } catch (error) {
    console.error('Error fetching hackathons:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}

// Handle POST requests
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    // Ensure all required fields are present
    if (body.inhouse === undefined) body.inhouse = false;
    if (body.outhouse === undefined) body.outhouse = false;
    if (body.registrationlink === undefined) body.registrationlink = '';
    // console.log(body);
    const hackathon: IHackathon = new Hackathon(body);
    // console.log("hackathon from backend",hackathon);
    await hackathon.validate();
    await hackathon.save();
    return NextResponse.json({ success: true, data: hackathon }, { status: 201 });
  } catch (error) {
    console.error('Error creating hackathon:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
