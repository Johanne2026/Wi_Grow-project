"use client"

import { useEffect, useState } from "react"
import OnboardingScreen from "@/components/onboarding-screen"
import LoginScreen from "@/components/login-screen"
import SignupScreen from "@/components/signup-screen"
import Dashboard from "@/components/dashboard"
import { useAuth } from "@/hook/useAuth"

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth()
  const [currentScreen, setCurrentScreen] = useState<"onboarding" | "login" | "signup" | "dashboard">("onboarding")

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        setCurrentScreen("dashboard")
      } else {
        // Décider quel écran afficher pour les nouveaux utilisateurs
        // Vous pouvez ajouter une logique pour décider entre onboarding et login
        const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding')
        
        if (hasSeenOnboarding === 'true') {
          setCurrentScreen("login")
        } else {
          setCurrentScreen("onboarding")
        }
      }
    }
  }, [isAuthenticated, isLoading])

  const handleOnboardingComplete = () => {
    localStorage.setItem('hasSeenOnboarding', 'true')
    setCurrentScreen("login")
  }

  const handleLoginComplete = () => {
    setCurrentScreen("dashboard")
  }

  const handleSignupComplete = () => {
    setCurrentScreen("dashboard")
  }

  const handleSwitchToSignup = () => {
    setCurrentScreen("signup")
  }

  const handleSwitchToLogin = () => {
    setCurrentScreen("login")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {currentScreen === "onboarding" && (
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      )}
      
      {currentScreen === "login" && (
        <LoginScreen 
          onComplete={handleLoginComplete}
          onSwitchToSignup={handleSwitchToSignup}
        />
      )}
      
      {currentScreen === "signup" && (
        <SignupScreen 
          onComplete={handleSignupComplete}
          onSwitchToLogin={handleSwitchToLogin}
        />
      )}
      
      {currentScreen === "dashboard" && <Dashboard />}
    </main>
  )
}