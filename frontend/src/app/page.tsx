'use client';

import { useEffect, useMemo, useState } from 'react';
import { ThemeProvider } from '@/contexts/theme-context';
import { Sidebar } from '@/components/sidebar';
import { ChatInterface } from '@/components/chat-interface';
import { SettingsPanel } from '@/components/settings-panel';
import { CredentialsForm } from '@/components/credentials-form';
import { Dashboard } from '@/components/dashboard';
import { ChannelsPage } from '@/components/channels-page';
import { BillingPage } from '@/components/billing-page';
import { PlaceholderPage } from '@/components/placeholder-page';
import { WhatsAppPage } from '@/components/whatsapp-page';
import { InstagramPage } from '@/components/instagram-page';
import { Button } from '@/components/ui/button';
import { chatAPI, settingsAPI } from '@/lib/api';
import { AISettings, Conversation, Credentials, Message } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { User, Sliders, Boxes, GitBranch, Zap, Users, Tag, Sparkles, RefreshCcw } from 'lucide-react';

const PLACEHOLDER_SECTIONS = {
  personalizacao: {
    title: 'Personalizacao',
    description: 'Desenhe experiencias sob medida para cada canal.',
    icon: Sliders,
  },
  infoprodutos: {
    title: 'Infoprodutos',
    description: 'Gerencie catalogos, ofertas e lancamentos.',
    icon: Boxes,
  },
  fluxos: {
    title: 'Fluxos',
    description: 'Crie automacoes inteligentes em minutos.',
    icon: GitBranch,
  },
  integracoes: {
    title: 'Integracoes',
    description: 'Conecte ferramentas e mantenha tudo sincronizado.',
    icon: Zap,
  },
  automacoes: {
    title: 'Automacoes',
    description: 'Configure respostas e jornadas inteligentes.',
    icon: Zap,
  },
  contatos: {
    title: 'Contatos',
    description: 'Organize sua base e visualize o funil.',
    icon: Users,
  },
  tags: {
    title: 'Tags',
    description: 'Agrupe conversas por contexto e prioridade.',
    icon: Tag,
  },
  membros: {
    title: 'Membros',
    description: 'Defina niveis de acesso e responsabilidades.',
    icon: Users,
  },
  profile: {
    title: 'Perfil',
    description: 'Centralize dados da organizacao e branding.',
    icon: User,
  },
} as const;

type Tab =
  | 'chat'
  | 'settings'
  | 'credentials'
  | 'dashboard'
  | 'channels'
  | 'instagram'
  | 'whatsapp'
  | 'profile'
  | 'billing'
  | 'personalizacao'
  | 'infoprodutos'
  | 'fluxos'
  | 'integracoes'
  | 'automacoes'
  | 'contatos'
  | 'membros'
  | 'tags';

type PlaceholderTab = keyof typeof PLACEHOLDER_SECTIONS;

const QUICK_TABS: Array<{ id: Tab; label: string; hotkey: string }> = [
  { id: 'dashboard', label: 'Visao geral', hotkey: '1' },
  { id: 'chat', label: 'Conversas', hotkey: '2' },
  { id: 'channels', label: 'Canais', hotkey: '3' },
  { id: 'settings', label: 'Configuracoes', hotkey: '4' },
];

