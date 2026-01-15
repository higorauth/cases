'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AISettings } from '@/types';
import { Save, Loader2 } from 'lucide-react';

interface SettingsPanelProps {
  settings: AISettings;
  onSave: (settings: AISettings) => Promise<void>;
}

const AVAILABLE_LANGUAGES = [
  { value: 'pt-BR', label: 'Português (BR)' },
  { value: 'en-US', label: 'English (US)' },
  { value: 'es-ES', label: 'Español' },
];

export function SettingsPanel({ settings, onSave }: SettingsPanelProps) {
  const [formData, setFormData] = useState<AISettings>(settings);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-screen overflow-y-auto p-6 bg-background">
      <div className="max-w-2xl space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Configurações da IA</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Ajuste o comportamento e parâmetros do JOSIAS
          </p>
        </div>

        {/* Tipo de Negócio */}
        <div className="space-y-2">
          <Label htmlFor="businessType">Tipo de Negócio</Label>
          <Select
            value={formData.businessType}
            onValueChange={(value: 'clinicas' | 'infoprodutos' | 'ecommerce' | 'salao-beleza') =>
              setFormData({ ...formData, businessType: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="clinicas">
                <div className="flex items-center gap-2">
                  <span>🏥</span>
                  <span>Clínicas</span>
                </div>
              </SelectItem>
              <SelectItem value="infoprodutos">
                <div className="flex items-center gap-2">
                  <span>📚</span>
                  <span>Infoprodutos</span>
                </div>
              </SelectItem>
              <SelectItem value="ecommerce">
                <div className="flex items-center gap-2">
                  <span>🛒</span>
                  <span>E-commerce</span>
                </div>
              </SelectItem>
              <SelectItem value="salao-beleza">
                <div className="flex items-center gap-2">
                  <span>💇</span>
                  <span>Salão de Beleza</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Selecione o tipo do seu negócio para otimizar a IA
          </p>
        </div>

        {/* Tipo de IA */}
        <div className="space-y-2">
          <Label htmlFor="aiType">Tipo de IA</Label>
          <Select
            value={formData.aiType}
            onValueChange={(value: 'atendimento' | 'suporte') =>
              setFormData({ ...formData, aiType: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="atendimento">
                <div className="flex items-center gap-2">
                  <span>💬</span>
                  <span>IA de Atendimento</span>
                </div>
              </SelectItem>
              <SelectItem value="suporte">
                <div className="flex items-center gap-2">
                  <span>🛠️</span>
                  <span>IA de Suporte</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Escolha entre atendimento ao cliente ou suporte técnico
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="systemPrompt">Prompt do Sistema (Somente Leitura)</Label>
          <Textarea
            id="systemPrompt"
            value={formData.systemPrompt}
            readOnly
            disabled
            className="min-h-[200px] font-mono text-sm bg-muted text-muted-foreground"
            placeholder="O prompt será gerado automaticamente com base no tipo de negócio e tipo de IA selecionados..."
          />
          <p className="text-xs text-muted-foreground">
            Este prompt é definido automaticamente pelo sistema
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">Idioma</Label>
          <Select
            value={formData.language}
            onValueChange={(value) =>
              setFormData({ ...formData, language: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Temperatura: {formData.temperature.toFixed(2)}</Label>
          </div>
          <Slider
            value={[formData.temperature]}
            onValueChange={(value) =>
              setFormData({ ...formData, temperature: value[0] })
            }
            min={0}
            max={2}
            step={0.1}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Controla a criatividade da IA
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxTokens">Tokens Máximos</Label>
          <Input
            id="maxTokens"
            type="number"
            value={formData.maxTokens}
            onChange={(e) =>
              setFormData({
                ...formData,
                maxTokens: parseInt(e.target.value),
              })
            }
            min={100}
            max={4000}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contextWindow">Janela de Contexto</Label>
          <Input
            id="contextWindow"
            type="number"
            value={formData.contextWindow}
            onChange={(e) =>
              setFormData({
                ...formData,
                contextWindow: parseInt(e.target.value),
              })
            }
            min={1}
            max={50}
          />
          <p className="text-xs text-muted-foreground">
            Número de mensagens anteriores consideradas
          </p>
        </div>

        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full"
          size="lg"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvar Configurações
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
