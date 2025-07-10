import { useState } from 'react'
import { ArrowRight, Settings, Download, FileText, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Layout from '@/components/Layout'
import { useNavigate } from 'react-router-dom'

export default function InstructionsPage() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)

  const steps = [
    {
      id: 1,
      title: "Acesse as Configurações do Instagram",
      description: "Abra o Instagram e vá para o seu perfil",
      details: [
        "Abra o aplicativo do Instagram no seu celular",
        "Toque no seu perfil (ícone no canto inferior direito)",
        "Toque nas três linhas horizontais (☰) no canto superior direito",
        "Selecione 'Configurações e privacidade'"
      ],
      icon: Settings
    },
    {
      id: 2,
      title: "Solicite seus dados",
      description: "Navegue até a seção de dados pessoais",
      details: [
        "Toque em 'Centro de contas'",
        "Selecione 'Suas informações e permissões'",
        "Toque em 'Baixar suas informações'",
        "Escolha a conta que deseja analisar"
      ],
      icon: FileText
    },
    {
      id: 3,
      title: "Configure o download",
      description: "Selecione as informações necessárias",
      details: [
        "Escolha 'Informações específicas'",
        "Marque apenas: 'Seguidores e seguindo'",
        "Formato: JSON (muito importante!)",
        "Qualidade da mídia: Baixa (para ser mais rápido)",
        "Toque em 'Enviar solicitação'"
      ],
      icon: Download
    }
  ]

  const currentStepData = steps.find(step => step.id === currentStep)

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">
            Passo 1: Baixe suas informações do Instagram
          </h1>
          <p className="text-muted-foreground text-lg">
            Siga as instruções abaixo para solicitar seus dados do Instagram
          </p>
        </div>

        {/* Progress */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    currentStep >= step.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step.id}
                </div>
                {step.id < steps.length && (
                  <div className={`w-8 h-0.5 mx-2 ${
                    currentStep > step.id ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Current Step */}
        {currentStepData && (
          <Card className="mb-8 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                  <currentStepData.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl">{currentStepData.title}</h3>
                  <p className="text-muted-foreground font-normal">
                    {currentStepData.description}
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {currentStepData.details.map((detail, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                      {index + 1}
                    </div>
                    <span className="text-sm leading-relaxed">{detail}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mb-8">
          <Button 
            variant="outline" 
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            Anterior
          </Button>
          
          {currentStep < steps.length ? (
            <Button onClick={() => setCurrentStep(currentStep + 1)}>
              Próximo
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          ) : (
            <Button 
              onClick={() => navigate('/upload')}
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
            >
              OK, fiz esse passo
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Important Alert */}
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Importante:</strong> O Instagram pode levar de algumas horas até 14 dias para 
            preparar seus dados. Você receberá um e-mail quando estiver pronto para download. 
            Certifique-se de escolher o formato JSON!
          </AlertDescription>
        </Alert>

        {/* Additional Info */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <h4 className="font-semibold mb-3">Por que preciso fazer isso?</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Para garantir sua privacidade e segurança, utilizamos apenas os dados que VOCÊ 
              baixa diretamente do Instagram. Isso significa que:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Seus dados nunca ficam armazenados em nossos servidores</li>
              <li>• O processamento é feito localmente no seu dispositivo</li>
              <li>• Você tem controle total sobre suas informações</li>
              <li>• Seguimos as melhores práticas de privacidade</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}