import { useState, useRef } from 'react'
import { Upload, FileIcon, AlertCircle, CheckCircle, Loader2, TestTube } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Layout from '@/components/Layout'
import { useNavigate } from 'react-router-dom'

export default function TestUploadPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errorDetails, setErrorDetails] = useState<any>(null)

  const handleFileSelect = (selectedFile: File) => {
    setError(null)
    setErrorDetails(null)
    
    // Validate file type
    if (!selectedFile.name.endsWith('.zip')) {
      setError('Por favor, selecione um arquivo .zip')
      return
    }

    // Validate file size (max 150MB for test area)
    if (selectedFile.size > 150 * 1024 * 1024) {
      setError('O arquivo é muito grande. Máximo 150MB na área de teste.')
      return
    }

    setFile(selectedFile)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileSelect(droppedFile)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFileSelect(selectedFile)
    }
  }

  const processFile = async () => {
    if (!file) return

    setIsProcessing(true)
    setError(null)
    setErrorDetails(null)

    try {
      // Create form data with file
      const formData = new FormData()
      formData.append('file', file)
      formData.append('fileName', file.name)

      // Call edge function to process file
      const response = await fetch('https://grtkmwuupfhmhurhqzcf.supabase.co/functions/v1/process-instagram', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdydGttd3V1cGZobWh1cmhxemNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNDIwMjcsImV4cCI6MjA2NzkxODAyN30.EdCwuD4iYwIi-Ao6RLYy7mUkRqCbF8wRbwqT641T6-M`,
        },
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Response não OK:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        })
        setErrorDetails({
          status: response.status,
          statusText: response.statusText,
          body: errorText,
          timestamp: new Date().toISOString()
        })
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const result = await response.json()
      console.log('Resultado da API:', result)
      
      if (!result.success) {
        console.error('Resultado com erro:', result)
        setErrorDetails({
          apiError: result,
          timestamp: new Date().toISOString()
        })
        throw new Error(result.error || 'Erro no processamento')
      }

      // Store analysis results and test mode flag
      sessionStorage.setItem('analysisId', result.analysisId)
      sessionStorage.setItem('analysisResults', JSON.stringify(result.results))
      sessionStorage.setItem('isTestMode', 'true')
      
      // Navigate to test results page directly (skip payment)
      navigate('/test-results')
    } catch (err) {
      console.error('Erro completo:', err)
      setErrorDetails(prev => ({
        ...prev,
        catchError: {
          message: err.message,
          stack: err.stack,
          name: err.name
        },
        timestamp: new Date().toISOString()
      }))
      setError(err.message || 'Erro ao processar o arquivo. Tente novamente.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Test Mode Header */}
        <div className="bg-accent/10 border border-accent rounded-lg p-4 mb-8">
          <div className="flex items-center justify-center space-x-2 text-accent">
            <TestTube className="w-5 h-5" />
            <span className="font-semibold">ÁREA DE TESTE</span>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-2">
            Esta é uma área especial para testes. Limite de 150MB e sem cobrança.
          </p>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">
            Teste - Envie o arquivo .zip que recebeu do Instagram
          </h1>
          <p className="text-muted-foreground text-lg">
            Faça upload do arquivo para testar a análise dos seus seguidores
          </p>
        </div>

        {/* Upload Area */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                isDragging 
                  ? 'border-primary bg-primary/5' 
                  : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {file ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-3">
                    <FileIcon className="w-8 h-8 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <CheckCircle className="w-6 h-6 text-success" />
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setFile(null)}
                    disabled={isProcessing}
                  >
                    Escolher outro arquivo
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                  <div>
                    <p className="text-lg font-medium mb-2">
                      Arraste seu arquivo .zip aqui
                    </p>
                    <p className="text-muted-foreground mb-4">
                      ou clique no botão abaixo para selecionar
                    </p>
                    <Button 
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                    >
                      Selecionar arquivo
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".zip"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <div className="space-y-4 mb-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            
            {errorDetails && (
              <Card className="bg-destructive/5 border-destructive/20">
                <CardHeader>
                  <CardTitle className="text-sm text-destructive">Detalhes do Erro (para debugging)</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs overflow-auto bg-muted p-4 rounded text-muted-foreground whitespace-pre-wrap">
                    {JSON.stringify(errorDetails, null, 2)}
                  </pre>
                  <p className="text-xs text-muted-foreground mt-2">
                    Copie e cole este log completo para o desenvolvedor.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Process Button */}
        {file && (
          <div className="text-center mb-8">
            <Button 
              onClick={processFile}
              disabled={isProcessing}
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 px-8 py-6 text-lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                  Processando arquivo...
                </>
              ) : (
                'Analisar arquivo (TESTE)'
              )}
            </Button>
          </div>
        )}

        {/* Requirements */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Requisitos do arquivo (Teste)</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>Arquivo no formato .zip baixado do Instagram</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>Formato JSON selecionado na solicitação</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>Deve conter as informações de "Seguidores e seguindo"</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>Tamanho máximo: 150MB (área de teste)</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}