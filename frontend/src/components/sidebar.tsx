'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Logo } from '@/components/logo';
import {
  MessageSquare,
  Settings,
  Plus,
  Trash2,
  LayoutDashboard,
  Share2,
  Instagram,
  MessageCircle,
  CreditCard,
  Sun,
  Moon,
  Sliders,
  Boxes,
  GitBranch,
  Zap,
  Users,
  Tag,
} from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface SidebarProps {
  conversations: any[];
  activeConversation: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  activeTab: 'chat' | 'settings' | 'credentials' | 'dashboard' | 'channels' | 'instagram' | 'whatsapp' | 'profile' | 'billing' | 'personalizacao' | 'infoprodutos' | 'fluxos' | 'integracoes' | 'automacoes' | 'contatos' | 'membros' | 'tags';
  onTabChange: (tab: 'chat' | 'settings' | 'credentials' | 'dashboard' | 'channels' | 'instagram' | 'whatsapp' | 'profile' | 'billing' | 'personalizacao' | 'infoprodutos' | 'fluxos' | 'integracoes' | 'automacoes' | 'contatos' | 'membros' | 'tags') => void;
}

export function Sidebar({
  conversations,
  activeConversation,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  activeTab,
  onTabChange,
}: SidebarProps) {
  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    { id: 'dashboard', label: 'Painel', icon: LayoutDashboard },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'channels', label: 'Canais', icon: Share2 },
    { id: 'instagram', label: 'Instagram', icon: Instagram },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
    { id: 'separator1', type: 'separator', label: 'Operacoes' },
    { id: 'personalizacao', label: 'Personalizacao', icon: Sliders },
    { id: 'infoprodutos', label: 'Infoprodutos', icon: Boxes },
    { id: 'fluxos', label: 'Fluxos', icon: GitBranch },
    { id: 'integracoes', label: 'Integracoes', icon: Zap },
    { id: 'automacoes', label: 'Automacoes', icon: Zap },
    { id: 'contatos', label: 'Contatos', icon: Users },
    { id: 'tags', label: 'Tags', icon: Tag },
    { id: 'separator2', type: 'separator', label: 'Admin' },
    { id: 'settings', label: 'Configuracoes', icon: Settings },
    { id: 'membros', label: 'Membros', icon: Users },
    { id: 'billing', label: 'Cobranca', icon: CreditCard },
  ];

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-white px-4 py-6 shadow-sm">
      <div className="flex items-center justify-between rounded-xl border border-border bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <Logo className="h-6 w-6" />
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Josias</p>
            <p className="text-base font-semibold text-foreground">Control Hub</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full border border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
          onClick={toggleTheme}
        >
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-white px-4 py-3 text-xs text-muted-foreground">
        <p className="font-medium uppercase tracking-[0.35em] text-foreground/70">Snapshot</p>
        <div className="mt-3 space-y-2">
          <p className="flex items-center justify-between text-sm">
            <span>Conversas</span>
            <span className="font-semibold text-foreground">{conversations.length.toString().padStart(2, '0')}</span>
          </p>
          <p className="flex items-center justify-between text-sm">
            <span>Painel</span>
            <span className="font-semibold text-foreground">{activeTab}</span>
          </p>
        </div>
      </div>

      <ScrollArea className="mt-6 flex-1 pr-2">
        <div className="space-y-1">
          {menuItems.map((item) => {
            if (item.type === 'separator') {
              return (
                <div key={item.id} className="pt-4 text-[11px] uppercase tracking-[0.4em] text-muted-foreground">
                  {item.label}
                </div>
              );
            }

            const Icon = item.icon!;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-sm transition-all',
                  isActive
                    ? 'border-primary/20 bg-primary/10 text-foreground'
                    : 'border-transparent text-muted-foreground hover:border-border hover:bg-secondary/60 hover:text-foreground'
                )}
                onClick={() => onTabChange(item.id as any)}
              >
                <span className={cn('flex h-8 w-8 items-center justify-center rounded-lg border text-xs', isActive ? 'border-primary/20 bg-primary/10 text-primary' : 'border-border text-muted-foreground')}>
                  <Icon className="h-4 w-4" />
                </span>
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>

        {activeTab === 'chat' && conversations.length > 0 && (
          <div className="mt-6 rounded-xl border border-border bg-white p-4">
            <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.4em] text-muted-foreground">
              <span>Conversas</span>
              <button
                className="rounded-full border border-border px-2 py-1 text-[10px] font-semibold tracking-[0.3em] hover:bg-secondary"
                onClick={onNewConversation}
              >
                +
              </button>
            </div>
            <div className="space-y-2">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={cn(
                    'group flex items-center gap-3 rounded-xl border px-3 py-2 text-sm transition-all',
                    activeConversation === conv.id
                      ? 'border-primary/20 bg-primary/10 text-foreground'
                      : 'border-border text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                  )}
                >
                  <button className="flex-1 text-left" onClick={() => onSelectConversation(conv.id)}>
                    <p className="truncate text-sm font-medium">{conv.title || 'Nova conversa'}</p>
                    <p className="text-xs text-muted-foreground">#{conv.id.slice(0, 4)}</p>
                  </button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-full text-muted-foreground/70 hover:bg-secondary hover:text-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conv.id);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </ScrollArea>

      <div className="mt-6 rounded-xl border border-border bg-white px-4 py-3">
        <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Operador</p>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            SL
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">Sulaymao Leite</p>
            <p className="truncate text-xs text-muted-foreground">sulaymaoleite28@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
