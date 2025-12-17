"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, User, Mail, Phone, MapPin, Lock, Globe, Map } from "lucide-react"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Correction des icônes Leaflet pour Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/images/marker-icon-2x.png",
  iconUrl: "/leaflet/images/marker-icon.png",
  shadowUrl: "/leaflet/images/marker-shadow.png",
})

interface SignupScreenProps {
  onComplete: () => void
  onSwitchToLogin: () => void
}

export default function SignupScreen({ onComplete, onSwitchToLogin }: SignupScreenProps) {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    phone: "",
    farmName: "",
    password: "",
    confirmPassword: "",
    farmSize: "",
    farmLocation: {
      latitude: 0,
      longitude: 0,
      address: ""
    }
  })

  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showMap, setShowMap] = useState(false)
  const [mapPosition, setMapPosition] = useState<[number, number]>([5.360, -4.008]) // Position par défaut: Côte d'Ivoire
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom est requis"
    }

    if (!formData.prenom.trim()) {
      newErrors.prenom = "Le prénom est requis"
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email invalide"
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis"
    } else if (formData.password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.farmName.trim()) {
      newErrors.farmName = "Le nom de l'exploitation est requis"
    }

    if (!formData.farmLocation.latitude || !formData.farmLocation.longitude) {
      newErrors.location = "Veuillez sélectionner la localisation de votre exploitation"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = async () => {
    // Validation locale d'abord
    if (!validateStep1()) {
      return;
    }

    setIsSubmitting(true);

    // Clear any previous errors
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.submit;
      return newErrors;
    });

    // Préparer les données pour l'API
    const apiData = {
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      motDePasse: formData.password,
      telephone: formData.phone || "",
      typeUtilisateur: "AGRICULTEUR",
      sexe: "M",
      localisation: "Localisation temporaire",
      actif: true
    };

    try {
      const response = await fetch('http://localhost:3010/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiData),
      });

      const data = await response.json(); // Parse ONCE

      if (!response.ok) {
        console.log(data.message || `Erreur ${response.status}: Échec de l'inscription`)
        // throw new Error(data.message || `Erreur ${response.status}: Échec de l'inscription`);
      }

      console.log("Inscription réussie:", data);

      // Store the token and user ID
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        // Stocker les informations utilisateur
        localStorage.setItem('userId', data.user.id.toString())
        localStorage.setItem('userData', JSON.stringify({
          nom: data.user.nom,
          prenom: data.user.prenom,
          email: data.user.email,
          telephone: data.user.telephone,
          typeUtilisateur: data.user.typeUtilisateur,
          sexe: data.user.sexe,
          localisation: data.user.localisation,
          actif: data.user.actif
        }))

        // Stocker les informations séparément pour un accès facile
        localStorage.setItem('userNom', data.user.nom)
        localStorage.setItem('userPrenom', data.user.prenom)
        localStorage.setItem('userEmail', data.user.email)
        localStorage.setItem('userType', data.user.typeUtilisateur)
        localStorage.setItem('userEmail', formData.email);
      }

      // SEULEMENT ICI on change de page (après succès)
      setStep(2);
      setErrors({});

    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      setErrors(prev => ({
        ...prev,
        submit: error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'inscription'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreviousStep = () => {
    setStep(1)
    setErrors({})
  }

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateStep2() && !isSubmitting) {
      setIsSubmitting(true);

      try {
        // Récupérer le token stocké
        const token = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
          throw new Error('Session invalide. Veuillez recommencer.');
        }

        // Préparer les données de l'exploitation
        const farmData = {
          nomExploitation: formData.farmName,
          superficieHectares: formData.farmSize ? parseFloat(formData.farmSize) : 0,
          latitude: formData.farmLocation.latitude,
          longitude: formData.farmLocation.longitude,
          localisation: formData.farmLocation.address ||
            `Lat: ${formData.farmLocation.latitude.toFixed(4)}, Lng: ${formData.farmLocation.longitude.toFixed(4)}`
        };

        const farmResponse = await fetch('http://localhost:3010/v1/exploitations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
          },
          body: JSON.stringify({
            // userId: parseInt(userId),
            ...farmData
          }),
        });

        const farmResult = await farmResponse.json(); // Parse ONCE

        if (!farmResponse.ok) {
          throw new Error(farmResult.message || 'Erreur création exploitation');
        }

        console.log("Exploitation créée avec succès");

        // Call the onComplete callback
        onComplete();

      } catch (error) {
        console.error('Erreur lors de la création de l\'exploitation:', error);
        setErrors(prev => ({
          ...prev,
          submit: error instanceof Error ? error.message : 'Une erreur est survenue'
        }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear field-specific error
    if (errors[field as string]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }

    // Clear submit error when user makes any change
    if (errors.submit) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.submit;
        return newErrors;
      });
    }
  }

  const handleLocationChange = (lat: number, lng: number) => {
    handleChange("farmLocation", {
      latitude: lat,
      longitude: lng,
      address: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`
    })
  }

  // Initialiser la carte
  useEffect(() => {
    if (showMap && mapContainerRef.current && !mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView(mapPosition, 10)

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(mapRef.current)

      // Ajouter un marqueur initial
      markerRef.current = L.marker(mapPosition, {
        draggable: true
      }).addTo(mapRef.current)

      // Mettre à jour la position quand le marqueur est déplacé
      markerRef.current.on("dragend", function (event) {
        const marker = event.target
        const position = marker.getLatLng()
        setMapPosition([position.lat, position.lng])
        handleLocationChange(position.lat, position.lng)
      })

      // Gestion du clic sur la carte
      mapRef.current.on("click", function (event) {
        const { lat, lng } = event.latlng
        setMapPosition([lat, lng])
        handleLocationChange(lat, lng)

        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng])
        }
      })
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        markerRef.current = null
      }
    }
  }, [showMap])

  // Géolocalisation de l'utilisateur
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setMapPosition([latitude, longitude])
          handleLocationChange(latitude, longitude)

          if (mapRef.current) {
            mapRef.current.setView([latitude, longitude], 15)
          }
          if (markerRef.current) {
            markerRef.current.setLatLng([latitude, longitude])
          }
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error)
          alert("Impossible d'obtenir votre position actuelle")
        }
      )
    } else {
      alert("La géolocalisation n'est pas supportée par votre navigateur")
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12">
      <div className="mb-8 text-center">
        <div className="mb-4 rounded-3 flex justify-center">
          <img
            src="/logo_wi.png"
            alt="WI GROW Logo"
            width={80}
            height={80}
            className="object-contain rounded-2xl"
          />
        </div>
        <h1 className="text-3xl font-bold text-primary mb-2">WI GROW</h1>
        <p className="text-muted-foreground italic">Créez votre compte agricole</p>
      </div>
      {/* Ajouter ceci juste après le bouton Suivant dans l'étape 1 */}
      {errors.submit && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{errors.submit}</p>
        </div>
      )}

      <div className="flex gap-3 mt-8">
        {/* Buttons */}
      </div>
      <div className="w-full max-w-md mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className={`flex items-center ${step >= 1 ? "text-primary" : "text-gray-400"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${step >= 1 ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
              }`}>
              1
            </div>
            <span className="font-medium">Compte</span>
          </div>
          <div className="flex-1 h-1 mx-4 bg-gray-200">
            <div className={`h-full transition-all duration-300 ${step >= 2 ? "bg-primary" : "bg-gray-200"
              }`}></div>
          </div>
          <div className={`flex items-center ${step >= 2 ? "text-primary" : "text-gray-400"}`}>
            <span className="font-medium mr-2">Exploitation</span>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
              }`}>
              2
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit}>
          {step === 1 ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Informations personnelles</h2>

              {/* Nom */}
              <div>
                <div className="relative">
                  <div className="absolute left-4 top-3.5">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Nom *"
                    value={formData.nom}
                    onChange={(e) => handleChange("nom", e.target.value)}
                    className={`w-full pl-12 pr-6 py-3 border-2 rounded-full focus:outline-none transition-smooth ${errors.nom
                      ? "border-red-500 focus:border-red-500"
                      : "border-border focus:border-primary"
                      } bg-white text-foreground placeholder:text-muted-foreground`}
                  />
                </div>
                {errors.nom && (
                  <p className="text-red-500 text-sm mt-1 ml-4">{errors.nom}</p>
                )}
              </div>

              {/* Prénom */}
              <div>
                <div className="relative">
                  <div className="absolute left-4 top-3.5">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Prénom *"
                    value={formData.prenom}
                    onChange={(e) => handleChange("prenom", e.target.value)}
                    className={`w-full pl-12 pr-6 py-3 border-2 rounded-full focus:outline-none transition-smooth ${errors.prenom
                      ? "border-red-500 focus:border-red-500"
                      : "border-border focus:border-primary"
                      } bg-white text-foreground placeholder:text-muted-foreground`}
                  />
                </div>
                {errors.prenom && (
                  <p className="text-red-500 text-sm mt-1 ml-4">{errors.prenom}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <div className="relative">
                  <div className="absolute left-4 top-3.5">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    placeholder="Email *"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className={`w-full pl-12 pr-6 py-3 border-2 rounded-full focus:outline-none transition-smooth ${errors.email
                      ? "border-red-500 focus:border-red-500"
                      : "border-border focus:border-primary"
                      } bg-white text-foreground placeholder:text-muted-foreground`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 ml-4">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <div className="relative">
                  <div className="absolute left-4 top-3.5">
                    <Phone className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    placeholder="Numéro de téléphone"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="w-full pl-12 pr-6 py-3 border-2 border-border rounded-full focus:outline-none focus:border-primary bg-white text-foreground placeholder:text-muted-foreground transition-smooth"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="relative">
                  <div className="absolute left-4 top-3.5">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    placeholder="Mot de passe *"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    className={`w-full pl-12 pr-6 py-3 border-2 rounded-full focus:outline-none transition-smooth ${errors.password
                      ? "border-red-500 focus:border-red-500"
                      : "border-border focus:border-primary"
                      } bg-white text-foreground placeholder:text-muted-foreground`}
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1 ml-4">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <div className="relative">
                  <div className="absolute left-4 top-3.5">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    placeholder="Confirmer le mot de passe *"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    className={`w-full pl-12 pr-6 py-3 border-2 rounded-full focus:outline-none transition-smooth ${errors.confirmPassword
                      ? "border-red-500 focus:border-red-500"
                      : "border-border focus:border-primary"
                      } bg-white text-foreground placeholder:text-muted-foreground`}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1 ml-4">{errors.confirmPassword}</p>
                )}
              </div>

              <Button
                type="button"
                onClick={handleNextStep}
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-full mt-6 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    Traitement en cours...
                  </>
                ) : (
                  <>
                    Suivant
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Votre exploitation</h2>

              {/* Farm Name */}
              <div>
                <div className="relative">
                  <div className="absolute left-4 top-3.5">
                    <MapPin className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Nom de l'exploitation *"
                    value={formData.farmName}
                    onChange={(e) => handleChange("farmName", e.target.value)}
                    className={`w-full pl-12 pr-6 py-3 border-2 rounded-full focus:outline-none transition-smooth ${errors.farmName
                      ? "border-red-500 focus:border-red-500"
                      : "border-border focus:border-primary"
                      } bg-white text-foreground placeholder:text-muted-foreground`}
                  />
                </div>
                {errors.farmName && (
                  <p className="text-red-500 text-sm mt-1 ml-4">{errors.farmName}</p>
                )}
              </div>

              {/* Farm Size */}
              <div>
                <input
                  type="text"
                  placeholder="Superficie (hectares)"
                  value={formData.farmSize}
                  onChange={(e) => handleChange("farmSize", e.target.value)}
                  className="w-full px-6 py-3 border-2 border-border rounded-full focus:outline-none focus:border-primary bg-white text-foreground placeholder:text-muted-foreground transition-smooth"
                />
              </div>

              {/* Location Picker */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">Localisation de l'exploitation *</span>
                </div>

                {errors.location && (
                  <p className="text-red-500 text-sm ml-1">{errors.location}</p>
                )}

                {/* Coordonnées affichées */}
                {(formData.farmLocation.latitude && formData.farmLocation.longitude) ? (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">Position sélectionnée :</span><br />
                      Latitude: {formData.farmLocation.latitude.toFixed(6)}<br />
                      Longitude: {formData.farmLocation.longitude.toFixed(6)}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Aucune position sélectionnée</p>
                )}

                {/* Bouton pour ouvrir la carte */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowMap(!showMap)}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Map className="w-4 h-4" />
                  {showMap ? "Masquer la carte" : "Sélectionner sur la carte"}
                </Button>

                {/* Bouton géolocalisation */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleUseCurrentLocation}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  Utiliser ma position actuelle
                </Button>

                {/* Carte OpenStreetMap */}
                {showMap && (
                  <div className="border-2 border-border rounded-lg overflow-hidden">
                    <div
                      ref={mapContainerRef}
                      className="w-full h-64"
                    />
                    <div className="p-3 bg-gray-50 border-t">
                      <p className="text-sm text-gray-600">
                        Cliquez sur la carte ou déplacez le marqueur pour sélectionner la position
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-8">
                <Button
                  type="button"
                  onClick={handlePreviousStep}
                  variant="outline"
                  className="flex-1 py-3 rounded-full border-2"
                >
                  Retour
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-full flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                      Création de l'exploitation...
                    </>
                  ) : (
                    <>
                      Finaliser l'inscription
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </form>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground">
            Déjà un compte ?{" "}
            <button
              onClick={onSwitchToLogin}
              className="text-primary font-semibold hover:underline"
            >
              Se connecter
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}