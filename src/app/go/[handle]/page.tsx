'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function GoPage({ params }: { params: { handle: string } }) {
  const router = useRouter()

  useEffect(() => {
    async function resolve() {
      const handle = params.handle?.toLowerCase().trim()
      if (!handle) { router.replace('/'); return }

      // Look up merchant by their subdomain/handle field
      const { data: merchant } = await supabase
        .from('merchants')
        .select('slug, business_name, is_premium')
        .eq('subdomain', handle)
        .single()

      if (merchant?.slug) {
        // Redirect to their actual store page
        router.replace(`/store/${merchant.slug}`)
      } else {
        // Handle not found — go home
        router.replace('/')
      }
    }
    resolve()
  }, [params.handle, router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    </div>
  )
}