const isPlaceholderTab = (tab: Tab): tab is PlaceholderTab => tab in PLACEHOLDER_SECTIONS;

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<AISettings>({
    businessType: 'ecommerce',
    aiType: 'atendimento',
    systemPrompt: 'Voce e um assistente util e profissional.',
    model: 'gpt-4.1-mini',
    temperature: 0.7,
    maxTokens: 2000,
    language: 'pt-BR',
    contextWindow: 10,
  });
  const [credentials, setCredentials] = useState<Credentials>({});

  useEffect(() => {
    loadConversations();
    loadSettings();
    loadCredentials();
  }, []);

  useEffect(() => {
    if (activeConversation) {
      const conversation = conversations.find((c) => c.id === activeConversation);
      if (conversation) {
        setMessages(conversation.messages);
      }
    } else {
      setMessages([]);
    }
  }, [activeConversation, conversations]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey) return;
      if (['INPUT', 'TEXTAREA'].includes((event.target as HTMLElement)?.tagName)) return;
      const tab = QUICK_TABS.find((item) => item.hotkey === event.key);
      if (tab) {
        event.preventDefault();
        setActiveTab(tab.id);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const loadCredentials = () => {
    try {
      const saved = localStorage.getItem('josias-credentials');
      if (saved) {
        setCredentials(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Erro ao carregar credenciais:', error);
    }
  };

  const loadConversations = async () => {
    try {
      const data = await chatAPI.getConversations();
      setConversations(data || []);
      if (!activeConversation && data?.length) {
        setActiveConversation(data[0].id);
      }
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
      setConversations([]);
    }
  };

  const loadSettings = async () => {
    try {
      const data = await settingsAPI.getSettings();
      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Erro ao carregar configuracoes:', error);
    }
  };

  const handleNewConversation = async () => {
    try {
      const newConversation = await chatAPI.createConversation();
      setConversations((prev) => [...prev, newConversation]);
      setActiveConversation(newConversation.id);
      setActiveTab('chat');
    } catch (error) {
      console.error('Erro ao criar conversa:', error);
      alert(' Erro ao criar nova conversa');
    }
  };

  const handleDeleteConversation = async (id: string) => {
    try {
      await chatAPI.deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeConversation === id) {
        setActiveConversation(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Erro ao deletar conversa:', error);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!activeConversation) return;
    setIsLoading(true);

    try {
      const fullSettings = { ...settings, ...credentials };
      const response = await chatAPI.sendMessage(activeConversation, message, fullSettings);
      const messageParts = message.split('\n');
      const userMessages: Message[] = messageParts.map((part) => ({
        id: uuidv4(),
        role: 'user',
        content: part,
        timestamp: new Date(),
      }));

      const aiMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: response.message || response.content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, ...userMessages, aiMessage]);
    } catch (error: any) {
      console.error('Erro ao enviar mensagem:', error);
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content:
          error?.response?.data?.message ||
          'Desculpe, houve um erro ao processar sua mensagem. Verifique suas credenciais.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async (newSettings: AISettings) => {
    try {
      await settingsAPI.updateSettings(newSettings);
      setSettings(newSettings);
    } catch (error) {
      console.error('Erro ao salvar configuracoes:', error);
    }
  };

  const handleSaveCredentials = async (newCredentials: Credentials) => {
    try {
      localStorage.setItem('josias-credentials', JSON.stringify(newCredentials));
      setCredentials(newCredentials);
      alert(' Credenciais salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar credenciais:', error);
      alert(' Erro ao salvar credenciais');
    }
  };

  const summaryHighlights = useMemo(
    () => [
      { label: 'Conversas monitoradas', value: conversations.length.toString().padStart(2, '0') },
      { label: 'Mensagens no painel', value: messages.length.toString().padStart(2, '0') },
      { label: 'Status', value: isLoading ? 'Sincronizando' : 'Atualizado' },
    ],
    [conversations.length, messages.length, isLoading]
  );

  const renderActiveView = () => {
    if (isPlaceholderTab(activeTab)) {
      const placeholder = PLACEHOLDER_SECTIONS[activeTab];
      return (
        <PlaceholderPage
          title={placeholder.title}
          description={placeholder.description}
          icon={placeholder.icon}
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'channels':
        return <ChannelsPage />;
      case 'instagram':
        return <InstagramPage />;
      case 'whatsapp':
        return <WhatsAppPage />;
      case 'billing':
        return <BillingPage />;
      case 'settings':
        return <SettingsPanel settings={settings} onSave={handleSaveSettings} />;
      case 'chat':
        return activeConversation ? (
          <ChatInterface
            conversationId={activeConversation}
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="rounded-full border border-dashed border-border/70 px-6 py-3 text-xs uppercase tracking-[0.4em] text-muted-foreground">
              Conversas IA
            </div>
            <h2 className="mt-6 text-2xl font-semibold text-foreground">Nada por aqui ainda</h2>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Inicie uma nova conversa para testar fluxos ou acompanhar canais conectados.
            </p>
            <Button className="mt-6 rounded-full" onClick={handleNewConversation}>
              Comecar agora
            </Button>
          </div>
        );
      case 'credentials':
      default:
        return <CredentialsForm credentials={credentials} onSave={handleSaveCredentials} />;
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background pb-10">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 px-4 py-6 lg:flex-row lg:px-8">
          <div className="w-full lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:w-72">
            <Sidebar
              conversations={conversations}
              activeConversation={activeConversation}
              onSelectConversation={setActiveConversation}
              onNewConversation={handleNewConversation}
              onDeleteConversation={handleDeleteConversation}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          <div className="flex flex-1 flex-col">
            <div className="sticky top-0 z-10 border-b border-border bg-white/95 px-4 py-4 backdrop-blur md:px-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold text-foreground sm:text-xl">JOSIAS AI</h1>
                    <p className="text-xs text-muted-foreground">Command Center</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={loadConversations}
                  >
                    <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Atualizar
                  </Button>
                  <Button size="sm" className="gap-2" onClick={handleNewConversation}>
                    <Sparkles className="h-4 w-4" />
                    Nova Conversa
                  </Button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {QUICK_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-primary text-white'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <span>{tab.label}</span>
                    {activeTab === tab.id && (
                      <span className="text-xs opacity-70">{tab.hotkey}</span>
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {summaryHighlights.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-lg border border-border bg-white p-3"
                  >
                    <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
                    <p className="mt-1 text-xl font-bold text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-hidden bg-gray-50">
              <div className="h-full w-full overflow-y-auto p-4 sm:p-6 lg:p-8">
                {renderActiveView()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
