import { useState, useEffect } from 'react'
import { ExternalLink, Download, RotateCcw, AlertTriangle, Copy, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import Layout from '@/components/Layout'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'

export default function ResultsPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [stats, setStats] = useState({ 
    notFollowingBack: 0, 
    totalFollowing: 0, 
    totalFollowers: 0 
  })
  const [copied, setCopied] = useState(false)
  const [notFollowingBackList, setNotFollowingBackList] = useState<Array<{username: string, url: string}>>([])

  useEffect(() => {
    // Check payment status
    const paymentCompleted = sessionStorage.getItem('paymentCompleted')
    if (!paymentCompleted) {
      navigate('/payment')
      return
    }

    // Load analysis results from session storage
    const resultsData = sessionStorage.getItem('analysisResults')
    if (resultsData) {
      const results = JSON.parse(resultsData)
      setStats({
        notFollowingBack: results.not_following_back,
        totalFollowing: results.total_following,
        totalFollowers: results.total_followers
      })
      setNotFollowingBackList(results.not_following_back_list || [])
    }
  }, [navigate])

  const copyAllUsernames = () => {
    const usernames = notFollowingBackList.map(user => '@' + user.username).join('\n')
    navigator.clipboard.writeText(usernames)
    setCopied(true)
    toast({
      title: "Usernames copiados!",
      description: "A lista foi copiada para sua área de transferência.",
    })
    
    setTimeout(() => setCopied(false), 2000)
  }

  const exportToCsv = () => {
    const csvContent = [
      'Username,Link',
      ...notFollowingBackList.map(user => `${user.username},${user.url}`)
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'instagram-nao-seguem-volta.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    
    toast({
      title: "Arquivo exportado!",
      description: "A lista foi baixada em formato CSV.",
    })
  }

  const handleNewAnalysis = () => {
    // Clear session data
    sessionStorage.clear()
    navigate('/')
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">
            Seus Resultados Estão Prontos!
          </h1>
          <p className="text-muted-foreground text-lg">
            Aqui estão as {stats.notFollowingBack} pessoas que não te seguem de volta
          </p>
        </div>

        {/* Summary Card */}
        <Card className="mb-8 bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-center">
              <span className="text-3xl font-bold text-primary">
                {notFollowingBackList.length}
              </span>
              <span className="text-lg ml-2">pessoas não te seguem de volta</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={copyAllUsernames} variant="outline">
                {copied ? (
                  <>
                    <CheckCircle className="mr-2 w-4 h-4 text-success" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 w-4 h-4" />
                    Copiar usernames
                  </>
                )}
              </Button>
              <Button onClick={exportToCsv} variant="outline">
                <Download className="mr-2 w-4 h-4" />
                Exportar CSV
              </Button>
              <Button onClick={handleNewAnalysis} variant="outline">
                <RotateCcw className="mr-2 w-4 h-4" />
                Nova análise
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Lista Completa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notFollowingBackList.map((user, index) => (
                    <TableRow key={user.username}>
                      <TableCell className="font-medium text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white text-xs">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium">@{user.username}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(user.url, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Ver perfil
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Important Disclaimer */}
        <Alert className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Aviso importante:</strong> Este site apenas mostra a lista de pessoas que não te seguem de volta. 
            O cancelamento do follow (deixar de seguir) deve ser feito manualmente através do próprio Instagram.
          </AlertDescription>
        </Alert>

        {/* Instructions */}
        <Card className="mb-8 bg-muted/50">
          <CardHeader>
            <CardTitle>Como usar estes resultados:</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Clique em "Ver perfil" para acessar o perfil da pessoa no Instagram</li>
              <li>No perfil, clique no botão "Seguindo" para deixar de seguir</li>
              <li>Confirme a ação quando o Instagram solicitar</li>
              <li>Repita o processo para cada pessoa da lista, se desejar</li>
            </ol>
            <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <p className="text-sm text-warning-foreground">
                <strong>Dica:</strong> Não deixe de seguir muitas pessoas de uma só vez para evitar 
                limitações temporárias do Instagram. Faça gradualmente ao longo de alguns dias.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <Card className="bg-card/50 backdrop-blur">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              <strong>Privacidade garantida:</strong> Todos os dados foram processados localmente no seu dispositivo. 
              Nenhuma informação pessoal foi enviada para nossos servidores. Este site não possui vínculo com o Instagram™️.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}