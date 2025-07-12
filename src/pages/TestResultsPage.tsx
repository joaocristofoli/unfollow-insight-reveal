import { useState, useEffect } from 'react'
import { Download, TestTube, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Layout from '@/components/Layout'
import { useNavigate } from 'react-router-dom'

// Mock data for demonstration
const mockUnfollowers = [
  { username: 'user1_example', link: 'https://instagram.com/user1_example' },
  { username: 'user2_example', link: 'https://instagram.com/user2_example' },
  { username: 'user3_example', link: 'https://instagram.com/user3_example' },
  { username: 'user4_example', link: 'https://instagram.com/user4_example' },
  { username: 'user5_example', link: 'https://instagram.com/user5_example' },
]

export default function TestResultsPage() {
  const navigate = useNavigate()
  const [fileName, setFileName] = useState('')
  const [fileSize, setFileSize] = useState('')

  useEffect(() => {
    const uploadedFile = sessionStorage.getItem('uploadedFile')
    const uploadedFileSize = sessionStorage.getItem('fileSize')
    const isTestMode = sessionStorage.getItem('isTestMode')
    
    if (!uploadedFile || !isTestMode) {
      navigate('/test-upload')
      return
    }
    
    setFileName(uploadedFile)
    setFileSize(uploadedFileSize || '0')
  }, [navigate])

  const exportResults = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Username,Link\n"
      + mockUnfollowers.map(user => `${user.username},${user.link}`).join("\n")
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "nao_seguem_de_volta.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const startNewAnalysis = () => {
    sessionStorage.clear()
    navigate('/test-upload')
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Test Mode Header */}
        <div className="bg-accent/10 border border-accent rounded-lg p-4 mb-8">
          <div className="flex items-center justify-center space-x-2 text-accent">
            <TestTube className="w-5 h-5" />
            <span className="font-semibold">ÁREA DE TESTE - RESULTADOS</span>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-2">
            Estes são dados de exemplo para demonstração
          </p>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">
            Resultado da Análise (TESTE)
          </h1>
          <p className="text-muted-foreground text-lg">
            Arquivo analisado: {fileName}
          </p>
        </div>

        {/* Summary Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center">
              Você segue {mockUnfollowers.length} pessoas que não te seguem de volta
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Aqui estão as pessoas que você segue mas que não seguem você de volta:
            </p>
            <div className="flex justify-center space-x-4">
              <Button onClick={exportResults} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exportar lista
              </Button>
              <Button onClick={startNewAnalysis}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Nova análise
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Lista de usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Link</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockUnfollowers.map((user, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">@{user.username}</TableCell>
                    <TableCell>
                      <a 
                        href={user.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Ver perfil
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Disclaimers */}
        <Card className="bg-muted/50">
          <CardContent className="p-6 space-y-4">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                <strong>Aviso:</strong> Este site apenas mostra a lista. O cancelamento do follow deve ser feito manualmente.
              </p>
              <p>
                <strong>Importante:</strong> Este site não possui vínculo com o Instagram™️.
              </p>
              <p className="text-accent font-semibold">
                <strong>TESTE:</strong> Os dados mostrados acima são apenas para demonstração.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}