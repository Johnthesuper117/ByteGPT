export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  model?: string;
  timestamp: Date;
}

export interface Model {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'google';
  description: string;
}
