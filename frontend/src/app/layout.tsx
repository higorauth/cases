import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-space-grotesk" });

export const metadata: Metadata = {
  title: "JOSIAS - IA Conversacional para Atendimento",
  description: "Plataforma de IA para atendimento de leads com capacidades de vendas e suporte",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${spaceGrotesk.className} bg-background text-foreground antialiased`}>
        {children}
      </body>
    </html>
  );
}
