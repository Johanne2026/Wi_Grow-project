"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const screens = [
  {
    id: 1,
    title: "Diagnostiquez vos plantes",
    subtitle:
      "Prenez une photo d'une plante que vous souhaitez identifier et obtenez une analyse détaillée sur ce qui affecte votre plante",
    image: 'url("https://tse1.mm.bing.net/th/id/OIP.k9cSj9c2iSeVwKpWp9Qd3AHaEJ?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3")',
    color: "from-green-700 to-green-800",
  },
  {
    id: 2,
    title: "Obtenez les derniers conseils sur vos cultures",
    subtitle:
      "Vous avez un doute sur comment cultiver un plant spécifique ? Laissez-vous guider par nos conseils sur mesure",
    image: 'url("https://www.netafim.co.za/bynder/25C8D013-CE38-4AFD-AC2E9E8DE07BA4A7-avocado---south-africa-1.jpg?Width=1200&Height=630&Mode=crop")',
    color: "from-lime-600 to-green-700",
  },
  {
    id: 3,
    title: "Monitorer en temps réel",
    subtitle:
      "Suivez l'évolution de votre plantation avec des données en temps réel sur la météo, l'humidité et la croissance",
    image: 'url("https://tse4.mm.bing.net/th/id/OIP.gHHVuZuGOiVbCzmEAXACfgHaEJ?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3")',
    color: "from-green-600 to-teal-700",
  },
]

export default function OnboardingScreen({ onComplete }: { onComplete: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentScreen = screens[currentIndex]

  const handleNext = () => {
    if (currentIndex < screens.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      onComplete()
    }
  }

  const handleDotClick = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-700 to-green-900 text-white flex flex-col">
      {/* Background Image */}
      <div
        className={`flex-1 bg-cover bg-center bg-gradient-to-t from-green-900 via-transparent to-transparent`}
        style={{
          backgroundImage: currentScreen.image,
          opacity: 0.8,
        }}
      />

      {/* Content */}
      <div className="px-6 pb-12 pt-6">
        {/* Title */}
        <h1 className="text-3xl font-bold text-balance mb-4 leading-tight">{currentScreen.title}</h1>

        {/* Subtitle */}
        <p className="text-green-100 text-base leading-relaxed mb-8">{currentScreen.subtitle}</p>

        {/* Dots */}
        <div className="flex gap-2 justify-center mb-8">
          {screens.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-2 h-2 rounded-full transition-smooth ${
                index === currentIndex ? "bg-yellow-400 w-8" : "bg-green-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Button */}
        <Button
          onClick={handleNext}
          className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-full flex items-center justify-center gap-2"
        >
          {currentIndex === screens.length - 1 ? "Commencer" : "Suivant"}
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}
