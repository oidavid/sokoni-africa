import { NextRequest, NextResponse } from 'next/server'

const COUNTRY_CURRENCY: Record<string, { code: string; symbol: string; name: string; rate: number }> = {
  NG: { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', rate: 1650 },
  GH: { code: 'GHS', symbol: 'GH₵', name: 'Ghanaian Cedi', rate: 15.5 },
  KE: { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', rate: 129 },
  ZA: { code: 'ZAR', symbol: 'R', name: 'South African Rand', rate: 18.5 },
  BR: { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', rate: 5.1 },
  PK: { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee', rate: 278 },
  IN: { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 83.5 },
  EG: { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound', rate: 48.5 },
  TZ: { code: 'TZS', symbol: 'TSh', name: 'Tanzanian Shilling', rate: 2530 },
  UG: { code: 'UGX', symbol: 'USh', name: 'Ugandan Shilling', rate: 3780 },
  ET: { code: 'ETB', symbol: 'Br', name: 'Ethiopian Birr', rate: 56 },
  SN: { code: 'XOF', symbol: 'CFA', name: 'West African Franc', rate: 615 },
  CI: { code: 'XOF', symbol: 'CFA', name: 'West African Franc', rate: 615 },
  CM: { code: 'XAF', symbol: 'FCFA', name: 'Central African Franc', rate: 615 },
  US: { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1 },
  GB: { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.79 },
  FR: { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92 },
  DE: { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92 },
  CA: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rate: 1.36 },
  AU: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 1.53 },
}

export async function GET(req: NextRequest) {
  const country = req.headers.get('x-vercel-ip-country') || 'US'
  const currency = COUNTRY_CURRENCY[country] || COUNTRY_CURRENCY['US']
  return NextResponse.json({ country, currency })
}
