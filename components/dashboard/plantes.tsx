"use client"

import { Leaf, TrendingUp, AlertTriangle, Droplets } from "lucide-react"

export default function PlantesScreen() {
  const crops = [
    { name: "Tomates", health: 85, growth: "Normal", moisture: "65%", lastUpdate: "Il y a 2h" },
    { name: "Maïs", health: 92, growth: "Excellent", moisture: "70%", lastUpdate: "Il y a 1h" },
    { name: "Manioc", health: 72, growth: "Modéré", moisture: "55%", lastUpdate: "Il y a 3h" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Plantes</h1>
        <button className="p-2 hover:bg-muted rounded-lg transition-smooth">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="2" />
            <circle cx="19" cy="12" r="2" />
            <circle cx="5" cy="12" r="2" />
          </svg>
        </button>
      </div>

      {/* Crops List */}
      <div className="space-y-3">
        {crops.map((crop) => (
          <div key={crop.name} className="bg-card border border-border rounded-xl p-4 space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{crop.name}</h3>
                  <p className="text-xs text-muted-foreground">{crop.lastUpdate}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">{crop.health}%</p>
                <p className="text-xs text-muted-foreground">Santé</p>
              </div>
            </div>

            {/* Health Bar */}
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-smooth"
                style={{ width: `${crop.health}%` }}
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-secondary" />
                <span className="text-sm text-foreground">{crop.growth}</span>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground">{crop.moisture}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Overall Status */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-green-700 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-green-900">Plantation en bon état</p>
          <p className="text-sm text-green-800 mt-1">83% de santé générale. Continuer le suivi régulier.</p>
        </div>
      </div>
    </div>
  )
}
