"use client"

import { ShoppingBag, Plus, ChevronRight } from "lucide-react"

export default function FieldsScreen() {
  const fields = [
    {
      id: 1,
      name: "Parcelle Nord",
      crops: "Tomates, Manioc",
      area: "2 hectares",
      health: 85,
      status: "Sain",
    },
    {
      id: 2,
      name: "Parcelle Sud",
      crops: "Maïs",
      area: "1 hectare",
      health: 92,
      status: "Excellent",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mes Parcelles</h1>
      </div>

      {/* Fields List */}
      <div className="space-y-3">
        {fields.map((field) => (
          <div
            key={field.id}
            className="bg-card border border-border rounded-xl p-4 flex items-center justify-between hover:border-primary transition-smooth cursor-pointer"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{field.name}</h3>
                <p className="text-xs text-muted-foreground">{field.crops}</p>
                <p className="text-xs text-muted-foreground mt-1">{field.area}</p>
              </div>
            </div>
            <div className="text-right flex items-center gap-4">
              <div>
                <p className="text-lg font-bold text-primary">{field.health}%</p>
                <p className="text-xs text-muted-foreground">{field.status}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        ))}
      </div>

      {/* Add Field Button */}
      <button className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-semibold hover:bg-primary/90 transition-smooth flex items-center justify-center gap-2">
        <Plus className="w-5 h-5" />
        Ajouter une parcelle
      </button>
    </div>
  )
}
