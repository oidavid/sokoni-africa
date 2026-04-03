'use client'
import { useEffect } from 'react'

interface StoreJsonLdProps {
  businessName: string
  description: string
  location: string
  address?: string
  whatsappNumber?: string
  category: string
  logoUrl?: string | null
  slug: string
  themeColor?: string
}

const CATEGORY_TYPES: Record<string, string> = {
  food_groceries: 'FoodEstablishment',
  fashion: 'ClothingStore',
  beauty_hair: 'BeautySalon',
  auto_services: 'AutoRepair',
  electronics: 'ElectronicsStore',
  health_wellness: 'HealthClub',
  coaching: 'ProfessionalService',
  mental_wellness: 'MedicalBusiness',
  legal_finance: 'ProfessionalService',
  real_estate: 'RealEstateAgent',
  education: 'EducationalOrganization',
  home_services: 'HomeAndConstructionBusiness',
  events_catering: 'FoodEstablishment',
  cleaning: 'HomeAndConstructionBusiness',
  delivery: 'DeliveryService',
  fitness: 'SportsActivityLocation',
  photography: 'ProfessionalService',
  printing: 'Store',
  security: 'ProfessionalService',
  music: 'MusicGroup',
  hair_salon: 'HairSalon',
  fashion_design: 'ClothingStore',
}

export default function StoreJsonLd({
  businessName,
  description,
  location,
  address,
  whatsappNumber,
  category,
  logoUrl,
  slug,
  themeColor,
}: StoreJsonLdProps) {
  useEffect(() => {
    const type = CATEGORY_TYPES[category] || 'LocalBusiness'
    const url = `https://earket.com/store/${slug}`
    const phone = whatsappNumber ? `+${whatsappNumber.replace(/\D/g, '')}` : undefined

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': type,
      name: businessName,
      description: description || `${businessName} — shop online on Earket`,
      url,
      ...(phone && { telephone: phone }),
      ...(logoUrl && { image: logoUrl }),
      address: {
        '@type': 'PostalAddress',
        addressLocality: address || location,
        addressCountry: 'XX',
      },
      ...(themeColor && {
        brand: {
          '@type': 'Brand',
          name: businessName,
        }
      }),
      potentialAction: {
        '@type': 'OrderAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: url,
          actionPlatform: [
            'http://schema.org/DesktopWebPlatform',
            'http://schema.org/MobileWebPlatform',
          ],
        },
        deliveryMethod: 'http://purl.org/goodrelations/v1#DeliveryModeDirectDownload',
      },
    }

    // Inject or update the JSON-LD script tag
    const id = 'store-jsonld'
    let script = document.getElementById(id) as HTMLScriptElement | null
    if (!script) {
      script = document.createElement('script')
      script.id = id
      script.type = 'application/ld+json'
      document.head.appendChild(script)
    }
    script.textContent = JSON.stringify(jsonLd)

    return () => {
      const el = document.getElementById(id)
      if (el) el.remove()
    }
  }, [businessName, description, location, address, whatsappNumber, category, logoUrl, slug, themeColor])

  return null
}
