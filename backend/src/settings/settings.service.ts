import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface UpdateSettingsDto {
  systemPrompt?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  language?: string;
  contextWindow?: number;
  openaiApiKey?: string;
  supabaseUrl?: string;
  supabaseKey?: string;
}

export interface SettingsData {
  id: string;
  userId: string;
  systemPrompt: string;
  model: string;
  temperature: number;
  maxTokens: number;
  language: string;
  contextWindow: number;
  openaiApiKey?: string;
  supabaseUrl?: string;
  supabaseKey?: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class SettingsService {
  private settingsStore: Map<string, SettingsData> = new Map();

  constructor(private prisma: PrismaService) {}

  async getSettings(userId: string): Promise<SettingsData | null> {
    try {
      // Tentar usar Prisma se disponível
      if (this.prisma.aISettings && typeof this.prisma.aISettings.findUnique === 'function') {
        return await this.prisma.aISettings.findUnique({
          where: { userId },
        });
      }
    } catch (error) {
      console.error('Erro ao buscar settings do Prisma:', error);
    }

    // Fallback para mock
    return this.settingsStore.get(userId) || null;
  }

  async createOrUpdateSettings(userId: string, data: UpdateSettingsDto): Promise<SettingsData> {
    try {
      // Tentar usar Prisma se disponível
      if (this.prisma.aISettings && typeof this.prisma.aISettings.findUnique === 'function') {
        const existing = await this.prisma.aISettings.findUnique({
          where: { userId },
        });

        if (existing) {
          return await this.prisma.aISettings.update({
            where: { userId },
            data,
          });
        }

        return await this.prisma.aISettings.create({
          data: {
            userId,
            systemPrompt: data.systemPrompt || 'Você é um assistente útil.',
            ...data,
          },
        });
      }
    } catch (error) {
      console.error('Erro ao salvar settings no Prisma:', error);
    }

    // Fallback para mock
    const existing = this.settingsStore.get(userId);
    const now = new Date();

    const settings: SettingsData = {
      id: existing?.id || `settings-${userId}`,
      userId,
      systemPrompt: data.systemPrompt || existing?.systemPrompt || 'Você é um assistente útil.',
      model: data.model || existing?.model || 'gpt-4.1-mini',
      temperature: data.temperature ?? existing?.temperature ?? 0.7,
      maxTokens: data.maxTokens || existing?.maxTokens || 2000,
      language: data.language || existing?.language || 'pt-BR',
      contextWindow: data.contextWindow || existing?.contextWindow || 10,
      openaiApiKey: data.openaiApiKey || existing?.openaiApiKey,
      supabaseUrl: data.supabaseUrl || existing?.supabaseUrl,
      supabaseKey: data.supabaseKey || existing?.supabaseKey,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    };

    this.settingsStore.set(userId, settings);
    return settings;
  }

  async deleteSettings(userId: string): Promise<void> {
    try {
      if (this.prisma.aISettings && typeof this.prisma.aISettings.delete === 'function') {
        await this.prisma.aISettings.delete({
          where: { userId },
        });
      }
    } catch (error) {
      console.error('Erro ao deletar settings:', error);
    }

    // Fallback para mock
    this.settingsStore.delete(userId);
  }
}
