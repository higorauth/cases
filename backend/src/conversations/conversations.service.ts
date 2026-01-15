import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { SettingsService } from '../settings/settings.service';
import { v4 as uuidv4 } from 'uuid';

interface ConversationData {
  id?: string;
  userId: string;
  title: string;
  createdAt?: Date;
  lastMessageAt?: Date;
  messages?: MessageData[];
}

interface MessageData {
  id?: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

// In-memory store for fallback (when Prisma is not available)
const conversationsStore: Map<string, ConversationData> = new Map();
const messagesStore: Map<string, MessageData> = new Map();

@Injectable()
export class ConversationsService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
    private settingsService: SettingsService,
  ) {}

  async createConversation(userId: string, title?: string) {
    const conversationId = uuidv4();
    const conversation: ConversationData = {
      id: conversationId,
      userId,
      title: title || 'Nova conversa',
      createdAt: new Date(),
      messages: [],
    };

    try {
      return await this.prisma.conversation.create({
        data: conversation,
      });
    } catch (error) {
      // Fallback para in-memory storage
      conversationsStore.set(conversationId, conversation);
      return conversation;
    }
  }

  async getConversations(userId: string) {
    try {
      return await this.prisma.conversation.findMany({
        where: { userId },
        include: {
          messages: {
            orderBy: { timestamp: 'asc' },
          },
        },
      });
    } catch (error) {
      // Fallback para in-memory storage
      const userConversations = Array.from(conversationsStore.values()).filter(
        (c) => c.userId === userId
      );
      return userConversations.map((conv) => ({
        ...conv,
        messages: Array.from(messagesStore.values()).filter(
          (m) => m.conversationId === conv.id
        ),
      }));
    }
  }

  async getConversation(conversationId: string) {
    try {
      return await this.prisma.conversation.findUnique({
        where: { id: conversationId },
        include: {
          messages: {
            orderBy: { timestamp: 'asc' },
          },
        },
      });
    } catch (error) {
      // Fallback para in-memory storage
      const conversation = conversationsStore.get(conversationId);
      if (!conversation) return null;
      const messages = Array.from(messagesStore.values()).filter(
        (m) => m.conversationId === conversationId
      );
      return { ...conversation, messages };
    }
  }

  async deleteConversation(conversationId: string) {
    try {
      await this.aiService.clearConversation(conversationId);
      return await this.prisma.conversation.delete({
        where: { id: conversationId },
      });
    } catch (error) {
      // Fallback para in-memory storage
      conversationsStore.delete(conversationId);
      Array.from(messagesStore.entries()).forEach(([key, msg]) => {
        if (msg.conversationId === conversationId) {
          messagesStore.delete(key);
        }
      });
    }
  }

  async sendMessage(
    conversationId: string,
    userId: string,
    message: string
  ) {
    const messageId = uuidv4();

    // Salvar mensagem do usuário
    const userMessage: MessageData = {
      id: messageId,
      conversationId,
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    try {
      await this.prisma.message.create({
        data: userMessage,
      });
    } catch (error) {
      // Fallback
      messagesStore.set(messageId, userMessage);
    }

    // Obter configurações do usuário
    const settings = await this.settingsService.getSettings(userId);

    // BUSCAR HISTÓRICO DE MENSAGENS da conversa
    let conversationHistory: MessageData[] = [];
    try {
      const historyMessages = await this.prisma.message.findMany({
        where: { conversationId },
        orderBy: { timestamp: 'asc' },
      });
      conversationHistory = historyMessages;
    } catch (error) {
      // Fallback para in-memory
      conversationHistory = Array.from(messagesStore.values())
        .filter((m) => m.conversationId === conversationId)
        .sort((a, b) => (a.timestamp! > b.timestamp! ? 1 : -1));
    }

    // Aplicar contextWindow (pegar apenas as últimas N mensagens)
    const contextWindow = settings?.contextWindow || 10;
    const recentHistory = conversationHistory.slice(-contextWindow);

    console.log(
      `📚 Histórico: ${conversationHistory.length} mensagens, usando últimas ${recentHistory.length} (contextWindow: ${contextWindow})`,
    );

    // Formatar histórico para enviar à IA (apenas role e content)
    const formattedHistory = recentHistory.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Enviar para IA
    let aiResponse: any;
    try {
      aiResponse = await this.aiService.sendMessage({
        conversation_id: conversationId,
        user_id: userId,
        message,
        history: formattedHistory, // ENVIAR HISTÓRICO formatado
        settings: settings
          ? {
              openaiApiKey: settings.openaiApiKey,
              system_prompt: settings.systemPrompt,
              model: settings.model,
              temperature: settings.temperature,
              max_tokens: settings.maxTokens,
              language: settings.language,
              context_window: settings.contextWindow,
            }
          : undefined,
      });
    } catch (error) {
      // Fallback: responder com mensagem de erro
      aiResponse = {
        message:
          'Desculpe, houve um erro ao processar sua mensagem. Verifique se o serviço de IA está configurado.',
      };
    }

    // Salvar resposta
    const responseId = uuidv4();
    const aiMessage: MessageData = {
      id: responseId,
      conversationId,
      role: 'assistant',
      content: aiResponse.message,
      timestamp: new Date(),
    };

    try {
      await this.prisma.message.create({
        data: aiMessage,
      });
    } catch (error) {
      // Fallback
      messagesStore.set(responseId, aiMessage);
    }

    // Atualizar conversas
    const conversation = conversationsStore.get(conversationId);
    if (conversation) {
      conversation.lastMessageAt = new Date();
    }

    return {
      id: responseId,
      role: 'assistant',
      content: aiResponse.message,
      timestamp: new Date(),
    };
  }
}
