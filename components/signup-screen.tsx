"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, User, Mail, Phone, MapPin, Lock } from "lucide-react"

interface SignupScreenProps {
  onComplete: () => void
  onSwitchToLogin: () => void
}

export default function SignupScreen({ onComplete, onSwitchToLogin }: SignupScreenProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    farmName: "",
    password: "",
    confirmPassword: "",
    farmSize: "", // Élément ajouté
  })

  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Le nom complet est requis"
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email invalide"
    }
    
    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis"
    } else if (formData.password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères"
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.farmName.trim()) {
      newErrors.farmName = "Le nom de l'exploitation est requis"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2)
      setErrors({})
    }
  }

  const handlePreviousStep = () => {
    setStep(1)
    setErrors({})
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateStep2()) {
      onComplete()
    }
  }

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12">
      <div className="mb-8 text-center">
        <div className="mb-4 rounded-3 flex justify-center">
          <img
            src="/logo_wi.png" 
            alt="WI GROW Logo"
            width={80} 
            height={80} 
            className="object-contain rounded-2xl"
          />
        </div>
        <h1 className="text-3xl font-bold text-primary mb-2">WI GROW</h1>
        <p className="text-muted-foreground italic">Créez votre compte agricole</p>
      </div>

      <div className="w-full max-w-md mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className={`flex items-center ${step >= 1 ? "text-primary" : "text-gray-400"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
              step >= 1 ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
            }`}>
              1
            </div>
            <span className="font-medium">Compte</span>
          </div>
          <div className="flex-1 h-1 mx-4 bg-gray-200">
            <div className={`h-full transition-all duration-300 ${
              step >= 2 ? "bg-primary" : "bg-gray-200"
            }`}></div>
          </div>
          <div className={`flex items-center ${step >= 2 ? "text-primary" : "text-gray-400"}`}>
            <span className="font-medium mr-2">Exploitation</span>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 2 ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
            }`}>
              2
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit}>
          {step === 1 ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Informations personnelles</h2>
              
              <div>
                <div className="relative">
                  <div className="absolute left-4 top-3.5">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Nom complet *"
                    value={formData.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    className={`w-full pl-12 pr-6 py-3 border-2 rounded-full focus:outline-none transition-smooth ${
                      errors.fullName 
                        ? "border-red-500 focus:border-red-500" 
                        : "border-border focus:border-primary"
                    } bg-white text-foreground placeholder:text-muted-foreground`}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1 ml-4">{errors.fullName}</p>
                )}
              </div>

              <div>
                <div className="relative">
                  <div className="absolute left-4 top-3.5">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    placeholder="Email *"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className={`w-full pl-12 pr-6 py-3 border-2 rounded-full focus:outline-none transition-smooth ${
                      errors.email 
                        ? "border-red-500 focus:border-red-500" 
                        : "border-border focus:border-primary"
                    } bg-white text-foreground placeholder:text-muted-foreground`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 ml-4">{errors.email}</p>
                )}
              </div>

              <div>
                <div className="relative">
                  <div className="absolute left-4 top-3.5">
                    <Phone className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    placeholder="Numéro de téléphone"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="w-full pl-12 pr-6 py-3 border-2 border-border rounded-full focus:outline-none focus:border-primary bg-white text-foreground placeholder:text-muted-foreground transition-smooth"
                  />
                </div>
              </div>

              <div>
                <div className="relative">
                  <div className="absolute left-4 top-3.5">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    placeholder="Mot de passe *"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    className={`w-full pl-12 pr-6 py-3 border-2 rounded-full focus:outline-none transition-smooth ${
                      errors.password 
                        ? "border-red-500 focus:border-red-500" 
                        : "border-border focus:border-primary"
                    } bg-white text-foreground placeholder:text-muted-foreground`}
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1 ml-4">{errors.password}</p>
                )}
              </div>

              <div>
                <div className="relative">
                  <div className="absolute left-4 top-3.5">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    placeholder="Confirmer le mot de passe *"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    className={`w-full pl-12 pr-6 py-3 border-2 rounded-full focus:outline-none transition-smooth ${
                      errors.confirmPassword 
                        ? "border-red-500 focus:border-red-500" 
                        : "border-border focus:border-primary"
                    } bg-white text-foreground placeholder:text-muted-foreground`}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1 ml-4">{errors.confirmPassword}</p>
                )}
              </div>

              <Button
                type="button"
                onClick={handleNextStep}
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-full mt-6 flex items-center justify-center gap-2"
              >
                Suivant
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Votre exploitation</h2>
              
              <div>
                <div className="relative">
                  <div className="absolute left-4 top-3.5">
                    <MapPin className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Nom de l'exploitation *"
                    value={formData.farmName}
                    onChange={(e) => handleChange("farmName", e.target.value)}
                    className={`w-full pl-12 pr-6 py-3 border-2 rounded-full focus:outline-none transition-smooth ${
                      errors.farmName 
                        ? "border-red-500 focus:border-red-500" 
                        : "border-border focus:border-primary"
                    } bg-white text-foreground placeholder:text-muted-foreground`}
                  />
                </div>
                {errors.farmName && (
                  <p className="text-red-500 text-sm mt-1 ml-4">{errors.farmName}</p>
                )}
              </div>

              {/* Élément pour la taille de l'exploitation - AJOUTÉ */}
              <div>
                <input
                  type="text"
                  placeholder="Superficie (hectares)"
                  value={formData.farmSize}
                  onChange={(e) => handleChange("farmSize", e.target.value)}
                  className="w-full px-6 py-3 border-2 border-border rounded-full focus:outline-none focus:border-primary bg-white text-foreground placeholder:text-muted-foreground transition-smooth"
                />
              </div>

              <div className="flex gap-3 mt-8">
                <Button
                  type="button"
                  onClick={handlePreviousStep}
                  variant="outline"
                  className="flex-1 py-3 rounded-full border-2"
                >
                  Retour
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-full flex items-center justify-center gap-2"
                >
                  Créer mon compte
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}
        </form>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground">
            Déjà un compte ?{" "}
            <button 
              onClick={onSwitchToLogin} 
              className="text-primary font-semibold hover:underline"
            >
              Se connecter
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}