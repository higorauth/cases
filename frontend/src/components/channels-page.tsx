'use client';

import { Share2, Instagram, MessageCircle, Plus, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';

export function ChannelsPage() {
  const channels = [
    {
      name: 'Instagram',
      icon: Instagram,
      status: 'Conectado',
      color: 'from-pink-500 to-purple-600',
      connected: true,
      account: '@minhaconta',
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      status: 'Conectado',
      color: 'from-green-500 to-green-600',
      connected: true,
      account: '+55 11 99999-9999',
    },
    {
      name: 'Chat IA',
      icon: Share2,
      status: 'Ativo',
      color: 'from-blue-500 to-blue-600',
      connected: true,
      account: 'Sistema integrado',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="glass-panel border border-border px-6 py-6 sm:px-8 sm:py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Rotas conectadas</p>
            <h1 className="mt-2 text-3xl font-semibold text-foreground">Canais</h1>
            <p className="mt-1 text-sm text-muted-foreground">Gerencie integracoes e latencia entre plataformas.</p>
          </div>
          <Button className="rounded-full">
            <Plus className="mr-2 h-4 w-4" /> Adicionar canal
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {channels.map((channel) => (
          <div key={channel.name} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className={`rounded-2xl bg-gradient-to-br ${channel.color} p-3 text-white`}>
                <channel.icon className="h-6 w-6" />
              </div>
              {channel.connected && (
                <div className="flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] uppercase tracking-[0.4em] text-primary">
                  <CheckCircle2 className="h-3 w-3" />
                  {channel.status}
                </div>
              )}
            </div>
            <h3 className="mt-4 text-xl font-semibold text-foreground">{channel.name}</h3>
            <p className="text-sm text-muted-foreground">{channel.account}</p>
            <div className="mt-6 flex gap-2">
              <Button variant="outline" className="flex-1 rounded-2xl border-border/70">
                Configurar
              </Button>
              <Button variant="ghost" className="flex-1 rounded-2xl text-muted-foreground hover:text-destructive">
                Desconectar
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
