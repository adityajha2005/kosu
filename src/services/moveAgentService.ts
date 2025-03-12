// src/services/moveAgentService.ts
import { ChatAnthropic } from "@langchain/anthropic";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { HumanMessage } from "@langchain/core/messages";
import { DynamicTool } from "@langchain/core/tools";

export class MoveAgentService {
  async createLangChainAgent(messageModifier?: string) {
    try {
      const llm = new ChatAnthropic({
        temperature: 0.7,
        model: "claude-3-5-sonnet-20241022",
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
      
      const memory = new MemorySaver();
      
      // Create tools compatible with ChatAnthropic
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
      
      const agent = await createReactAgent({
        llm,
        tools,
        checkpointSaver: memory,
        messageModifier: messageModifier || `
          You are a helpful AI assistant integrated with the application.
          Be concise and helpful with your responses.
        `,
      });
      
      return agent;
    } catch (error) {
      console.error('Create LangChain agent error:', error);
      throw error;
    }
  }

  async processQuery(query: string) {
    try {
      const agent = await this.createLangChainAgent();
      const result = await agent.invoke({
        messages: [new HumanMessage(query)],
      });
      
      return result.messages.map((msg: any) => msg.content).join('\n');
    } catch (error) {
      console.error('Process query error:', error);
      throw error;
    }
  }
}