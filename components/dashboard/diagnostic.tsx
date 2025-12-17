"use client"

import { Camera, CheckCircle, Loader, AlertTriangle } from "lucide-react"
import { useState, useRef } from "react"

export default function DiagnosticScreen() {
  const [stage, setStage] = useState<"initial" | "analyzing" | "result">("initial")
  const [result, setResult] = useState<any>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = () => {
    // Déclencher le clic sur l'input file caché
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        alert("Veuillez sélectionner un fichier image valide")
        return
      }

      // Créer une URL pour l'image sélectionnée
      const imageUrl = URL.createObjectURL(file)
      setSelectedImage(imageUrl)

      // Démarrer l'analyse (simulée)
      handleAnalysis()
    }
  }

  const handleAnalysis = () => {
    setStage("analyzing")
    // Simuler l'analyse
    setTimeout(() => {
      setResult({
        disease: "Oïdium",
        confidence: 87,
        description: "Infection fongique affectant les feuilles",
        treatment: "Appliquer un fongicide approprié ou utiliser un traitement soufré",
        severity: "Modéré",
      })
      setStage("result")
    }, 3000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Diagnostic</h1>
        <button className="p-2 hover:bg-muted rounded-lg transition-smooth">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="2" />
            <circle cx="19" cy="12" r="2" />
            <circle cx="5" cy="12" r="2" />
          </svg>
        </button>
      </div>

      {stage === "initial" && (
        <>
          {/* Instructions */}
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-foreground font-semibold mb-4">
              Veuillez charger une image pour le diagnostic de vos plantes
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                  <Camera className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Chargez une photo</p>
                  <p className="text-sm text-muted-foreground">D'une plante bien éclairée</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary/10">
                  <CheckCircle className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="font-semibold">Attendez le traitement</p>
                  <p className="text-sm text-muted-foreground">L'analyse est prête</p>
                </div>
              </div>
            </div>
          </div>

          {/* Aperçu de l'image sélectionnée */}
          {selectedImage && (
            <div className="border-2 border-border rounded-lg p-4">
              <p className="font-semibold mb-2">Image sélectionnée :</p>
              <div className="relative w-full h-48 rounded-lg overflow-hidden">
                <img 
                  src={selectedImage} 
                  alt="Image à analyser" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleAnalysis}
                  className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:bg-primary/90 transition-smooth"
                >
                  Analyser cette image
                </button>
                <button
                  onClick={handleFileSelect}
                  className="flex-1 bg-muted text-foreground py-2 rounded-lg font-semibold hover:bg-muted/80 transition-smooth"
                >
                  Changer d'image
                </button>
              </div>
            </div>
          )}

          {/* Alert Box */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-900">
              <span className="font-semibold">Note :</span> Les résultats d'identification sont basés sur l'analyse
              d'image. Consultez un expert agronome pour une confirmation.
            </p>
          </div>

          {/* Input file caché */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {/* Bouton principal */}
          <button
            onClick={handleFileSelect}
            className="w-full bg-primary text-primary-foreground py-4 rounded-full font-semibold hover:bg-primary/90 transition-smooth flex items-center justify-center gap-2"
          >
            <Camera className="w-5 h-5" />
            {selectedImage ? "Sélectionner une autre photo" : "Charger une photo"}
          </button>
        </>
      )}

      {stage === "analyzing" && (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          {selectedImage && (
            <div className="mb-4">
              <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-border">
                <img 
                  src={selectedImage} 
                  alt="Image en cours d'analyse" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse" />
            <div className="absolute inset-2 bg-primary/40 rounded-full animate-pulse animation-delay-100" />
            <Loader className="absolute inset-0 w-full h-full text-primary animate-spin" />
          </div>
          <p className="text-lg font-semibold">Analyse en cours...</p>
          <p className="text-muted-foreground text-sm">Cela peut prendre quelques secondes</p>
        </div>
      )}

      {stage === "result" && result && (
        <div className="space-y-4">
          {/* Aperçu de l'image analysée */}
          {selectedImage && (
            <div className="border-2 border-border rounded-lg p-4">
              <p className="font-semibold mb-2">Image analysée :</p>
              <div className="relative w-full h-40 rounded-lg overflow-hidden">
                <img 
                  src={selectedImage} 
                  alt="Image analysée" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}

          {/* Disease Card */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Maladie détectée</p>
                <h2 className="text-2xl font-bold text-red-700">{result.disease}</h2>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Confiance</p>
                <p className="text-2xl font-bold text-primary">{result.confidence}%</p>
              </div>
            </div>
            <div className="w-full bg-red-200 rounded-full h-2">
              <div className="bg-red-600 h-2 rounded-full" style={{ width: `${result.confidence}%` }} />
            </div>
          </div>

          {/* Details */}
          <div className="bg-card border border-border rounded-lg p-4 space-y-3">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Description</p>
              <p className="text-foreground mt-1">{result.description}</p>
            </div>
            <div className="pt-3 border-t border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Traitement Recommandé
              </p>
              <p className="text-foreground mt-1">{result.treatment}</p>
            </div>
            <div className="pt-3 border-t border-border flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Sévérité: {result.severity}</p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => {
                setStage("initial")
                setResult(null)
                setSelectedImage(null)
                // Réinitialiser l'input file
                if (fileInputRef.current) {
                  fileInputRef.current.value = ''
                }
              }}
              className="flex-1 bg-muted text-foreground py-3 rounded-lg font-semibold hover:bg-muted/80 transition-smooth"
            >
              Nouvelle analyse
            </button>
            <button className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-smooth">
              Enregistrer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}