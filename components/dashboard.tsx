"use client"

import { useState } from "react"
import { BarChart3, Camera, Leaf, MessageSquare, ShoppingBag } from "lucide-react"
import DashboardHome from "@/components/dashboard/home"
import DiagnosticScreen from "@/components/dashboard/diagnostic"
import PlantesScreen from "@/components/dashboard/plantes"
import ChatbotScreen from "@/components/dashboard/chatbot"
import FieldsScreen from "@/components/dashboard/fields"
import ProfileScreen from "@/components/dashboard/profile"

export default function Dashboard() {
  const [currentTab, setCurrentTab] = useState<"home" | "diagnostic" | "plantes" | "chat" | "fields" | "profile">(
    "home",
  )

  const renderContent = () => {
    switch (currentTab) {
      case "home":
        return <DashboardHome />
      case "diagnostic":
        return <DiagnosticScreen />
      case "plantes":
        return <PlantesScreen />
      case "chat":
        return <ChatbotScreen />
      case "fields":
        return <FieldsScreen />
      case "profile":
        return <ProfileScreen onBack={() => setCurrentTab("home")} />
      default:
        return <DashboardHome />
    }
  }

  const tabItems = [
    { id: "home", icon: BarChart3, label: "Accueil" },
    { id: "diagnostic", icon: Camera, label: "Diagnostic" },
    { id: "plantes", icon: Leaf, label: "plantes" },
    { id: "chat", icon: MessageSquare, label: "ChatBOT" },
    { id: "fields", icon: ShoppingBag, label: "Parcelles" },
  ]

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">WI_GROW</h2>
        <button
          onClick={() => setCurrentTab("profile")}
          className="p-2 hover:bg-primary/80 rounded-lg transition-smooth flex items-center justify-center w-10 h-10"
          aria-label="Profil et paramètres"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="8" r="4" />
            <path d="M12 14c-6 0-8 3-8 5v3h16v-3c0-2-2-5-8-5z" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="px-6 py-6">{renderContent()}</div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-primary text-primary-foreground border-t border-primary/20">
        <div className="max-w-4xl mx-auto px-2 py-3 flex justify-around items-center">
          {tabItems.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setCurrentTab(id as any)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-smooth ${
                currentTab === id
                  ? "bg-secondary text-secondary-foreground"
                  : "text-primary-foreground/70 hover:text-primary-foreground"
              }`}
              aria-label={label}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
