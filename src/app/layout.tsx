import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ByteGPT — Terminal AI Chat',
  description:
    'A multi-model AI chatbot with an OG terminal aesthetic. Supports OpenAI GPT-4, Anthropic Claude, and Google Gemini.',
  keywords: ['AI', 'chatbot', 'terminal', 'GPT', 'Claude', 'Gemini', 'ByteGPT'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-screen overflow-hidden">{children}</body>
    </html>
  );
}
