import { Button } from '@/components/ui/button';
import { Brain, MessageSquare, Instagram, MessageCircle, TrendingUp, Clock, Zap, Share2, ArrowRight } from 'lucide-react';

export function Dashboard() {
  const stats = [
    { label: 'Conversas IA', value: '1.2k', delta: '+12%', icon: Brain },
    { label: 'Instagram', value: '456', delta: '+8%', icon: Instagram },
    { label: 'WhatsApp', value: '789', delta: '+5%', icon: MessageCircle },
    { label: 'Canais ativos', value: '03', delta: '100%', icon: Share2 },
  ];

  const timeline = [
    { label: '00-06h', value: 24 },
    { label: '06-12h', value: 48 },
    { label: '12-18h', value: 72 },
    { label: '18-24h', value: 36 },
  ];

  const serviceLevels = [
    { label: 'Taxa de resposta', value: '98.5%', icon: Zap },
    { label: 'Tempo medio', value: '2.3s', icon: Clock },
    { label: 'Satisfacao', value: '4.8/5', icon: MessageSquare },
  ];

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-[rgba(16,111,99,0.12)] to-transparent px-8 py-10">
        <p className="text-xs uppercase tracking-[0.5em] text-muted-foreground">Overview</p>
        <div className="mt-4 flex flex-wrap items-end gap-6">
          <div>
            <h1 className="text-4xl font-semibold text-foreground">Bem-vindo ao painel Josias</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Uma visao enxuta de conversas inteligentes, canais conectados e pulsacao de atendimento.
            </p>
          </div>
          <Button className="rounded-full">
            Atualizar insights
            <TrendingUp className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label} className="rounded-2xl border border-border/60 bg-card/60 px-5 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">{item.label}</p>
                  <p className="mt-3 text-3xl font-semibold text-foreground">{item.value}</p>
                  <p className="text-xs text-[rgb(16,111,99)]">{item.delta} semana</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border/60 text-muted-foreground">
                  <item.icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-border/60 p-6 xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Atividade 24h</p>
              <h2 className="mt-2 text-xl font-semibold text-foreground">Fluxo por janela de tempo</h2>
            </div>
            <span className="rounded-full border border-border/60 px-3 py-1 text-xs uppercase tracking-[0.35em] text-muted-foreground">Realtime</span>
          </div>
          <div className="mt-6 grid grid-cols-4 gap-4">
            {timeline.map((slot) => (
              <div key={slot.label} className="rounded-2xl border border-border/60 px-4 py-5">
                <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">{slot.label}</p>
                <div className="mt-4 h-24 rounded-full bg-[rgb(16,111,99)/0.12]">
                  <div className="h-full w-full rounded-full bg-[rgb(16,111,99)/0.4]" style={{ height: `${slot.value}%` }} />
                </div>
                <p className="mt-3 text-lg font-semibold text-foreground">{slot.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-border/60 p-6">
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">Service level</p>
          <h2 className="mt-2 text-xl font-semibold text-foreground">Operacao em tempo real</h2>
          <div className="mt-6 space-y-4">
            {serviceLevels.map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-2xl border border-border/60 px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgb(16,111,99)/0.12]">
                    <item.icon className="h-4 w-4 text-[rgb(16,111,99)]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.value}</p>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
      </div>
    </div>
  );
}
