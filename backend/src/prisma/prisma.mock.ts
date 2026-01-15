// Mock types para desenvolvimento
// Remove este arquivo após configurar banco de dados real

export interface PrismaClient {
  user: any;
  aISettings: any;
  conversation: any;
  message: any;
  knowledgeBase: any;
  $connect(): Promise<void>;
  $disconnect(): Promise<void>;
}

export const PrismaClient = class {
  user = {};
  aISettings = {};
  conversation = {};
  message = {};
  knowledgeBase = {};
  async $connect() {}
  async $disconnect() {}
} as any;
