# 🎨 Frontend - JOSIAS

Interface web moderna para o sistema de IA conversacional JOSIAS.

## 🛠️ Stack Tecnológico

- **Next.js 16+** - Framework React com App Router
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Estilização utilitária
- **Shadcn/ui** - Componentes UI de alta qualidade
- **Lucide React** - Ícones minimalistas
- **Axios** - Cliente HTTP
- **React Markdown** - Renderização de Markdown

## 📦 Estrutura

```
src/
├── app/
│   ├── layout.tsx      # Root layout com Inter font
│   ├── page.tsx        # Página principal (Chat)
│   └── globals.css     # Estilos globais
├── components/
│   ├── ui/             # Componentes do Shadcn
│   ├── sidebar.tsx     # Navegação lateral
│   ├── chat-interface.tsx    # Interface de chat
│   ├── settings-panel.tsx    # Painel de configurações
│   └── credentials-form.tsx  # Formulário de credenciais
├── lib/
│   ├── api.ts         # Cliente Axios + endpoints
│   └── utils.ts       # Funções utilitárias
└── types/
    └── index.ts       # TypeScript interfaces
```

## 🚀 Como Rodar

### Desenvolvimento

```bash
npm run dev
```

Acessa em: **http://localhost:3000**

### Build para Produção

```bash
npm run build
npm run start
```

## 📝 Componentes Principais

### Sidebar
- Navegação entre Chat, Configurações e Credenciais
- Lista de conversas com delete
- Botão para nova conversa

### ChatInterface
- Display de mensagens com Markdown
- Input de texto com Enter para enviar
- Indicador de loading
- Delay de 10s entre mensagens

### SettingsPanel
- Ajuste de system prompt
- Seleção de modelo de IA
- Slider de temperatura
- Tokens máximos e idioma

### CredentialsForm
- Entrada segura de chaves de API
- Campos para OpenAI, Supabase

## 🌍 Variáveis de Ambiente

`.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🎨 Design

- **Fonte**: Inter
- **Cores**: Slate (base color)
- **Componentes**: Shadcn/ui
- **Responsivo**: Mobile-first

---

**Parte do JOSIAS - Sistema de IA Conversacional**

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
