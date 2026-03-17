export const COUNTRIES = [
  { code: 'NG', name: 'Nigeria', dial: '234', flag: '🇳🇬' },
  { code: 'GH', name: 'Ghana', dial: '233', flag: '🇬🇭' },
  { code: 'KE', name: 'Kenya', dial: '254', flag: '🇰🇪' },
  { code: 'ZA', name: 'South Africa', dial: '27', flag: '🇿🇦' },
  { code: 'TZ', name: 'Tanzania', dial: '255', flag: '🇹🇿' },
  { code: 'UG', name: 'Uganda', dial: '256', flag: '🇺🇬' },
  { code: 'RW', name: 'Rwanda', dial: '250', flag: '🇷🇼' },
  { code: 'ET', name: 'Ethiopia', dial: '251', flag: '🇪🇹' },
  { code: 'SN', name: 'Senegal', dial: '221', flag: '🇸🇳' },
  { code: 'CI', name: 'Côte d\'Ivoire', dial: '225', flag: '🇨🇮' },
  { code: 'CM', name: 'Cameroon', dial: '237', flag: '🇨🇲' },
  { code: 'EG', name: 'Egypt', dial: '20', flag: '🇪🇬' },
  { code: 'MA', name: 'Morocco', dial: '212', flag: '🇲🇦' },
  { code: 'US', name: 'United States', dial: '1', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', dial: '44', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', dial: '1', flag: '🇨🇦' },
  { code: 'DE', name: 'Germany', dial: '49', flag: '🇩🇪' },
  { code: 'FR', name: 'France', dial: '33', flag: '🇫🇷' },
  { code: 'AE', name: 'UAE', dial: '971', flag: '🇦🇪' },
  { code: 'OTHER', name: 'Other', dial: '', flag: '🌍' },
]

export function normalizeNumber(number: string, dialCode: string) {
  const digits = number.replace(/\D/g, '')
  if (!dialCode) return digits
  // Remove leading zero from local number
  const local = digits.startsWith('0') ? digits.slice(1) : digits
  return dialCode + local
}
