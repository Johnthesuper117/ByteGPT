import { Model } from '@/types';

export const MODELS: Model[] = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'openai',
    description: 'Most capable OpenAI model',
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'openai',
    description: 'Fast and efficient OpenAI model',
  },
  {
    id: 'claude-3-5-sonnet-20241022',
    name: 'Claude 3.5 Sonnet',
    provider: 'anthropic',
    description: "Anthropic's most intelligent model",
  },
  {
    id: 'claude-3-haiku-20240307',
    name: 'Claude 3 Haiku',
    provider: 'anthropic',
    description: "Anthropic's fastest model",
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'google',
    description: "Google's most capable model",
  },
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    provider: 'google',
    description: "Google's fastest model",
  },
];

export const DEFAULT_MODEL = MODELS[0];

export function getModelById(id: string): Model | undefined {
  return MODELS.find((m) => m.id === id);
}
