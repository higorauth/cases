'use client';

import { Instagram, Image, Video, MessageCircle, Heart, Send } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

export function InstagramPage() {
  const [isConnected, setIsConnected] = useState(false);

  // Se não estiver conectado, mostrar tela de conexão
  if (!isConnected) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="w-full max-w-2xl rounded-2xl bg-card p-8 shadow-lg border border-border">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600">
              <Instagram className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-card-foreground">Posts do Instagram</h2>
              <p className="text-sm text-muted-foreground">
                Visualize e gerencie todos os seus posts do Instagram de contas conectadas
              </p>
            </div>
          </div>

          <div className="rounded-xl border-2 border-dashed border-border bg-muted p-8">
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border-2 border-border bg-card">
                <Instagram className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-card-foreground">Nenhuma Conta do Instagram Conectada</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Conecte sua conta do Instagram na página de Canais para visualizar seus posts aqui.
                </p>
              </div>
            </div>

            <Button className="mt-4 bg-gradient-to-r from-[rgb(62,207,142)] to-[rgb(36,181,116)] hover:from-[rgb(36,181,116)] hover:to-[rgb(30,142,95)]">
              Ir para Canais
            </Button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-muted p-4">
              <h4 className="mb-2 font-semibold text-card-foreground">Recursos do Instagram</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✓ Visualizar posts e stories</li>
                <li>✓ Gerenciar comentários</li>
                <li>✓ Métricas de engajamento</li>
              </ul>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <h4 className="mb-2 font-semibold text-card-foreground">Integração API</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✓ Instagram Graph API</li>
                <li>✓ Direct Messages</li>
                <li>✓ Publicação automática</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quando conectado (ainda não implementado)
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-purple-600">
          <Instagram className="h-10 w-10 text-white" />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-foreground">Instagram conectado!</h2>
        <p className="mt-2 text-muted-foreground">Interface de posts em desenvolvimento...</p>
      </div>
    </div>
  );
}
