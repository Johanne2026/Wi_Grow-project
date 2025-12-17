"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Globe, User, Mail, Phone, LogOut, Sun, Moon } from "lucide-react"

interface ProfileScreenProps {
  onBack: () => void
}

export default function ProfileScreen({ onBack }: ProfileScreenProps) {
  const [language, setLanguage] = useState("fr")
  const [profile, setProfile] = useState({
    name: "Johanne Nziko",
    email: "johanne@wigrow.com",
    phone: "+237 6XX XXX XXX",
    farm: "Farm Kouetche - 3 hectares",
  })
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState(profile)
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [alerts, setAlerts] = useState(true)

  // Vérifier le thème système ou le localStorage au chargement
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      setDarkMode(true)
      document.documentElement.classList.add("dark")
    } else if (savedTheme === "light") {
      setDarkMode(false)
      document.documentElement.classList.remove("dark")
    } else {
      // Vérifier la préférence système
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setDarkMode(prefersDark)
      if (prefersDark) {
        document.documentElement.classList.add("dark")
      }
    }
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    
    if (newDarkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  const languages = [
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "es", label: "Español", flag: "🇪🇸" },
  ]

  const handleSaveProfile = () => {
    setProfile(editedProfile)
    setIsEditing(false)
  }

  const handleLogout = () => {
    // Reset to auth screen
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 text-foreground dark:text-gray-100 pb-6">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-primary dark:bg-gray-800 text-primary-foreground dark:text-gray-100 px-6 py-4 flex items-center gap-3">
        <button 
          onClick={onBack} 
          className="p-2 hover:bg-primary/80 dark:hover:bg-gray-700 rounded-lg transition-smooth"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold">Profil & Paramètres</h2>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Profile Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Informations Personnelles</h3>
            <button
              onClick={() => {
                if (isEditing) {
                  handleSaveProfile()
                } else {
                  setEditedProfile(profile)
                  setIsEditing(true)
                }
              }}
              className="text-secondary dark:text-blue-400 font-medium text-sm"
            >
              {isEditing ? "Enregistrer" : "Modifier"}
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-border dark:border-gray-700 rounded-xl p-4 space-y-4">
            {/* Name */}
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-secondary dark:text-blue-400 mt-2 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-sm font-medium text-muted-foreground dark:text-gray-400 mb-1">
                  Nom Complet
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.name}
                    onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                    className="w-full px-3 py-2 border border-border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-foreground dark:text-gray-100"
                  />
                ) : (
                  <p className="font-medium">{profile.name}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-secondary dark:text-blue-400 mt-2 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-sm font-medium text-muted-foreground dark:text-gray-400 mb-1">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                    className="w-full px-3 py-2 border border-border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-foreground dark:text-gray-100"
                  />
                ) : (
                  <p className="font-medium">{profile.email}</p>
                )}
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-secondary dark:text-blue-400 mt-2 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-sm font-medium text-muted-foreground dark:text-gray-400 mb-1">
                  Téléphone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editedProfile.phone}
                    onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-foreground dark:text-gray-100"
                  />
                ) : (
                  <p className="font-medium">{profile.phone}</p>
                )}
              </div>
            </div>

            {/* Farm Info */}
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 flex items-center justify-center text-secondary dark:text-blue-400 mt-2 flex-shrink-0">
                🌾
              </div>
              <div className="flex-1 min-w-0">
                <label className="block text-sm font-medium text-muted-foreground dark:text-gray-400 mb-1">
                  Exploitation
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.farm}
                    onChange={(e) => setEditedProfile({ ...editedProfile, farm: e.target.value })}
                    className="w-full px-3 py-2 border border-border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-foreground dark:text-gray-100"
                  />
                ) : (
                  <p className="font-medium">{profile.farm}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Language Settings */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-secondary dark:text-blue-400" />
            <h3 className="text-lg font-semibold">Langue</h3>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-smooth ${
                  language === lang.code
                    ? "border-secondary dark:border-blue-400 bg-secondary/10 dark:bg-blue-400/10"
                    : "border-border dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-secondary/50 dark:hover:border-blue-400/50"
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span className="font-medium">{lang.label}</span>
                {language === lang.code && (
                  <span className="ml-auto text-secondary dark:text-blue-400">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* App Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Paramètres de l'Application</h3>
          <div className="bg-white dark:bg-gray-800 border border-border dark:border-gray-700 rounded-xl p-4 space-y-3">
            {/* Notifications */}
            <label className="flex items-center justify-between cursor-pointer">
              <span className="font-medium">Notifications</span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-12 h-6 rounded-full transition-all duration-300 ${
                    notifications 
                      ? "bg-secondary dark:bg-blue-400" 
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${
                      notifications ? "left-7" : "left-1"
                    }`}
                  />
                </div>
              </div>
            </label>

            {/* Real-time Alerts */}
            <label className="flex items-center justify-between cursor-pointer">
              <span className="font-medium">Alertes en temps réel</span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={alerts}
                  onChange={(e) => setAlerts(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-12 h-6 rounded-full transition-all duration-300 ${
                    alerts 
                      ? "bg-secondary dark:bg-blue-400" 
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${
                      alerts ? "left-7" : "left-1"
                    }`}
                  />
                </div>
              </div>
            </label>

            {/* Dark Mode */}
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                {darkMode ? (
                  <Moon className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Sun className="w-5 h-5 text-amber-600" />
                )}
                <span className="font-medium">Mode sombre</span>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={toggleDarkMode}
                  className="sr-only"
                />
                <div
                  className={`w-12 h-6 rounded-full transition-all duration-300 ${
                    darkMode 
                      ? "bg-blue-600 dark:bg-blue-500" 
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${
                      darkMode ? "left-7" : "left-1"
                    }`}
                  />
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 dark:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl hover:bg-red-700 dark:hover:bg-red-800 transition-smooth flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Se Déconnecter
        </button>
      </div>
    </div>
  )
}