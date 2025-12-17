"use client"

import type React from "react"
import SignupScreen from "@/components/signup-screen"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface LoginScreenProps {
  onComplete: () => void
  onSwitchToSignup: () => void
}

export default function LoginScreen({ onComplete, onSwitchToSignup }: LoginScreenProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      setError("Veuillez remplir tous les champs")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:3010/v1/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          motDePasse: password
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `Erreur ${response.status}: Échec de la connexion`)
      }

      console.log("Connexion réussie:", data)

      // Stocker les données utilisateur et token
      if (data.token && data.user) {
        // Stocker le token JWT
        localStorage.setItem('authToken', data.token)
        
        // Stocker les informations utilisateur
        localStorage.setItem('userId', data.user.id.toString())
        localStorage.setItem('userData', JSON.stringify({
          nom: data.user.nom,
          prenom: data.user.prenom,
          email: data.user.email,
          telephone: data.user.telephone,
          typeUtilisateur: data.user.typeUtilisateur,
          sexe: data.user.sexe,
          localisation: data.user.localisation,
          actif: data.user.actif
        }))
        
        // Stocker les informations séparément pour un accès facile
        localStorage.setItem('userNom', data.user.nom)
        localStorage.setItem('userPrenom', data.user.prenom)
        localStorage.setItem('userEmail', data.user.email)
        localStorage.setItem('userPhone', data.user.phone)
      }

      // Appeler le callback pour indiquer que la connexion est réussie
      onComplete()

    } catch (error) {
      console.error('Erreur lors de la connexion:', error)
      setError(error instanceof Error ? error.message : 'Une erreur est survenue lors de la connexion')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Fonction utilitaire pour récupérer les données utilisateur depuis localStorage
  const getUserData = () => {
    const userData = localStorage.getItem('userData')
    return userData ? JSON.parse(userData) : null
  }

  // Fonction utilitaire pour récupérer le token
  const getAuthToken = () => {
    return localStorage.getItem('authToken')
  }

  // Fonction utilitaire pour les headers authentifiés
  const getAuthHeaders = () => {
    const token = getAuthToken()
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    }
  }

  if (isSignUp) {
    return (
      <SignupScreen 
        onComplete={onComplete}
        onSwitchToLogin={() => setIsSignUp(false)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12">
      {/* Logo */}
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
        <p className="text-muted-foreground italic">Gérez votre plantation en quelques clics !</p>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="w-full max-w-sm mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm text-center">{error}</p>
        </div>
      )}

      {/* Form */}
      <div className="w-full max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError(null) // Effacer l'erreur quand l'utilisateur tape
              }}
              className="w-full px-6 py-3 border-2 border-border rounded-full focus:outline-none focus:border-primary bg-white text-foreground placeholder:text-muted-foreground transition-smooth"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Password Input */}
          <div>
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError(null) // Effacer l'erreur quand l'utilisateur tape
              }}
              className="w-full px-6 py-3 border-2 border-border rounded-full focus:outline-none focus:border-primary bg-white text-foreground placeholder:text-muted-foreground transition-smooth"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-full mt-6 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                Connexion...
              </>
            ) : (
              <>
                Se connecter
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </Button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            Vous n'avez pas de compte ?{" "}
            <button 
              onClick={onSwitchToSignup}
              className="text-primary font-semibold hover:underline"
              disabled={isSubmitting}
            >
              S'inscrire
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}