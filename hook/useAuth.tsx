// hooks/useAuth.ts
"use client"

import { useState, useEffect } from 'react'

interface UserData {
  id: number
  nom: string
  prenom: string
  email: string
  Phone: string
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    setIsLoading(true)
    
    const authToken = localStorage.getItem('authToken')
    const storedUserData = localStorage.getItem('userData')
    
    if (authToken && storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData)
        setIsAuthenticated(true)
        setUserData(parsedUserData)
        
        // Optionnel: Vérifier la validité du token avec le serveur
        // validateTokenWithServer(authToken)
      } catch (error) {
        console.error('Erreur de parsing des données utilisateur:', error)
        clearAuth()
      }
    } else {
      clearAuth()
    }
    
    setIsLoading(false)
  }

  const login = (token: string, user: any) => {
    localStorage.setItem('authToken', token)
    localStorage.setItem('userData', JSON.stringify(user))
    localStorage.setItem('userId', user.id.toString())
    setIsAuthenticated(true)
    setUserData(user)
  }

  const logout = () => {
    clearAuth()
    // Rediriger vers la page de login si nécessaire
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
  }

  const clearAuth = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
    localStorage.removeItem('userId')
    localStorage.removeItem('userNom')
    localStorage.removeItem('userPrenom')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userType')
    setIsAuthenticated(false)
    setUserData(null)
  }

  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken')
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    }
  }

  return {
    isAuthenticated,
    userData,
    isLoading,
    login,
    logout,
    checkAuth,
    getAuthHeaders
  }
}