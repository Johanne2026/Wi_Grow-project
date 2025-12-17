"use client"

import type React from "react"
import SignupScreen from "@/components/signup-screen"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface LoginScreenProps {
  onComplete: () => void
  onSwitchToSignup: () => void // Prop ajoutée
}

export default function LoginScreen({ onComplete, onSwitchToSignup }: LoginScreenProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password) {
      onComplete()
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
            className="object-contain rounded-2xl "
          />
        </div>
        <h1 className="text-3xl font-bold text-primary mb-2">WI GROW</h1>
        <p className="text-muted-foreground italic">Gérez votre plantation en quelques clics !</p>
      </div>

      {/* Form */}
      <div className="w-full max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-3 border-2 border-border rounded-full focus:outline-none focus:border-primary bg-white text-foreground placeholder:text-muted-foreground transition-smooth"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-3 border-2 border-border rounded-full focus:outline-none focus:border-primary bg-white text-foreground placeholder:text-muted-foreground transition-smooth"
              required
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-full mt-6 flex items-center justify-center gap-2"
          >
            Se connecter
            <ArrowRight className="w-5 h-5" />
          </Button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            Vous n'avez pas de compte ?{" "}
            <button 
              onClick={onSwitchToSignup} // Modifié ici
              className="text-primary font-semibold hover:underline"
            >
              S'inscrire
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}