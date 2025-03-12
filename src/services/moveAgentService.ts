import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { HumanMessage } from "@langchain/core/messages";
import { DynamicTool } from "@langchain/core/tools";


export class MoveAgentService {
  // Store the agent instance to avoid recreating it
  private agentInstance: any = null;
  
  async createLangChainAgent(threadId?: string, messageModifier?: string) {
    try {
      const llm = new ChatGoogleGenerativeAI({
        temperature: 0.7,
        model: "gemini-1.5-pro",
        apiKey: process.env.GOOGLE_API_KEY || 'AIzaSyA3moSS4_ALdgy63FNp0pE0lLXgyUU2Kk8',
        maxOutputTokens: 2048,
      });
      
      // Initialize memory with thread ID if provided
      const memory = new MemorySaver()
      
      const tools = [
        new DynamicTool({
          name: "search_data",
          description: "Search for data in your application",
          func: async (query: string) => {
            // Implement your own search functionality
            return `Results for: ${query}`;
          },
        }),
        new DynamicTool({
          name: "process_text",
          description: "Process text using AI",
          func: async (text: string) => {
            // Implement your own text processing
            return `Processed: ${text}`;
          },
        }),
      ];
      
      const agent = createReactAgent({
        llm,
        tools,
        checkpointSaver: memory,
        messageModifier: messageModifier || `You are a helpful AI assistant integrated with the application. Be concise and helpful with your responses.`,
      });
      
      // Store this agent instance for future use with the same thread ID
      this.agentInstance = agent;
      
      return agent;
    } catch (error) {
      console.error('Create LangChain agent error:', error);
      throw error;
    }
  }
  
  async processQuery(query: string, threadId?: string) {
    try {
      // Generate a thread ID if not provided
      const conversationThreadId = threadId || `thread_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      // Get or create agent
      const agent = await this.createLangChainAgent(conversationThreadId);
      
      // Create a config object with thread_id
      const config = {
        configurable: {
          thread_id: conversationThreadId,
        }
      };
      
      // Use the config in the invoke call
      const result = await agent.invoke(
        {
          messages: [new HumanMessage(query)],
        },
        config  // Pass config as the second parameter
      );
      
      // Return response content and thread ID
      return {
        content: result.messages.map((msg: any) => msg.content).join('\n'),
        threadId: conversationThreadId
      };
    } catch (error) {
      console.error('Process query error:', error);
      throw error;
    }
  }
}