'use client';

import { useState } from 'react';
import { CreditCard, Check, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

export function BillingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    {
      name: 'Josias Team Basic',
      description: 'Plano básico para equipes pequenas (até 3 membros)',
      monthlyPrice: 95,
      annualPrice: 950,
      features: [
        'Até 3 membros da equipe',
        '1.000 mensagens por mês',
        'Suporte por email',
        'Integrações básicas',
      ],
    },
    {
      name: 'Josias Team Standard',
      description: 'Plano recomendado para equipes (até 10 membros)',
      monthlyPrice: 145,
      annualPrice: 1450,
      recommended: true,
      features: [
        'Até 10 membros da equipe',
        '10.000 mensagens por mês',
        'Suporte prioritário',
        'Todas as integrações',
        'Relatórios avançados',
      ],
    },
    {
      name: 'Josias Team Business',
      description: 'Plano avançado para grandes equipes (membros ilimitados)',
      monthlyPrice: 495,
      annualPrice: 4950,
      features: [
        'Membros ilimitados',
        'Mensagens ilimitadas',
        'Suporte 24/7',
        'Integrações personalizadas',
        'API dedicada',
        'Gerente de conta dedicado',
      ],
    },
  ];

  return (
    <div className="space-y-8">
      <div className="glass-panel border border-border/70 px-8 py-8">
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <span>Inicio</span>
          <span>/</span>
          <span className="text-foreground">Cobranca</span>
        </div>
        <h1 className="text-3xl font-semibold text-foreground">Gerencie seu plano</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Revise limites atuais, troque de pacote ou pause a assinatura quando quiser.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={cn(
              'rounded-full border px-4 py-2 text-sm font-medium',
              billingPeriod === 'monthly'
                ? 'border-transparent bg-[rgb(16,111,99)] text-white'
                : 'border-border/70 text-muted-foreground'
            )}
          >
            {billingPeriod === 'monthly' && <Check className="mr-2 inline h-4 w-4" />}
            Cobranca mensal
          </button>
          <button
            onClick={() => setBillingPeriod('annual')}
            className={cn(
              'rounded-full border px-4 py-2 text-sm font-medium',
              billingPeriod === 'annual'
                ? 'border-transparent bg-[rgb(16,111,99)] text-white'
                : 'border-border/70 text-muted-foreground'
            )}
          >
            {billingPeriod === 'annual' && <Check className="mr-2 inline h-4 w-4" />}
            Cobranca anual
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              'rounded-3xl border border-border/60 bg-card/60 p-6',
              plan.recommended && 'ring-1 ring-[rgb(16,111,99)]/50'
            )}
          >
            {plan.recommended && (
              <span className="inline-flex rounded-full border border-[rgb(16,111,99)]/40 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-[rgb(16,111,99)]">
                Destaque
              </span>
            )}
            <div className="mt-4 flex items-center gap-3">
              <span className="rounded-2xl border border-border/60 p-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </span>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-4xl font-semibold text-foreground">
                R$ {billingPeriod === 'monthly' ? plan.monthlyPrice : plan.annualPrice}
                <span className="text-base text-muted-foreground">/{billingPeriod === 'monthly' ? 'mes' : 'ano'}</span>
              </p>
            </div>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-[rgb(16,111,99)]" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button className="mt-6 w-full rounded-2xl">Prosseguir para pagamento</Button>
          </div>
        ))}
      </div>

      <div className="glass-panel border border-border/70 px-8 py-6">
        <h2 className="text-xl font-semibold text-foreground">Informacoes adicionais</h2>
        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-foreground">Metodos aceitos</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>Cartao de credito (Visa, Mastercard, Amex)</li>
              <li>Boleto bancario</li>
              <li>PIX instantaneo</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Politica de cancelamento</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>Cancele em qualquer momento</li>
              <li>Sem taxas adicionais</li>
              <li>Reembolso proporcional no plano anual</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
