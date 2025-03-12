// src/pages/api/agent.ts (or app/api/agent/route.ts for App Router)
import { NextRequest, NextResponse } from 'next/server';
import { MoveAgentService } from '@/services/moveAgentService';

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    // Get thread ID from headers or generate a new one
    const threadId = req.headers.get('x-thread-id') || undefined;
    
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }
    
    const agentService = new MoveAgentService();
    const result = await agentService.processQuery(query, threadId);
    
    // Return both the response content and thread ID
    return NextResponse.json({
      response: result.content,
      threadId: result.threadId
    });
  } catch (error: any) {
    console.error('Agent error:', error);
    // Handle specific error types
    if (error.message?.includes('thread_id')) {
      return NextResponse.json({
        error: 'Thread ID configuration error. Please refresh and try again.'
      }, { status: 400 });
    }
    
    return NextResponse.json({
      error: error.message || 'An unexpected error occurred'
    }, { status: 500 });
  }
}