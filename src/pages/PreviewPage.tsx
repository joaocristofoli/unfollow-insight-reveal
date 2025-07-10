import { useState, useEffect } from 'react'
import { Users, Eye, CreditCard, ArrowRight, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Layout from '@/components/Layout'
import { useNavigate } from 'react-router-dom'

export default function PreviewPage() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    following: 0,
    followers: 0,
    notFollowingBack: 0
  })

  useEffect(() => {
    // Check if file was uploaded
    const fileName = sessionStorage.getItem('uploadedFile')
    if (!fileName) {
      navigate('/upload')
      return
    }

    // Simulate analysis results
    const simulatedStats = {
      following: Math.floor(Math.random() * 500) + 200,
      followers: Math.floor(Math.random() * 300) + 150,
      notFollowingBack: Math.floor(Math.random() * 100) + 25
    }
    
    setStats(simulatedStats)
  }, [navigate])

  const handlePurchase = () => {
    // Store stats for payment page
    sessionStorage.setItem('analysisStats', JSON.stringify(stats))
    navigate('/payment')
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">
            Análise Concluída!
          </h1>
          <p className="text-muted-foreground text-lg">
            Processamos seus dados e encontramos alguns resultados interessantes
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center shadow-card">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8" />
              </div>
              <div className="text-2xl font-bold mb-1">{stats.following.toLocaleString()}</div>
              <p className="text-muted-foreground">Pessoas que você segue</p>
            </CardContent>
          </Card>

          <Card className="text-center shadow-card">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8" />
              </div>
              <div className="text-2xl font-bold mb-1">{stats.followers.toLocaleString()}</div>
              <p className="text-muted-foreground">Seus seguidores</p>
            </CardContent>
          </Card>

          <Card className="text-center shadow-card border-2 border-primary/20">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl font-bold mb-1 text-primary">
                {stats.notFollowingBack.toLocaleString()}
              </div>
              <p className="text-muted-foreground">Não te seguem de volta</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Result */}
        <Card className="mb-8 text-center bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl">
              <span className="text-primary font-bold">{stats.notFollowingBack}</span> pessoas 
              não te seguem de volta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Descobrimos {stats.notFollowingBack} perfis que você segue mas que não seguem você de volta. 
              Quer ver exatamente quem são essas pessoas?
            </p>
            
            <Button 
              onClick={handlePurchase}
              size="lg"
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg px-8 py-6"
            >
              <CreditCard className="mr-2 w-5 h-5" />
              Descubra quem são essas pessoas
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            <p className="text-sm text-muted-foreground mt-4">
              Acesso completo por apenas <span className="font-semibold text-primary">R$ 20,00</span>
            </p>
          </CardContent>
        </Card>

        {/* What you get */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>O que você receberá:</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-success/10 text-success rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  ✓
                </div>
                <div>
                  <p className="font-medium">Lista completa e detalhada</p>
                  <p className="text-sm text-muted-foreground">
                    Todos os {stats.notFollowingBack} perfis que não te seguem de volta
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-success/10 text-success rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  ✓
                </div>
                <div>
                  <p className="font-medium">Links diretos para os perfis</p>
                  <p className="text-sm text-muted-foreground">
                    Acesso rápido para visitar cada perfil no Instagram
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-success/10 text-success rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  ✓
                </div>
                <div>
                  <p className="font-medium">Dados organizados em tabela</p>
                  <p className="text-sm text-muted-foreground">
                    Interface clara e fácil de usar para visualizar os resultados
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Note */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Shield className="w-6 h-6 text-primary mt-1" />
              <div>
                <p className="font-medium mb-2">Seus dados estão seguros</p>
                <p className="text-sm text-muted-foreground">
                  Todo o processamento foi feito localmente no seu dispositivo. Nenhuma informação 
                  pessoal foi enviada para nossos servidores. Após o pagamento, você terá acesso 
                  imediato aos resultados.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}