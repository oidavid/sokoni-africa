'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function SubdomainPage({ params }: { params: { subdomain: string } }) {
  const router = useRouter()

  useEffect(() => {
    async function resolve() {
      const { subdomain } = params

      if (!subdomain) {
        router.replace('/')
        return
      }

      // Look up merchant by subdomain field
      const { data: merchant } = await supabase
        .from('merchants')
        .select('slug, business_name')
        .eq('subdomain', subdomain)
        .single()

      if (merchant?.slug) {
        // Redirect to the actual store page
        router.replace(`/store/${merchant.slug}`)
      } else {
        // Subdomain not found — redirect to homepage
        router.replace('/')
      }
    }

    resolve()
  }, [params, router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Loading store...</p>
      </div>
    </div>
  )
}
