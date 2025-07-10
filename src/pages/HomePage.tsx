import { ArrowRight, Instagram, Search, Shield, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Layout from '@/components/Layout'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="mb-8 animate-fade-in">
            <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Instagram className="w-4 h-4" />
              <span>Análise de Seguidores Instagram</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent leading-tight">
              Descubra quem não te segue de volta no Instagram
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Identifique automaticamente as pessoas que você segue mas que não seguem você de volta, 
              usando seus próprios dados do Instagram de forma segura e privada.
            </p>
            
            <Button 
              size="lg" 
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg px-8 py-6 rounded-xl"
              onClick={() => navigate('/instructions')}
            >
              Começar agora
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          <Card className="text-center p-6 shadow-card hover:shadow-glow/20 transition-all duration-300 border-0 bg-card/50 backdrop-blur">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">100% Seguro</h3>
              <p className="text-muted-foreground">
                Seus dados ficam apenas no seu dispositivo durante o processamento
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 shadow-card hover:shadow-glow/20 transition-all duration-300 border-0 bg-card/50 backdrop-blur">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Análise Rápida</h3>
              <p className="text-muted-foreground">
                Processamento instantâneo dos seus dados do Instagram
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 shadow-card hover:shadow-glow/20 transition-all duration-300 border-0 bg-card/50 backdrop-blur">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Resultados Precisos</h3>
              <p className="text-muted-foreground">
                Lista detalhada com links diretos para os perfis
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How it works */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Como funciona?</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Baixe seus dados</h3>
              <p className="text-sm text-muted-foreground">
                Solicite seus dados diretamente no Instagram
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Faça upload</h3>
              <p className="text-sm text-muted-foreground">
                Envie o arquivo ZIP que recebeu
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Análise automática</h3>
              <p className="text-sm text-muted-foreground">
                Processamos e comparamos os dados
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                4
              </div>
              <h3 className="font-semibold mb-2">Veja os resultados</h3>
              <p className="text-sm text-muted-foreground">
                Lista completa de quem não te segue
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}