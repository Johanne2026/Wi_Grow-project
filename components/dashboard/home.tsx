"use client"

import { AlertCircle, Cloud, Droplets, Wind, Zap, Camera } from "lucide-react"

export default function DashboardHome() {
  const userPrenom = localStorage.getItem('userPrenom')
  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Bonjour {userPrenom} !</h1>
        <p className="text-muted-foreground">Lundi 24 novembre 2025</p>
      </div>

      {/* Weather Card */}
      <div className="bg-linear-to-br from-primary to-primary/80 text-primary-foreground rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Cloud className="w-5 h-5" />
          Météo
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
            <div className="text-3xl font-bold mb-1">20°C</div>
            <div className="text-sm text-primary-foreground/80">Température</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
            <div className="text-3xl font-bold mb-1">75%</div>
            <div className="text-sm text-primary-foreground/80 flex items-center justify-center gap-1">
              <Droplets className="w-4 h-4" />
              Humidité
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
            <div className="text-3xl font-bold mb-1">8</div>
            <div className="text-sm text-primary-foreground/80 flex items-center justify-center gap-1">
              <Wind className="w-4 h-4" />
              Vent
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
            <div className="text-3xl font-bold mb-1">8</div>
            <div className="text-sm text-primary-foreground/80 flex items-center justify-center gap-1">
              <Wind className="w-4 h-4" />
              Vent
            </div>
          </div>
        </div>
      </div>

      {/* NPK Status */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">État Nutritif du Sol</h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-xl font-bold text-primary mb-1">20%</div>
            <div className="text-xs font-semibold text-foreground">N (Azote)</div>
            <div className="text-xs text-muted-foreground mt-1">Bon</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-xl font-bold text-secondary mb-1">15%</div>
            <div className="text-xs font-semibold text-foreground">P (Phosphore)</div>
            <div className="text-xs text-muted-foreground mt-1">À surveiller</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-xl font-bold text-secondary mb-1">15%</div>
            <div className="text-xs font-semibold text-foreground">K (Potassium)</div>
            <div className="text-xs text-muted-foreground mt-1">À surveiller</div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Alertes</h2>
        <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-900">Humidité élevée détectée</p>
            <p className="text-sm text-amber-800 mt-1">
              Vos tomates présentent des symptômes d'oïdium. Conseillez un traitement préventif.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Actions Rapides</h2>
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-primary text-primary-foreground rounded-lg p-4 font-semibold hover:bg-primary/90 transition-smooth flex items-center justify-center gap-2">
            <Camera className="w-5 h-5" />
            Chargez une photo
          </button>
          <button className="bg-secondary text-secondary-foreground rounded-lg p-4 font-semibold hover:bg-secondary/90 transition-smooth flex items-center justify-center gap-2">
            <Zap className="w-5 h-5" />
            Irrigation
          </button>
        </div>
      </div>
    </div>
  )
}
