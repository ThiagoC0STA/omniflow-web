const CHATBASE_API_URL = "https://www.chatbase.co/api/v1";
const CHATBASE_SECRET_KEY = process.env.NEXT_PUBLIC_CHATBASE_API_KEY;
const CHATBASE_BOT_ID = process.env.NEXT_PUBLIC_CHATBASE_BOT_ID;

export interface ChatbaseMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export interface ChatbaseResponse {
  text: string;
  sources?: Array<{
    title: string;
    url: string;
  }>;
}

class ChatbaseService {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string = CHATBASE_SECRET_KEY!) {
    this.apiKey = apiKey;
    this.baseUrl = CHATBASE_API_URL;
  }

  async sendMessage(
    message: string,
    chatId?: string
  ): Promise<ChatbaseResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: message,
            },
          ],
          chatId: chatId || this.generateChatId(),
          stream: false,
          chatbotId: CHATBASE_BOT_ID,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Chatbase API error: ${response.status} - ${errorText}`);
        throw new Error(`Chatbase API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Chatbase API error:", error);
      throw error;
    }
  }

  private generateChatId(): string {
    return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get quick reply suggestions based on context
  getQuickReplies(): string[] {
    return [
      "What products do you offer?",
      "How can I get support?",
      "Tell me about your services",
      "What are your business hours?",
      "How do I place an order?",
    ];
  }
}

export const chatbaseService = new ChatbaseService();
