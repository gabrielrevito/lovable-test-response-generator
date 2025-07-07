import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, Bot, Sparkles } from "lucide-react";

const Index = () => {
  const [inputText, setInputText] = useState("");
  const [selectedTone, setSelectedTone] = useState("formal");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const tones = [
    { id: "formal", label: "Formal", description: "Resposta profissional e educada" },
    { id: "informal", label: "Informal", description: "Resposta casual e descontraída" },
    { id: "humor", label: "Com Humor", description: "Resposta engraçada e divertida" },
    { id: "exagerado", label: "Exagerado", description: "Resposta dramática e intensa" },
    { id: "sarcastico", label: "Sarcástico", description: "Resposta irônica e espirituosa" },
    { id: "diplomatico", label: "Diplomático", description: "Resposta equilibrada e cuidadosa" }
  ];

  const generateResponse = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, digite o texto que recebeu",
        variant: "destructive",
      });
      return;
    }

    if (!webhookUrl.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, configure a URL do webhook do N8N",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResponse("");

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputText: inputText.trim(),
          tone: selectedTone,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("N8N Response:", data);
      
      // Extract the response text, handling nested structure
      let responseText = data.response?.output || data.output || data.response || data.message || "Resposta gerada com sucesso!";
      
      // Ensure we're setting a string, not an object
      if (typeof responseText === 'object') {
        responseText = JSON.stringify(responseText);
      }
      
      console.log("Setting response text:", responseText);
      setResponse(responseText);
      
      toast({
        title: "Sucesso",
        description: "Resposta gerada com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao gerar resposta:", error);
      toast({
        title: "Erro",
        description: "Falha ao gerar resposta. Verifique a URL do webhook e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center py-8 mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              AI Response Generator
            </h1>
          </div>
          <p className="text-gray-300 text-lg">
            Gere respostas inteligentes com diferentes tons para suas mensagens
          </p>
        </div>

        <div className="space-y-6">
          {/* Configuração do Webhook */}
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Configuração do N8N
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="webhook" className="text-gray-300">
                  URL do Webhook N8N
                </Label>
                <Input
                  id="webhook"
                  placeholder="https://seu-n8n-instance.com/webhook/your-webhook-id"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Input do Texto */}
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Texto Recebido</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Cole aqui o texto que você recebeu e quer responder..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[120px] bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500 resize-none"
              />
            </CardContent>
          </Card>

          {/* Seleção de Tom */}
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Tom da Resposta</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={selectedTone}
                onValueChange={setSelectedTone}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {tones.map((tone) => (
                  <div key={tone.id} className="flex items-start space-x-3">
                    <RadioGroupItem
                      value={tone.id}
                      id={tone.id}
                      className="mt-1 border-gray-500 text-purple-500"
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor={tone.id}
                        className="text-white font-medium cursor-pointer"
                      >
                        {tone.label}
                      </Label>
                      <p className="text-gray-400 text-sm mt-1">
                        {tone.description}
                      </p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Botão de Gerar */}
          <div className="flex justify-center">
            <Button
              onClick={generateResponse}
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Gerar Resposta
                </>
              )}
            </Button>
          </div>

          {/* Resposta */}
          {response && (
            <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  Resposta Gerada
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <p className="text-white whitespace-pre-wrap leading-relaxed">
                    {response}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
