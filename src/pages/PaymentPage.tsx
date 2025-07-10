import { useState, useEffect } from 'react'
import { CreditCard, Shield, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Layout from '@/components/Layout'
import { useNavigate } from 'react-router-dom'

export default function PaymentPage() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ notFollowingBack: 0 })
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card' | null>(null)

  useEffect(() => {
    const statsData = sessionStorage.getItem('analysisStats')
    if (!statsData) {
      navigate('/upload')
      return
    }
    setStats(JSON.parse(statsData))
  }, [navigate])

  const handlePayment = async () => {
    setIsProcessing(true)
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Mark as paid and redirect to results
    sessionStorage.setItem('paymentCompleted', 'true')
    navigate('/results')
  }

  const price = 20.00
  const features = [
    'Lista completa de quem não te segue',
    'Links diretos para os perfis',
    'Interface organizada e fácil de usar',
    'Acesso imediato após o pagamento',
    'Seus dados permanecem privados'
  ]

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/preview')}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Finalizar Compra</h1>
            <p className="text-muted-foreground">
              Descubra quem são as {stats.notFollowingBack} pessoas que não te seguem
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>Análise de Seguidores Instagram</span>
                    <span className="font-medium">R$ {price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">R$ {price.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What's Included */}
            <Card>
              <CardHeader>
                <CardTitle>O que está incluído:</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Payment Options */}
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Método de Pagamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* PIX Option */}
                  <div 
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      paymentMethod === 'pix' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-muted hover:border-primary/50'
                    }`}
                    onClick={() => setPaymentMethod('pix')}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center">
                        {paymentMethod === 'pix' && (
                          <div className="w-3 h-3 bg-primary rounded-full" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">PIX</p>
                        <p className="text-sm text-muted-foreground">
                          Pagamento instantâneo
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Option */}
                  <div 
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      paymentMethod === 'card' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-muted hover:border-primary/50'
                    }`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center">
                        {paymentMethod === 'card' && (
                          <div className="w-3 h-3 bg-primary rounded-full" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">Cartão de Crédito</p>
                        <p className="text-sm text-muted-foreground">
                          Visa, Mastercard, Elo
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Button */}
            <Button
              onClick={handlePayment}
              disabled={!paymentMethod || isProcessing}
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg py-6"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                  Processando pagamento...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 w-5 h-5" />
                  Pagar R$ {price.toFixed(2)}
                </>
              )}
            </Button>

            {/* Security Notice */}
            <Alert className="mt-6">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Pagamento 100% seguro.</strong> Utilizamos criptografia SSL e não 
                armazenamos dados do cartão. Seus dados pessoais permanecem privados.
              </AlertDescription>
            </Alert>

            {/* Guarantee */}
            <Card className="mt-6 bg-success/5 border-success/20">
              <CardContent className="pt-6">
                <div className="text-center">
                  <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
                  <p className="font-medium text-success mb-1">Garantia de Satisfação</p>
                  <p className="text-sm text-muted-foreground">
                    Se não ficar satisfeito com os resultados, devolvemos seu dinheiro 
                    em até 7 dias.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}