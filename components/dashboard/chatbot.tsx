"use client"

import { Send, MessageCircle } from "lucide-react"
import { useState } from "react"

export default function ChatbotScreen() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Bienvenue sur le chatBOT de Wi Grow ! Merci d'écrire votre besoin.", isBot: true },
  ])
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (input.trim()) {
      setMessages([
        ...messages,
        { id: messages.length + 1, text: input, isBot: false },
        {
          id: messages.length + 2,
          text: "Je vais analyser votre question et vous proposer la meilleure solution agricole. Pouvez-vous me donner plus de détails sur votre plantation ?",
          isBot: true,
        },
      ])
      setInput("")
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <MessageCircle className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="font-semibold">ChatBOT WI_GROW</h2>
          <p className="text-xs text-muted-foreground">En ligne</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 py-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}>
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.isBot
                  ? "bg-muted text-foreground rounded-tl-none"
                  : "bg-primary text-primary-foreground rounded-tr-none"
              }`}
            >
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-border pt-4 flex gap-2">
        <input
          type="text"
          placeholder="Votre message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary bg-card transition-smooth"
        />
        <button
          onClick={handleSend}
          className="bg-primary text-primary-foreground p-2 rounded-lg hover:bg-primary/90 transition-smooth"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
