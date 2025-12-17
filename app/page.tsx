"use client"

import { useState } from "react"
import OnboardingScreen from "@/components/onboarding-screen"
import LoginScreen from "@/components/login-screen"
import SignupScreen from "@/components/signup-screen" // Import ajouté
import Dashboard from "@/components/dashboard"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<"onboarding" | "login" | "signup" | "dashboard">("onboarding")

  const handleOnboardingComplete = () => {
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

  return (
    <main className="min-h-screen bg-background">
      {currentScreen === "onboarding" && (
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      )}
      
      {currentScreen === "login" && (
        <LoginScreen 
          onComplete={handleLoginComplete}
          onSwitchToSignup={handleSwitchToSignup} // Prop ajoutée
        />
      )}
      
      {currentScreen === "signup" && (
        <SignupScreen 
          onComplete={handleSignupComplete}
          onSwitchToLogin={handleSwitchToLogin} // Prop ajoutée
        />
      )}
      
      {currentScreen === "dashboard" && <Dashboard />}
    </main>
  )
}