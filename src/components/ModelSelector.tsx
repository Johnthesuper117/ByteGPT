'use client';

import { MODELS } from '@/lib/models';
import { Model } from '@/types';

interface Props {
  selectedModel: Model;
  onSelect: (model: Model) => void;
  disabled?: boolean;
}

const PROVIDER_LABELS: Record<string, string> = {
  openai: '[ OPENAI ]',
  anthropic: '[ ANTHROPIC ]',
  google: '[ GOOGLE ]',
};

export default function ModelSelector({ selectedModel, onSelect, disabled }: Props) {
  const providers = ['openai', 'anthropic', 'google'] as const;

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-[var(--terminal-green-dim)] hidden sm:block">MODEL:</span>
      <select
        value={selectedModel.id}
        onChange={(e) => {
          const model = MODELS.find((m) => m.id === e.target.value);
          if (model) onSelect(model);
        }}
        disabled={disabled}
        className="text-xs px-2 py-1 rounded-none min-w-[180px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {providers.map((provider) => (
          <optgroup key={provider} label={PROVIDER_LABELS[provider]}>
            {MODELS.filter((m) => m.provider === provider).map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}
