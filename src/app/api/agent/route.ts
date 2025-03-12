// src/app/api/agent/route.ts
import { MoveAgentService } from '@/services/moveAgentService';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body;
    
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }
    
    const agentService = new MoveAgentService();
    const response = await agentService.processQuery(query);
    
    return NextResponse.json({ response });
  } catch (error) {
    console.error('Agent error:', error);
    return NextResponse.json({ 
      error: 'Failed to process query' 
    }, { status: 500 });
  }
}