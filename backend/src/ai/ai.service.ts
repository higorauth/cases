import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { OpenAI } from 'openai';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  conversation_id: string;
  user_id: string;
  message: string;
  history?: ChatMessage[]; // Histórico de mensagens da conversa
  settings?: {
    openaiApiKey?: string;
    model?: string;
    temperature?: number;
    max_tokens?: number;
    system_prompt?: string;
    [key: string]: any;
  };
}

interface ChatResponse {
  conversation_id: string;
  message: string;
  role: string;
  metadata?: any;
}

@Injectable()
export class AiService {
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      // Verificar se há uma chave de API nas credenciais
      const apiKey = request.settings?.openaiApiKey;

      if (!apiKey) {
        console.warn('⚠️ Nenhuma chave OpenAI fornecida. Configure as credenciais para usar a OpenAI.');
        return this.getMockResponse(request.conversation_id);
      }

      console.log('🔵 Conectando à OpenAI com chave fornecida');

      // Criar cliente OpenAI com a chave fornecida
      const openai = new OpenAI({ apiKey });

      // Preparar mensagens para a API
      const systemPrompt = request.settings?.system_prompt || 
        'Você é um assistente útil, amigável e profissional. Responda em português de forma clara e concisa.';

      console.log('📤 Enviando mensagem para OpenAI:', request.message.substring(0, 50) + '...');

      // Preparar mensagens com histórico
      const messages: ChatMessage[] = [
        {
          role: 'system',
          content: systemPrompt,
        },
      ];

      // Adicionar histórico de mensagens (se existir)
      if (request.history && request.history.length > 0) {
        console.log(`📚 Incluindo ${request.history.length} mensagens do histórico`);
        messages.push(...request.history);
      }

      // Adicionar a mensagem atual do usuário
      messages.push({
        role: 'user',
        content: request.message,
      });

      console.log(`💬 Total de mensagens enviadas: ${messages.length}`);

      // Chamar a API da OpenAI
      const response = await openai.chat.completions.create({
        model: request.settings?.model || 'gpt-4.1-mini',
        messages: messages as any,
        temperature: request.settings?.temperature || 0.7,
        max_tokens: request.settings?.max_tokens || 2000,
      });

      const aiMessage = response.choices[0]?.message?.content || 'Desculpe, não consegui gerar uma resposta.';

      console.log('✅ Resposta recebida da OpenAI');

      return {
        conversation_id: request.conversation_id,
        message: aiMessage,
        role: 'assistant',
        metadata: {
          model: request.settings?.model || 'gpt-4.1-mini',
          usage: response.usage,
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error: any) {
      console.error('❌ Erro ao chamar OpenAI:', error.message);

      // Se houver erro de autenticação, informar claramente
      if (error.status === 401) {
        console.error('❌ Chave OpenAI inválida ou expirada. Verifique as credenciais.');
        throw new HttpException(
          'Chave OpenAI inválida. Verifique as credenciais em Configurações.',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // Para outros erros, retornar resposta mock
      console.warn('⚠️ Erro ao usar OpenAI, usando resposta mock');
      return this.getMockResponse(request.conversation_id);
    }
  }

  // Respostas mock para quando OpenAI não estiver disponível
  private getMockResponse(conversationId: string): ChatResponse {
    const mockResponses = [
      'Olá! Parece que não consegui conectar à OpenAI no momento. Verifique se sua chave API está correta nas Credenciais. (Resposta mock)',
      'Desculpe, não consegui processar sua mensagem pela OpenAI agora. Certifique-se de ter uma chave API válida. (Resposta mock)',
      'Houve um problema ao conectar com a OpenAI. Configure sua chave API nas Credenciais para usar a IA de verdade. (Resposta mock)',
    ];

    const randomIndex = Math.floor(Math.random() * mockResponses.length);

    return {
      conversation_id: conversationId,
      message: mockResponses[randomIndex],
      role: 'assistant',
      metadata: {
        isMock: true,
        warning: 'Serviço OpenAI não disponível. Adicione sua chave API nas Credenciais.',
      },
    };
  }

  async clearConversation(conversationId: string): Promise<void> {
    // OpenAI não requer limpeza de conversa - cada mensagem é independente
    console.log('ℹ️ Conversa', conversationId, 'pode ser deletada do banco de dados local');
  }
}

