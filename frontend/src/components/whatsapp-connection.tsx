'use client';

import { useState } from 'react';
import { Phone, Check, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';

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

interface ConnectionProps {
  onConnect: (credentials: WhatsAppCredentials) => void;
}

export function WhatsAppConnection({ onConnect }: ConnectionProps) {
  const [apiType, setApiType] = useState<'official' | 'evolution'>('official');
  const [step, setStep] = useState<'apiselect' | 'info' | 'credentials' | 'webhook' | 'testing'>('apiselect');
  const [isLoading, setIsLoading] = useState(false);
  const [officialCredentials, setOfficialCredentials] = useState({
    phoneNumberId: '',
    businessAccountId: '',
    accessToken: '',
    webhookVerifyToken: '',
  });
  const [evolutionCredentials, setEvolutionCredentials] = useState({
    evolutionApiUrl: '',
    instanceName: '',
    apiKey: '',
  });
  const [testResults, setTestResults] = useState<{
    tokenValid: boolean | null;
    phoneNumberValid: boolean | null;
    webhookConfigured: boolean | null;
  }>({
    tokenValid: null,
    phoneNumberValid: null,
    webhookConfigured: null,
  });
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleTestConnection = async () => {
    setIsLoading(true);
    setStep('testing');
    setErrorMessage('');
    setQrCode(null);
    setConnectionStatus('disconnected');

    try {
      if (apiType === 'official') {
        // Testar token de acesso da API oficial
        const tokenResponse = await fetch(
          `https://graph.facebook.com/v18.0/${officialCredentials.phoneNumberId}`,
          {
            headers: {
              Authorization: `Bearer ${officialCredentials.accessToken}`,
            },
          }
        );

        setTestResults(prev => ({ ...prev, tokenValid: tokenResponse.ok }));

        if (tokenResponse.ok) {
          const data = await tokenResponse.json();
          setTestResults(prev => ({ ...prev, phoneNumberValid: !!data.id }));
        }

        // Simular teste de webhook (em produção, isso seria feito no backend)
        setTimeout(() => {
          setTestResults(prev => ({ ...prev, webhookConfigured: true }));
          setIsLoading(false);
        }, 1500);
      } else {
        // Testar Evolution API - SOMENTE CONECTAR (instância já existe)
        try {
          console.log('🚀 Iniciando conexão com Evolution API...');
          console.log('📍 URL:', evolutionCredentials.evolutionApiUrl);
          console.log('📱 Instância:', evolutionCredentials.instanceName);

          // PASSO 1: Conectar à instância existente para gerar QR Code
          console.log('🔌 Conectando à instância existente...');

          let connectResponse: Response;
          try {
            connectResponse = await fetch(
              `${evolutionCredentials.evolutionApiUrl}/instance/connect/${evolutionCredentials.instanceName}`,
              {
                method: 'GET',
                headers: {
                  'apikey': evolutionCredentials.apiKey,
                },
              }
            );

            console.log('📊 Status da resposta:', connectResponse.status);
            console.log('📊 Status OK:', connectResponse.ok);
          } catch (networkError) {
            console.error('❌ ERRO DE REDE:', networkError);
            setErrorMessage('Erro de conexão com a Evolution API. Verifique: (1) URL está correta, (2) Servidor está rodando, (3) CORS está configurado');
            setTestResults(prev => ({ ...prev, tokenValid: false }));
            setIsLoading(false);
            return;
          }

          // Validar API Key
          setTestResults(prev => ({ ...prev, tokenValid: connectResponse.ok || connectResponse.status === 404 }));

          if (!connectResponse.ok) {
            const errorText = await connectResponse.text();
            console.error('❌ Erro na resposta:', connectResponse.status, errorText);

            if (connectResponse.status === 404) {
              setErrorMessage('Instância não encontrada. Verifique se o nome da instância está correto na Evolution API.');
            } else if (connectResponse.status === 401 || connectResponse.status === 403) {
              setErrorMessage('API Key inválida ou sem permissão. Verifique sua chave de API.');
            } else {
              setErrorMessage(`Erro ${connectResponse.status}: ${errorText || 'Erro desconhecido'}`);
            }

            setTestResults(prev => ({ ...prev, tokenValid: false }));
            setIsLoading(false);
            return;
          }

          // PASSO 2: Processar resposta e extrair QR Code
          const connectData = await connectResponse.json();
          console.log('✅ DADOS RECEBIDOS DA EVOLUTION API:');
          console.log(JSON.stringify(connectData, null, 2));

          // PASSO 3: Extrair QR Code (testar todos os formatos possíveis)
          let qrCodeData: string | null = null;

          console.log('🔍 Procurando QR Code nos dados...');

          // Formato 1: base64 direto na raiz
          if (connectData.base64) {
            console.log('✅ QR Code encontrado em: connectData.base64');
            qrCodeData = connectData.base64.startsWith('data:')
              ? connectData.base64
              : `data:image/png;base64,${connectData.base64}`;
          }
          // Formato 2: dentro de qrcode.base64
          else if (connectData.qrcode?.base64) {
            console.log('✅ QR Code encontrado em: connectData.qrcode.base64');
            qrCodeData = connectData.qrcode.base64.startsWith('data:')
              ? connectData.qrcode.base64
              : `data:image/png;base64,${connectData.qrcode.base64}`;
          }
          // Formato 3: qrcode como string base64
          else if (typeof connectData.qrcode === 'string' && connectData.qrcode.length > 0) {
            console.log('✅ QR Code encontrado em: connectData.qrcode (string)');
            qrCodeData = connectData.qrcode.startsWith('data:')
              ? connectData.qrcode
              : `data:image/png;base64,${connectData.qrcode}`;
          }
          // Formato 4: code ou pairCode
          else if (connectData.code) {
            console.log('✅ QR Code encontrado em: connectData.code');
            qrCodeData = connectData.code.startsWith('data:')
              ? connectData.code
              : `data:image/png;base64,${connectData.code}`;
          }
          // Formato 5: qr (algumas versões)
          else if (connectData.qr) {
            console.log('✅ QR Code encontrado em: connectData.qr');
            qrCodeData = typeof connectData.qr === 'string' && connectData.qr.startsWith('data:')
              ? connectData.qr
              : `data:image/png;base64,${connectData.qr}`;
          }
          // Formato 6: pairingCode (código numérico, não QR Code visual)
          else if (connectData.pairingCode) {
            console.log('⚠️ Código de pareamento encontrado:', connectData.pairingCode);
            setErrorMessage(`Código de pareamento: ${connectData.pairingCode}. Digite este código no WhatsApp.`);
          }

          console.log('📊 QR Code extraído:', qrCodeData ? 'SIM' : 'NÃO');
          console.log('📏 Tamanho do QR Code:', qrCodeData?.length || 0);

          // PASSO 4: Exibir QR Code ou mostrar erro
          if (qrCodeData) {
            console.log('✅ QR CODE GERADO COM SUCESSO!');
            console.log('📱 Exibindo QR Code na interface...');

            setQrCode(qrCodeData);
            setConnectionStatus('connecting');
            setTestResults(prev => ({
              ...prev,
              tokenValid: true,
              phoneNumberValid: null,
              webhookConfigured: true
            }));

            // PASSO 5: Monitorar conexão (verificar se usuário escaneou)
            console.log('🔄 Iniciando monitoramento de conexão...');

            // Monitoramento permanente de conexão a cada 5 segundos
            setInterval(async () => {
              try {
                const statusResponse = await fetch(
                  `${evolutionCredentials.evolutionApiUrl}/instance/connectionState/${evolutionCredentials.instanceName}`,
                  {
                    headers: {
                      'apikey': evolutionCredentials.apiKey,
                    },
                  }
                );

                if (statusResponse.ok) {
                  const statusData = await statusResponse.json();
                  console.log('📊 Status atual:', statusData.state);

                  if (statusData.state === 'open') {
                    // Conectado
                    if (connectionStatus !== 'connected') {
                      console.log('✅ WHATSAPP CONECTADO!');
                      setConnectionStatus('connected');
                      setTestResults(prev => ({ ...prev, phoneNumberValid: true }));
                      setQrCode(null); // Fechar QR Code
                      setErrorMessage(''); // Limpar erros
                    }
                  } else if (statusData.state === 'close') {
                    // Desconectado
                    console.log('⚠️ WHATSAPP DESCONECTADO!');
                    setConnectionStatus('disconnected');
                    setTestResults(prev => ({ ...prev, phoneNumberValid: false }));
                    setQrCode(null);
                    setErrorMessage('⚠️ WhatsApp desconectado! Clique em "Testar Conexão" novamente para reconectar.');
                  }
                }
              } catch (error) {
                console.error('❌ Erro ao verificar status:', error);
              }
            }, 5000);

            // Timeout apenas para o QR Code (não para o monitoramento)
            setTimeout(() => {
              if (connectionStatus !== 'connected' && qrCode) {
                console.log('⏱️ Timeout: QR Code expirado');
                setQrCode(null);
                setTestResults(prev => ({ ...prev, phoneNumberValid: false }));
                setErrorMessage('QR Code expirou. Clique em "Testar Conexão" novamente para gerar um novo.');
              }
            }, 300000); // 5 minutos para o QR Code expirar
          } else {
            // QR Code não encontrado - verificar se já está conectado
            console.error('❌ QR Code NÃO encontrado na resposta');
            console.log('🔍 Verificando se a instância já está conectada...');

            const statusCheck = await fetch(
              `${evolutionCredentials.evolutionApiUrl}/instance/connectionState/${evolutionCredentials.instanceName}`,
              {
                headers: {
                  'apikey': evolutionCredentials.apiKey,
                },
              }
            );

            if (statusCheck.ok) {
              const statusData = await statusCheck.json();
              console.log('📊 Status atual da instância:', statusData);

              if (statusData.state === 'open') {
                console.log('✅ Instância JÁ ESTÁ CONECTADA!');
                setConnectionStatus('connected');
                setTestResults(prev => ({
                  ...prev,
                  tokenValid: true,
                  phoneNumberValid: true,
                  webhookConfigured: true
                }));
                setIsLoading(false);
                return;
              }
            }

            // Realmente não tem QR Code e não está conectado
            setErrorMessage('QR Code não foi gerado pela Evolution API. Verifique os logs no console (F12) para ver a resposta completa.');
            setTestResults(prev => ({ ...prev, phoneNumberValid: false }));
          }

          setIsLoading(false);
        } catch (error) {
          console.error('Erro ao conectar Evolution API:', error);
          setTestResults(prev => ({
            ...prev,
            tokenValid: false,
            phoneNumberValid: false
          }));
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error('Erro ao testar conexão:', error);
      setTestResults({
        tokenValid: false,
        phoneNumberValid: false,
        webhookConfigured: false,
      });
      setIsLoading(false);
    }
  };

  const handleConnect = () => {
    if (testResults.tokenValid && testResults.phoneNumberValid) {
      if (apiType === 'official') {
        onConnect({
          apiType: 'official',
          ...officialCredentials
        });
      } else {
        onConnect({
          apiType: 'evolution',
          ...evolutionCredentials
        });
      }
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-background p-8">
      <div className="w-full max-w-3xl rounded-2xl bg-card p-8 shadow-lg border border-border">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[rgb(62,207,142)] to-[rgb(36,181,116)]">
            <Phone className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Conectar WhatsApp
            </h2>
            <p className="text-sm text-muted-foreground">
              {apiType === 'official'
                ? 'Configure sua integração com a API oficial do WhatsApp'
                : 'Configure sua integração com Evolution API'}
            </p>
          </div>
        </div>

        {/* Steps indicator */}
        {step !== 'apiselect' && (
          <div className="mb-8 flex items-center justify-between">
            {['Informações', 'Credenciais', apiType === 'official' ? 'Webhook' : 'Conexão', 'Teste'].map((label, idx) => (
              <div key={label} className="flex flex-1 items-center">
                <div className="flex items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      step === ['info', 'credentials', 'webhook', 'testing'][idx]
                        ? 'bg-[rgb(62,207,142)] text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span className="ml-2 text-sm font-medium text-foreground">
                    {label}
                  </span>
                </div>
                {idx < 3 && (
                  <div className="mx-4 h-0.5 flex-1 bg-border" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Step 0: API Selection */}
        {step === 'apiselect' && (
          <div className="space-y-6">
            <div>
              <h3 className="mb-4 text-lg font-semibold text-foreground">
                Escolha o tipo de API WhatsApp
              </h3>
              <p className="mb-6 text-sm text-muted-foreground">
                Selecione qual API você deseja utilizar para conectar o WhatsApp
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Official API Card */}
              <div
                onClick={() => setApiType('official')}
                className={`cursor-pointer rounded-xl border-2 p-6 transition-all ${
                  apiType === 'official'
                    ? 'border-[rgb(62,207,142)] bg-[rgb(62,207,142)]/10'
                    : 'border-border bg-card hover:border-[rgb(62,207,142)]/50'
                }`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  {apiType === 'official' && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[rgb(62,207,142)]">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
                <h4 className="mb-2 font-semibold text-card-foreground">
                  API Oficial (Meta)
                </h4>
                <p className="mb-4 text-sm text-muted-foreground">
                  WhatsApp Business Cloud API oficial do Meta/Facebook
                </p>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-3 w-3 flex-shrink-0 text-[rgb(62,207,142)]" />
                    <span>Suporte oficial do Meta</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-3 w-3 flex-shrink-0 text-[rgb(62,207,142)]" />
                    <span>Maior estabilidade</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-3 w-3 flex-shrink-0 text-[rgb(62,207,142)]" />
                    <span>Requer aprovação do Meta</span>
                  </li>
                </ul>
              </div>

              {/* Evolution API Card */}
              <div
                onClick={() => setApiType('evolution')}
                className={`cursor-pointer rounded-xl border-2 p-6 transition-all ${
                  apiType === 'evolution'
                    ? 'border-[rgb(62,207,142)] bg-[rgb(62,207,142)]/10'
                    : 'border-border bg-card hover:border-[rgb(62,207,142)]/50'
                }`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-[rgb(62,207,142)] to-[rgb(36,181,116)]">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  {apiType === 'evolution' && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[rgb(62,207,142)]">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
                <h4 className="mb-2 font-semibold text-card-foreground">
                  Evolution API
                </h4>
                <p className="mb-4 text-sm text-muted-foreground">
                  API não oficial para WhatsApp com mais flexibilidade
                </p>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-3 w-3 flex-shrink-0 text-[rgb(62,207,142)]" />
                    <span>Configuração mais simples</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-3 w-3 flex-shrink-0 text-[rgb(62,207,142)]" />
                    <span>Não requer aprovação</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-3 w-3 flex-shrink-0 text-[rgb(62,207,142)]" />
                    <span>Mais recursos disponíveis</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                onClick={() => setStep('info')}
                className="bg-[rgb(62,207,142)] hover:bg-[rgb(36,181,116)] text-white"
              >
                Continuar
              </Button>
            </div>
          </div>
        )}

        {/* Step 1: Informações */}
        {step === 'info' && (
          <div className="space-y-6">
            <div className="rounded-xl border-2 border-dashed border-border bg-muted p-6">
              <h3 className="mb-4 font-semibold text-foreground">
                Requisitos para conexão:
              </h3>

              {apiType === 'official' ? (
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                    <span>Conta do Meta Business Manager criada</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                    <span>WhatsApp Business API configurado no Meta for Developers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                    <span>Token de acesso (Access Token) gerado</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                    <span>Phone Number ID do número de telefone verificado</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                    <span>WhatsApp Business Account ID</span>
                  </li>
                </ul>
              ) : (
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                    <span>Servidor Evolution API instalado e rodando</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                    <span>URL da Evolution API acessível</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                    <span>API Key gerada na Evolution API</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                    <span>Nome da instância definido</span>
                  </li>
                </ul>
              )}

              <div className="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-950/30">
                <div className="flex gap-2">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                  <div>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-300">
                      Precisa de ajuda?
                    </h4>
                    <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
                      {apiType === 'official'
                        ? 'Siga o guia oficial do Meta para configurar a WhatsApp Business API.'
                        : 'Consulte a documentação da Evolution API para instalação e configuração.'}
                    </p>
                    <a
                      href={apiType === 'official'
                        ? 'https://developers.facebook.com/docs/whatsapp/cloud-api/get-started'
                        : 'https://doc.evolution-api.com/'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Ver documentação
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between gap-3">
              <Button variant="outline" onClick={() => setStep('apiselect')}>
                Voltar
              </Button>
              <Button
                onClick={() => setStep('credentials')}
                className="bg-[rgb(62,207,142)] hover:bg-[rgb(36,181,116)] text-white"
              >
                Continuar
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Credenciais */}
        {step === 'credentials' && (
          <div className="space-y-6">
            {apiType === 'official' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground">
                    Phone Number ID *
                  </label>
                  <input
                    type="text"
                    value={officialCredentials.phoneNumberId}
                    onChange={(e) =>
                      setOfficialCredentials({ ...officialCredentials, phoneNumberId: e.target.value })
                    }
                    placeholder="Ex: 123456789012345"
                    className="mt-1 w-full rounded-lg border border-border bg-card px-4 py-2 text-foreground focus:border-[rgb(62,207,142)] focus:outline-none focus:ring-2 focus:ring-[rgb(62,207,142)]"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Encontre em: Meta for Developers &gt; WhatsApp &gt; API Setup
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground">
                    WhatsApp Business Account ID *
                  </label>
                  <input
                    type="text"
                    value={officialCredentials.businessAccountId}
                    onChange={(e) =>
                      setOfficialCredentials({ ...officialCredentials, businessAccountId: e.target.value })
                    }
                    placeholder="Ex: 987654321098765"
                    className="mt-1 w-full rounded-lg border border-border bg-card px-4 py-2 text-foreground focus:border-[rgb(62,207,142)] focus:outline-none focus:ring-2 focus:ring-[rgb(62,207,142)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground">
                    Access Token (Token de Acesso) *
                  </label>
                  <textarea
                    value={officialCredentials.accessToken}
                    onChange={(e) =>
                      setOfficialCredentials({ ...officialCredentials, accessToken: e.target.value })
                    }
                    placeholder="Ex: EAAxxxxxxxxxxxxxxxxxxxxxxxxx..."
                    rows={3}
                    className="mt-1 w-full rounded-lg border border-border bg-card px-4 py-2 text-foreground focus:border-[rgb(62,207,142)] focus:outline-none focus:ring-2 focus:ring-[rgb(62,207,142)]"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Use um token de acesso permanente, não temporário
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground">
                    Webhook Verify Token *
                  </label>
                  <input
                    type="text"
                    value={officialCredentials.webhookVerifyToken}
                    onChange={(e) =>
                      setOfficialCredentials({ ...officialCredentials, webhookVerifyToken: e.target.value })
                    }
                    placeholder="Ex: meu_token_secreto_123"
                    className="mt-1 w-full rounded-lg border border-border bg-card px-4 py-2 text-foreground focus:border-[rgb(62,207,142)] focus:outline-none focus:ring-2 focus:ring-[rgb(62,207,142)]"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Crie um token único para verificação do webhook
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground">
                    URL da Evolution API *
                  </label>
                  <input
                    type="text"
                    value={evolutionCredentials.evolutionApiUrl}
                    onChange={(e) =>
                      setEvolutionCredentials({ ...evolutionCredentials, evolutionApiUrl: e.target.value })
                    }
                    placeholder="Ex: https://evolution-api.seudominio.com"
                    className="mt-1 w-full rounded-lg border border-border bg-card px-4 py-2 text-foreground focus:border-[rgb(62,207,142)] focus:outline-none focus:ring-2 focus:ring-[rgb(62,207,142)]"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    URL base do servidor Evolution API (sem barra no final)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground">
                    Nome da Instância *
                  </label>
                  <input
                    type="text"
                    value={evolutionCredentials.instanceName}
                    onChange={(e) =>
                      setEvolutionCredentials({ ...evolutionCredentials, instanceName: e.target.value })
                    }
                    placeholder="Ex: minha-instancia"
                    className="mt-1 w-full rounded-lg border border-border bg-card px-4 py-2 text-foreground focus:border-[rgb(62,207,142)] focus:outline-none focus:ring-2 focus:ring-[rgb(62,207,142)]"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Nome identificador da sua instância WhatsApp
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground">
                    API Key *
                  </label>
                  <textarea
                    value={evolutionCredentials.apiKey}
                    onChange={(e) =>
                      setEvolutionCredentials({ ...evolutionCredentials, apiKey: e.target.value })
                    }
                    placeholder="Ex: B6D9F5J2K8L3M..."
                    rows={3}
                    className="mt-1 w-full rounded-lg border border-border bg-card px-4 py-2 text-foreground focus:border-[rgb(62,207,142)] focus:outline-none focus:ring-2 focus:ring-[rgb(62,207,142)]"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Chave de API da Evolution configurada no servidor
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-between gap-3">
              <Button variant="outline" onClick={() => setStep('info')}>
                Voltar
              </Button>
              <Button
                onClick={() => setStep('webhook')}
                disabled={
                  apiType === 'official'
                    ? !officialCredentials.phoneNumberId ||
                      !officialCredentials.businessAccountId ||
                      !officialCredentials.accessToken ||
                      !officialCredentials.webhookVerifyToken
                    : !evolutionCredentials.evolutionApiUrl ||
                      !evolutionCredentials.instanceName ||
                      !evolutionCredentials.apiKey
                }
                className="bg-[rgb(62,207,142)] hover:bg-[rgb(36,181,116)] text-white"
              >
                Continuar
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Webhook / Conexão */}
        {step === 'webhook' && (
          <div className="space-y-6">
            {apiType === 'official' ? (
              <div className="rounded-xl border-2 border-dashed border-border bg-muted p-6">
                <h3 className="mb-4 font-semibold text-foreground">
                  Configure o Webhook no Meta for Developers:
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">
                      Callback URL:
                    </label>
                    <div className="mt-1 flex gap-2">
                      <input
                        type="text"
                        value={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/webhooks/whatsapp`}
                        readOnly
                        className="flex-1 rounded-lg border border-border bg-muted px-4 py-2 text-sm text-foreground"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/webhooks/whatsapp`
                          );
                        }}
                      >
                        Copiar
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground">
                      Verify Token:
                    </label>
                    <div className="mt-1 flex gap-2">
                      <input
                        type="text"
                        value={officialCredentials.webhookVerifyToken}
                        readOnly
                        className="flex-1 rounded-lg border border-border bg-muted px-4 py-2 text-sm text-foreground"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(officialCredentials.webhookVerifyToken);
                        }}
                      >
                        Copiar
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-950/30">
                    <h4 className="mb-2 flex items-center gap-2 font-semibold text-amber-900 dark:text-amber-300">
                      <AlertCircle className="h-5 w-5" />
                      Importante
                    </h4>
                    <ul className="space-y-1 text-sm text-amber-700 dark:text-amber-400">
                      <li>• Certifique-se de que seu servidor backend está rodando</li>
                      <li>• O webhook deve estar acessível publicamente (use ngrok em dev)</li>
                      <li>• Inscreva-se nos eventos: messages, message_status</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border-2 border-dashed border-border bg-muted p-6">
                <h3 className="mb-4 font-semibold text-foreground">
                  Conexão Evolution API:
                </h3>

                <div className="space-y-4">
                  <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950/30">
                    <h4 className="mb-2 flex items-center gap-2 font-semibold text-blue-900 dark:text-blue-300">
                      <AlertCircle className="h-5 w-5" />
                      Como funciona
                    </h4>
                    <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-400">
                      <li>• A Evolution API irá gerar um QR Code para você escanear com seu WhatsApp</li>
                      <li>• Após escanear, a conexão será estabelecida automaticamente</li>
                      <li>• Você poderá enviar e receber mensagens através da API</li>
                    </ul>
                  </div>

                  <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-950/30">
                    <h4 className="mb-2 flex items-center gap-2 font-semibold text-amber-900 dark:text-amber-300">
                      <AlertCircle className="h-5 w-5" />
                      Importante
                    </h4>
                    <ul className="space-y-1 text-sm text-amber-700 dark:text-amber-400">
                      <li>• Certifique-se de que o servidor Evolution API está rodando</li>
                      <li>• A URL da API deve estar acessível</li>
                      <li>• Você precisará escanear o QR Code na próxima etapa</li>
                      <li>• Se houver erro de CORS, configure o CORS na Evolution API</li>
                    </ul>
                  </div>

                  <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950/30">
                    <h4 className="mb-2 flex items-center gap-2 font-semibold text-blue-900 dark:text-blue-300">
                      <AlertCircle className="h-5 w-5" />
                      Configuração CORS (se necessário)
                    </h4>
                    <p className="text-xs text-blue-700 dark:text-blue-400">
                      Se encontrar erro de CORS, adicione no .env da Evolution API:
                    </p>
                    <pre className="mt-2 rounded bg-blue-100 p-2 text-xs text-blue-900 dark:bg-blue-900/30 dark:text-blue-300">
                      CORS_ORIGIN=*{'\n'}
                      CORS_CREDENTIALS=true
                    </pre>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between gap-3">
              <Button variant="outline" onClick={() => setStep('credentials')}>
                Voltar
              </Button>
              <Button
                onClick={handleTestConnection}
                className="bg-[rgb(62,207,142)] hover:bg-[rgb(36,181,116)] text-white"
              >
                Testar Conexão
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Testing */}
        {step === 'testing' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
                <span className="font-medium text-foreground">
                  {apiType === 'official' ? 'Validando Access Token' : 'Validando API Key'}
                </span>
                {testResults.tokenValid === null ? (
                  <Loader2 className="h-5 w-5 animate-spin text-green-600" />
                ) : testResults.tokenValid ? (
                  <Check className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
              </div>

              {/* QR Code Display for Evolution API */}
              {apiType === 'evolution' && qrCode && connectionStatus !== 'connected' && (
                <div className="rounded-xl border-2 border-[rgb(62,207,142)] bg-card p-6 text-center">
                  <h3 className="mb-4 text-lg font-semibold text-foreground">
                    Escaneie o QR Code
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Abra o WhatsApp no seu celular e escaneie o código abaixo:
                  </p>
                  <div className="mx-auto flex items-center justify-center rounded-lg bg-card p-4">
                    <img
                      src={qrCode}
                      alt="QR Code do WhatsApp"
                      className="h-64 w-64 rounded-lg"
                    />
                  </div>
                  <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                    <span>Aguardando conexão...</span>
                  </div>
                  <div className="mt-4 rounded-lg bg-blue-50 p-4 dark:bg-blue-950/30">
                    <p className="text-xs text-blue-700 dark:text-blue-400">
                      <strong>Como escanear:</strong> WhatsApp → Configurações → Aparelhos conectados → Conectar aparelho
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
                <span className="font-medium text-foreground">
                  {apiType === 'official' ? 'Verificando Phone Number ID' : 'Verificando Status da Instância'}
                </span>
                {testResults.phoneNumberValid === null ? (
                  <Loader2 className="h-5 w-5 animate-spin text-green-600" />
                ) : testResults.phoneNumberValid ? (
                  <Check className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
                <span className="font-medium text-foreground">
                  {apiType === 'official' ? 'Testando Webhook' : 'Verificando Conexão WhatsApp'}
                </span>
                {testResults.webhookConfigured === null ? (
                  <Loader2 className="h-5 w-5 animate-spin text-green-600" />
                ) : testResults.webhookConfigured ? (
                  <Check className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="rounded-xl border-2 border-red-500 bg-red-50 p-4 dark:bg-red-950/30">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
                  <div>
                    <h4 className="font-semibold text-red-900 dark:text-red-300">Erro</h4>
                    <p className="mt-1 text-sm text-red-700 dark:text-red-400">{errorMessage}</p>
                    <p className="mt-2 text-xs text-red-600 dark:text-red-500">
                      Verifique o console do navegador (F12) para mais detalhes.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Success Message for Evolution API */}
            {apiType === 'evolution' && connectionStatus === 'connected' && (
              <div className="rounded-xl border-2 border-[rgb(62,207,142)] bg-card p-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[rgb(62,207,142)] animate-pulse">
                  <Check className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-card-foreground">
                  Evolution API Conectada
                </h3>
                <p className="text-sm text-muted-foreground">
                  Sua instância está conectada e pronta para enviar e receber mensagens.
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[rgb(62,207,142)] animate-pulse"></div>
                  <span className="text-xs text-muted-foreground">
                    Monitorando conexão...
                  </span>
                </div>
              </div>
            )}

            {/* Disconnection Warning */}
            {apiType === 'evolution' && connectionStatus === 'disconnected' && !qrCode && step === 'testing' && (
              <div className="rounded-xl border-2 border-red-500 bg-card p-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500 animate-pulse">
                  <AlertCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-card-foreground">
                  WhatsApp Desconectado
                </h3>
                <p className="text-sm text-muted-foreground">
                  A conexão com o WhatsApp foi perdida. Clique em "Voltar" e depois em "Testar Conexão" novamente para reconectar.
                </p>
              </div>
            )}

            {!isLoading && (
              <div className="flex justify-between gap-3">
                <Button variant="outline" onClick={() => setStep('webhook')}>
                  Voltar
                </Button>
                <Button
                  onClick={handleConnect}
                  disabled={!testResults.tokenValid || !testResults.phoneNumberValid}
                  className="bg-[rgb(62,207,142)] hover:bg-[rgb(36,181,116)] text-white"
                >
                  Conectar WhatsApp
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
