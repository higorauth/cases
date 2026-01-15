import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private client: any = null;

  async onModuleInit() {
    try {
      // Tentar importar Prisma quando disponível
      const prismaModule = await import('@prisma/client');
      const PrismaClientClass = (prismaModule as any).default || (prismaModule as any).PrismaClient;
      this.client = new PrismaClientClass();
      await this.client.$connect();
    } catch (error) {
      console.warn('Prisma Client não disponível. Usando modo mock para desenvolvimento.');
      // Modo mock para desenvolvimento
      this.client = {
        user: {},
        aISettings: {},
        conversation: {},
        message: {},
        knowledgeBase: {},
        $connect: async () => {},
        $disconnect: async () => {},
      };
    }
  }

  async onModuleDestroy() {
    if (this.client && this.client.$disconnect) {
      await this.client.$disconnect();
    }
  }

  // Proxy para acessar modelos do Prisma
  get user() {
    return this.client?.user || {};
  }

  get aISettings() {
    return this.client?.aISettings || {};
  }

  get conversation() {
    return this.client?.conversation || {};
  }

  get message() {
    return this.client?.message || {};
  }

  get knowledgeBase() {
    return this.client?.knowledgeBase || {};
  }
}
