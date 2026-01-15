'use client';

import { Phone, Users, MessageCircle, Calendar, Search, MoreVertical, Send, Paperclip, Mic, Check } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import { WhatsAppConnection } from './whatsapp-connection';

interface OfficialAPICredentials {
  apiType: 'official';
  phoneNumberId: string;
  businessAccountId: string;
  accessToken: string;
  webhookVerifyToken: string;
}

interface EvolutionAPICredentials {
  apiType: 'evolution';
  evolutionApiUrl: string;
  instanceName: string;
  apiKey: string;
}

type WhatsAppCredentials = OfficialAPICredentials | EvolutionAPICredentials;

export function WhatsAppPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [credentials, setCredentials] = useState<WhatsAppCredentials | null>(null);
  const [selectedChat, setSelectedChat] = useState<number | null>(0);

  const handleConnect = (creds: WhatsAppCredentials) => {
    setCredentials(creds);
    setIsConnected(true);
    // Salvar credenciais no backend
    saveCredentialsToBackend(creds);
  };

  const saveCredentialsToBackend = async (creds: WhatsAppCredentials) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/whatsapp/credentials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creds),
      });
      if (response.ok) {
        console.log('✅ Credenciais do WhatsApp salvas com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao salvar credenciais do WhatsApp:', error);
    }
  };

  const chats = [
    {
      id: 1,
      name: 'João Silva',
      phone: '+55 11 99999-9999',
      lastMessage: 'Oi, tudo bem? Preciso de ajuda com...',
      time: '10:30',
      unread: 3,
      avatar: 'JS',
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 2,
      name: 'Maria Santos',
      phone: '+55 11 98888-8888',
      lastMessage: 'Obrigada pelo suporte!',
      time: '09:15',
      unread: 0,
      avatar: 'MS',
      color: 'from-pink-500 to-pink-600',
    },
    {
      id: 3,
      name: 'Carlos Oliveira',
      phone: '+55 11 97777-7777',
      lastMessage: 'Quando fica pronto?',
      time: 'Ontem',
      unread: 1,
      avatar: 'CO',
      color: 'from-green-500 to-green-600',
    },
    {
      id: 4,
      name: 'Ana Paula',
      phone: '+55 11 96666-6666',
      lastMessage: 'Perfeito, vou aguardar',
      time: 'Ontem',
      unread: 0,
      avatar: 'AP',
      color: 'from-purple-500 to-purple-600',
    },
  ];

  const messages = [
    {
      id: 1,
      sender: 'João Silva',
      content: 'Oi, tudo bem?',
      time: '10:25',
      isMe: false,
    },
    {
      id: 2,
      sender: 'Você',
      content: 'Olá! Tudo ótimo, e você?',
      time: '10:26',
      isMe: true,
    },
    {
      id: 3,
      sender: 'João Silva',
      content: 'Estou bem! Preciso de ajuda com uma integração do WhatsApp Business API',
      time: '10:27',
      isMe: false,
    },
    {
      id: 4,
      sender: 'Você',
      content: 'Claro! Posso te ajudar. Qual é a sua dúvida?',
      time: '10:28',
      isMe: true,
    },
    {
      id: 5,
      sender: 'João Silva',
      content: 'Como faço para configurar os webhooks?',
      time: '10:30',
      isMe: false,
    },
  ];

  // Se não estiver conectado, mostrar tela de conexão
  if (!isConnected) {
    return <WhatsAppConnection onConnect={handleConnect} />;
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - Lista de conversas */}
      <div className="w-96 border-r bg-card border-border">
        {/* Header */}
        <div className="border-b bg-muted p-4 border-border">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600">
                <Phone className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-card-foreground">WhatsApp</h2>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <Users className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar ou iniciar uma conversa"
              className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(62,207,142)] text-foreground"
            />
          </div>
        </div>

        {/* Lista de conversas */}
        <div className="overflow-y-auto" style={{ height: 'calc(100vh - 140px)' }}>
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={`flex cursor-pointer items-center gap-3 border-b border-border p-4 transition-colors hover:bg-muted ${
                selectedChat === chat.id ? 'bg-muted' : ''
              }`}
            >
              <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${chat.color}`}>
                <span className="text-sm font-bold text-white">{chat.avatar}</span>
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-card-foreground">{chat.name}</h3>
                  <span className="text-xs text-muted-foreground">{chat.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="truncate text-sm text-muted-foreground">{chat.lastMessage}</p>
                  {chat.unread > 0 && (
                    <span className="ml-2 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Área de chat */}
      <div className="flex flex-1 flex-col">
        {selectedChat !== null ? (
          <>
            {/* Header do chat */}
            <div className="flex items-center justify-between border-b bg-card p-4 border-border">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600">
                  <span className="text-sm font-bold text-white">JS</span>
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground">João Silva</h3>
                  <p className="text-xs text-muted-foreground">Online</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                  <Search className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Mensagens */}
            <div className="flex-1 overflow-y-auto bg-muted p-4" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23e2e8f0\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}>
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-md rounded-lg px-4 py-2 ${
                        message.isMe
                          ? 'bg-green-500 text-white'
                          : 'bg-card text-card-foreground shadow-sm'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div className={`mt-1 flex items-center justify-end gap-1 text-xs ${
                        message.isMe ? 'text-green-100' : 'text-muted-foreground'
                      }`}>
                        <span>{message.time}</span>
                        {message.isMe && <Check className="h-3 w-3" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Input de mensagem */}
            <div className="border-t bg-card p-4 border-border">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground">
                  <Paperclip className="h-5 w-5" />
                </Button>
                <input
                  type="text"
                  placeholder="Digite uma mensagem"
                  className="flex-1 rounded-full border border-border bg-muted px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-foreground"
                />
                <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground">
                  <Mic className="h-5 w-5" />
                </Button>
                <Button className="h-10 w-10 rounded-full bg-green-500 p-0 hover:bg-green-600">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center bg-background">
            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600">
                <MessageCircle className="h-10 w-10 text-white" />
              </div>
              <h2 className="mt-4 text-2xl font-bold text-foreground">WhatsApp Business</h2>
              <p className="mt-2 text-muted-foreground">
                Selecione uma conversa para começar
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
