'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader2 } from 'lucide-react';
import { Message } from '@/types';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface ChatInterfaceProps {
  conversationId: string;
  messages: Message[];
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
}

export function ChatInterface({
  conversationId,
  messages,
  onSendMessage,
  isLoading,
}: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [pendingMessages, setPendingMessages] = useState<string[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Quando há mensagens pendentes, aguardar 10 segundos e processar todas juntas
  useEffect(() => {
    if (pendingMessages.length > 0 && !isLoading) {
      // Limpar timeout anterior se existir
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Criar novo timeout de 10 segundos
      timeoutRef.current = setTimeout(async () => {
        console.log(`🤖 Processando ${pendingMessages.length} mensagens agrupadas`);

        // Juntar todas as mensagens pendentes em uma só
        const groupedMessage = pendingMessages.join('\n');

        // Limpar mensagens pendentes
        setPendingMessages([]);

        // Enviar para a IA
        try {
          await onSendMessage(groupedMessage);
        } catch (error) {
          console.error('Erro ao enviar mensagem agrupada:', error);
        }
      }, 10000); // 10 segundos de debounce
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [pendingMessages, isLoading, onSendMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    const message = input.trim();
    setInput('');

    // Adicionar à lista de mensagens pendentes
    setPendingMessages((prev) => [...prev, message]);

    console.log('📨 Mensagem enviada e adicionada à fila. Total:', pendingMessages.length + 1);
  };

  return (
    <div className="flex min-h-[420px] flex-col gap-4 sm:min-h-[520px] lg:min-h-[620px]">
      <div className="glass-panel flex-1 overflow-hidden border border-border p-0">
        <ScrollArea className="h-full px-4 py-5 sm:px-6">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn('flex', message.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                <div
                  className={cn(
                    'max-w-[75%] rounded-3xl border px-4 py-3 text-sm leading-relaxed shadow-sm',
                    message.role === 'user'
                      ? 'border-transparent bg-primary text-primary-foreground'
                      : 'border-border bg-card text-foreground'
                  )}
                >
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}

            {pendingMessages.map((msg, index) => (
              <div key={`pending-${index}`} className="flex justify-end">
                <div className="max-w-[75%] rounded-3xl border border-transparent bg-primary/60 px-4 py-3 text-sm text-white">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown>{msg}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-3xl border border-border px-4 py-2">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              </div>
            )}

            <div ref={scrollRef} />
          </div>
        </ScrollArea>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel border border-border px-4 py-4">
        <div className="flex flex-col gap-3 md:flex-row">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="min-h-[64px] flex-1 resize-none rounded-xl border-border"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="h-11 min-w-[120px] rounded-xl"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </div>
      </form>
    </div>
  );
}
