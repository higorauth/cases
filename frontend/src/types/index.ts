export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title?: string;
  messages: Message[];
  lastMessageAt: Date;
}

export interface AISettings {
  businessType: 'clinicas' | 'infoprodutos' | 'ecommerce' | 'salao-beleza';
  aiType: 'atendimento' | 'suporte';
  systemPrompt: string;
  model: string;
  temperature: number;
  maxTokens: number;
  language: string;
  contextWindow: number;
}

export interface Credentials {
  supabaseUrl?: string;
  supabaseKey?: string;
}
