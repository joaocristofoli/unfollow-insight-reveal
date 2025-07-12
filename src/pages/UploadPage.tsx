import { useState, useRef } from 'react'
import { Upload, FileIcon, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Layout from '@/components/Layout'
import { useNavigate } from 'react-router-dom'

export default function UploadPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = (selectedFile: File) => {
    setError(null)
    
    // Validate file type
    if (!selectedFile.name.endsWith('.zip')) {
      setError('Por favor, selecione um arquivo .zip')
      return
    }

    // Validate file size (max 100MB)
    if (selectedFile.size > 100 * 1024 * 1024) {
      setError('LARGE_FILE')
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

    try {
      // Create form data with file
      const formData = new FormData()
      formData.append('file', file)
      formData.append('fileName', file.name)

      // Call edge function to process file
      const response = await fetch('https://grtkmwuupfhmhurhqzcf.supabase.co/functions/v1/process-instagram', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Falha no processamento do arquivo')
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Erro no processamento')
      }

      // Store analysis results
      sessionStorage.setItem('analysisId', result.analysisId)
      sessionStorage.setItem('analysisResults', JSON.stringify(result.results))
      
      // Navigate to preview page
      navigate('/preview')
    } catch (err) {
      console.error('Erro:', err)
      setError(err.message || 'Erro ao processar o arquivo. Tente novamente.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">
            Envie o arquivo .zip que recebeu do Instagram
          </h1>
          <p className="text-muted-foreground text-lg">
            Faça upload do arquivo para começar a análise dos seus seguidores
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
        {error && error !== 'LARGE_FILE' && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Large File Alert */}
        {error === 'LARGE_FILE' && (
          <Card className="mb-6 border-accent bg-accent/5">
            <CardContent className="p-6 text-center">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-accent">
                  Ops, parece que você tem muitos seguidores, parabéns!! 🎉
                </h3>
                <p className="text-muted-foreground">
                  Para contas grandes e famosas como a sua nós precisamos de um processamento maior do que as contas normais.
                </p>
                <Button 
                  onClick={() => window.open('https://wa.me/5511973964702?text=Oii%2C%20preciso%20do%20processamento%20extra%20para%20analisar%20meus%20seguidores%20e%20as%20pessoas%20que%20eu%20n%C3%A3o%20estou%20seguindo', '_blank')}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3"
                >
                  Fale conosco para um atendimento especial
                </Button>
              </div>
            </CardContent>
          </Card>
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
                'Analisar arquivo'
              )}
            </Button>
          </div>
        )}

        {/* Requirements */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Requisitos do arquivo</CardTitle>
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
                <span>Tamanho máximo: 100MB</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}