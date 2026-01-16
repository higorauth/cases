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
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-white p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Visão geral das suas conversas e métricas
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Relatório
          </Button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label} className="card-hover rounded-xl border border-border bg-white p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">{item.value}</p>
                  <p className="mt-1 flex items-center gap-1 text-sm font-medium text-success">
                    <TrendingUp className="h-3 w-3" />
                    {item.delta}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-xl border border-border bg-white p-6 xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-foreground">Atividade 24h</h3>
              <p className="text-sm text-muted-foreground">Distribuição por período</p>
            </div>
            <span className="rounded-lg bg-success/10 px-3 py-1 text-xs font-semibold text-success">
              Ao Vivo
            </span>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {timeline.map((slot, index) => (
              <div key={slot.label} className="rounded-lg border border-border bg-gray-50 p-4">
                <p className="text-xs font-medium text-muted-foreground">{slot.label}</p>
                <div className="mt-4 flex h-20 items-end">
                  <div 
                    className="w-full rounded-t-md bg-primary/20"
                    style={{ height: `${slot.value}%` }}
                  />
                </div>
                <p className="mt-3 text-lg font-bold text-foreground">{slot.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-white p-6">
          <h3 className="text-lg font-bold text-foreground">Performance</h3>
          <p className="text-sm text-muted-foreground">Métricas em tempo real</p>
          <div className="mt-6 space-y-3">
            {serviceLevels.map((item) => (
              <div key={item.label} className="card-hover flex items-center justify-between rounded-lg border border-border bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="text-lg font-bold text-foreground">{item.value}</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
