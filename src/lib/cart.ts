// Shared cart utilities using localStorage

export interface CartItem {
  productId: string
  productName: string
  price: number
  priceDisplay: string
  imageUrl: string | null
  qty: number
  variantName?: string | null
  variantIndex?: number | null
}

export function getCart(slug: string): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(`earket_cart_${slug}`)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function saveCart(slug: string, cart: CartItem[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(`earket_cart_${slug}`, JSON.stringify(cart))
}

export function addToCart(slug: string, item: CartItem): CartItem[] {
  const cart = getCart(slug)
  const key = `${item.productId}_${item.variantName || ''}`
  const existing = cart.find(i => `${i.productId}_${i.variantName || ''}` === key)
  let newCart: CartItem[]
  if (existing) {
    newCart = cart.map(i => `${i.productId}_${i.variantName || ''}` === key ? { ...i, qty: i.qty + item.qty } : i)
  } else {
    newCart = [...cart, item]
  }
  saveCart(slug, newCart)
  return newCart
}

export function clearCart(slug: string) {
  if (typeof window === 'undefined') return
  localStorage.removeItem(`earket_cart_${slug}`)
}

export function cartCount(slug: string): number {
  return getCart(slug).reduce((s, i) => s + i.qty, 0)
}
