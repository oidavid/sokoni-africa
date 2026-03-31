'use client'
import { useState, useRef } from 'react'
import { ArrowRight, ArrowLeft, Loader2, Check, ShoppingBag, Mail, MessageCircle, Eye, EyeOff, Lock, Mic, MicOff, X, Plus } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { getSampleProducts } from '@/lib/sample-products'
import { getSampleServices, getSampleServicesBySubcategory } from '@/lib/sample-services'
import { COUNTRIES, normalizeNumber } from '@/lib/countries'
import { COUNTRY_LIST } from '@/lib/countries-cities'
import { EARKET_THEMES, getThemeStyle, type EarketTheme } from '@/lib/themes'

type Step = 'language' | 'business' | 'whatsapp' | 'email' | 'password' | 'biztype' | 'category' | 'subcategory' | 'location' | 'theme' | 'preview' | 'products' | 'generating' | 'done'

const CATEGORIES = [
  { id: 'food', label: 'Food & Drinks', emoji: '🍱', pidgin: 'Food & Drink' },
  { id: 'groceries', label: 'Groceries & Provisions', emoji: '🛒', pidgin: 'Provisions & Groceries' },
  { id: 'fashion', label: 'Fashion & Clothing', emoji: '👗', pidgin: 'Cloth & Fashion' },
  { id: 'beauty', label: 'Beauty & Hair Products', emoji: '💄', pidgin: 'Beauty & Hair' },
  { id: 'shoes', label: 'Shoes & Bags', emoji: '👟', pidgin: 'Shoes & Bags' },
  { id: 'electronics', label: 'Electronics & Gadgets', emoji: '🔌', pidgin: 'Electronics & Gadgets' },
  { id: 'phones', label: 'Phones & Laptops', emoji: '📱', pidgin: 'Phone & Laptop' },
  { id: 'furniture', label: 'Furniture & Home Decor', emoji: '🏠', pidgin: 'Furniture & Home' },
  { id: 'health', label: 'Health & Pharmacy', emoji: '💊', pidgin: 'Health & Pharmacy' },
  { id: 'stationery', label: 'Stationery & Office', emoji: '📚', pidgin: 'Books & Office' },
  { id: 'automobile', label: 'Auto Parts & Car', emoji: '🚗', pidgin: 'Car & Auto Parts' },
  { id: 'agriculture', label: 'Agriculture & Farming', emoji: '🌱', pidgin: 'Farm & Agriculture' },
  { id: 'jewellery', label: 'Jewellery & Accessories', emoji: '💍', pidgin: 'Jewellery & Accessories' },
  { id: 'baby_kids', label: 'Baby & Kids Products', emoji: '👶', pidgin: 'Baby & Kids' },
  { id: 'sports', label: 'Sports & Fitness', emoji: '⚽', pidgin: 'Sports & Fitness' },
  { id: 'art_crafts', label: 'Art, Crafts & Gifts', emoji: '🎨', pidgin: 'Art & Crafts' },
  { id: 'books_media', label: 'Books & Media', emoji: '📖', pidgin: 'Books & Media' },
  { id: 'building', label: 'Building & Construction', emoji: '🧱', pidgin: 'Building Materials' },
  { id: 'pets', label: 'Pet Supplies', emoji: '🐾', pidgin: 'Pet Supplies' },
  { id: 'cosmetics', label: 'Cosmetics & Skincare', emoji: '✨', pidgin: 'Cosmetics & Skincare' },
  { id: 'food_ingredients', label: 'Food Ingredients & Spices', emoji: '🌶', pidgin: 'Spices & Ingredients' },
  { id: 'other', label: 'Other Business', emoji: '🏪', pidgin: 'Other Business' },
]

const SERVICE_CATEGORIES = [
  { id: 'beauty_services', label: 'Beauty & Personal Care', emoji: '💅', pidgin: 'Beauty & Style' },
  { id: 'coaching', label: 'Coaching & Mentoring', emoji: '🎯', pidgin: 'Coaching & Mentoring' },
  { id: 'education', label: 'Education & Tutoring', emoji: '📚', pidgin: 'Teaching & Tutoring' },
  { id: 'health_wellness', label: 'Health & Wellness', emoji: '🏥', pidgin: 'Health & Wellness' },
  { id: 'mental_wellness', label: 'Mental Wellness', emoji: '💙', pidgin: 'Mental Wellness' },
  { id: 'food_catering', label: 'Food & Catering', emoji: '🍽', pidgin: 'Food & Catering' },
  { id: 'domestic', label: 'Cleaning & Domestic', emoji: '🧹', pidgin: 'House Help & Cleaning' },
  { id: 'home_services', label: 'Home Repairs & Technical', emoji: '🔧', pidgin: 'Home Repair & Technical' },
  { id: 'digital_services', label: 'Digital & Creative', emoji: '💻', pidgin: 'Digital & Tech' },
  { id: 'events', label: 'Events & Entertainment', emoji: '🎉', pidgin: 'Events & Party' },
  { id: 'transport', label: 'Transport & Delivery', emoji: '🚚', pidgin: 'Delivery & Transport' },
  { id: 'childcare', label: 'Childcare & Nanny', emoji: '👶', pidgin: 'Childcare & Nanny' },
  { id: 'auto_services', label: 'Auto & Vehicle Services', emoji: '🚗', pidgin: 'Car & Vehicle' },
  { id: 'agriculture', label: 'Agriculture Services', emoji: '🌱', pidgin: 'Farm & Agriculture' },
  { id: 'fashion_design', label: 'Fashion Design & Tailoring', emoji: '🧵', pidgin: 'Tailoring & Fashion Design' },
  { id: 'photography', label: 'Photography & Videography', emoji: '📷', pidgin: 'Photography & Video' },
  { id: 'legal_finance', label: 'Legal & Financial Services', emoji: '⚖', pidgin: 'Legal & Finance' },
  { id: 'real_estate', label: 'Real Estate & Property', emoji: '🏡', pidgin: 'Real Estate & Property' },
  { id: 'printing', label: 'Printing & Branding', emoji: '🖨', pidgin: 'Printing & Branding' },
  { id: 'security', label: 'Security Services', emoji: '🛡', pidgin: 'Security Services' },
  { id: 'fitness', label: 'Fitness & Personal Training', emoji: '💪', pidgin: 'Fitness & Training' },
  { id: 'music', label: 'Music & Entertainment', emoji: '🎵', pidgin: 'Music & Entertainment' },
  { id: 'hair_salon', label: 'Hair Salon & Barber', emoji: '💈', pidgin: 'Hair Salon & Barber' },
]

const SERVICE_SUBCATEGORIES: Record<string, Array<{ id: string; label: string; emoji: string }>> = {
  home_services: [
    { id: 'electrician', label: 'Electrician / House Wiring', emoji: 'âš¡' },
    { id: 'plumber', label: 'Plumber', emoji: '' },
    { id: 'generator', label: 'Generator Repair', emoji: '📍' },
    { id: 'ac', label: 'AC / Air Conditioning', emoji: 'â„ï¸' },
    { id: 'painter', label: 'Painter', emoji: '' },
    { id: 'tiler', label: 'Tiling & Flooring', emoji: '' },
    { id: 'solar', label: 'Solar Installation', emoji: 'â˜€ï¸' },
    { id: 'carpenter', label: 'Carpenter', emoji: '' },
    { id: 'welder', label: 'Welder / Metal Work', emoji: 'âš™ï¸' },
    { id: 'general', label: 'General House Repairs', emoji: '' },
  ],
  auto_services: [
    { id: 'mechanic', label: 'Mechanic / Car Service', emoji: '' },
    { id: 'carwash', label: 'Car Wash', emoji: '✨' },
    { id: 'tyres', label: 'Tyre Repair / Vulcanizer', emoji: '' },
    { id: 'brakes', label: 'Brakes & Suspension', emoji: '' },
    { id: 'auto_electrician', label: 'Auto Electrician', emoji: 'âš¡' },
    { id: 'panel_beater', label: 'Panel Beating / Body Repair', emoji: '' },
    { id: 'detailing', label: 'Car Detailing', emoji: 'âœ¨' },
    { id: 'motorcycle', label: 'Motorcycle Repair', emoji: '' },
  ],
  beauty_services: [
    { id: 'massage', label: 'Massage & Body Therapy', emoji: '' },
    { id: 'braiding', label: 'Hair Braiding & Styling', emoji: '' },
    { id: 'makeup', label: 'Makeup Artist', emoji: '' },
    { id: 'nails', label: 'Nails & Manicure', emoji: '' },
    { id: 'barber', label: "Barber / Men's Grooming", emoji: 'âœ‚ï¸' },
    { id: 'skincare', label: 'Skincare & Facial', emoji: '' },
    { id: 'wigs', label: 'Wig Making & Installation', emoji: '' },
    { id: 'threading', label: 'Eyebrow Threading', emoji: '' },
    { id: 'relaxer', label: 'Hair Relaxer & Treatment', emoji: '' },
  ],
  education: [
    { id: 'primary', label: 'Primary School Tutoring', emoji: '' },
    { id: 'exam_prep', label: 'WAEC / JAMB Exam Prep', emoji: '' },
    { id: 'computer', label: 'Computer Training', emoji: '' },
    { id: 'music', label: 'Music Lessons', emoji: '' },
    { id: 'language', label: 'Language / English', emoji: '' },
    { id: 'digital', label: 'Digital & Online Business', emoji: '' },
    { id: 'coding', label: 'Coding & Programming', emoji: '' },
  ],
  health_wellness: [
    { id: 'physio', label: 'Physiotherapy', emoji: '' },
    { id: 'fitness', label: 'Personal Fitness Trainer', emoji: '' },
    { id: 'nutrition', label: 'Nutrition & Diet', emoji: '' },
    { id: 'nanny', label: 'Childcare / Nanny', emoji: '' },
    { id: 'elderly', label: 'Elderly Home Care', emoji: '' },
    { id: 'nursing', label: 'Mobile Nursing', emoji: '' },
  ],
  domestic: [
    { id: 'cleaning', label: 'House / Office Cleaning', emoji: '' },
    { id: 'laundry', label: 'Laundry & Ironing', emoji: '' },
    { id: 'cooking', label: 'Home Cooking', emoji: '' },
    { id: 'pest', label: 'Pest Control', emoji: '' },
    { id: 'weekly', label: 'Weekly Cleaning Service', emoji: '' },
  ],
  events: [
    { id: 'photography', label: 'Photography', emoji: '📸' },
    { id: 'videography', label: 'Videography', emoji: '' },
    { id: 'catering', label: 'Catering', emoji: '' },
    { id: 'decoration', label: 'Event Decoration', emoji: '' },
    { id: 'cake', label: 'Cake Making', emoji: '' },
    { id: 'dj', label: 'DJ Services', emoji: '' },
    { id: 'mc', label: 'MC / Event Host', emoji: '' },
  ],
  digital_services: [
    { id: 'logo', label: 'Logo & Graphic Design', emoji: '' },
    { id: 'phone_repair', label: 'Phone Screen Repair', emoji: '' },
    { id: 'laptop_repair', label: 'Laptop Repair', emoji: '' },
    { id: 'social_media', label: 'Social Media Management', emoji: '' },
    { id: 'cv', label: 'CV & Cover Letter Writing', emoji: '' },
    { id: 'flyer', label: 'Flyer & Banner Design', emoji: '' },
    { id: 'printing', label: 'Printing Services', emoji: '' },
  ],
  transport: [
    { id: 'delivery', label: 'Package Delivery', emoji: '' },
    { id: 'driver', label: 'Driver for Hire', emoji: '' },
    { id: 'airport', label: 'Airport Pick-up & Drop-off', emoji: 'âœˆï¸' },
    { id: 'school_run', label: 'School Run Service', emoji: '' },
    { id: 'moving', label: 'Moving & Relocation', emoji: '' },
    { id: 'bike', label: 'Bike / Okada Delivery', emoji: '' },
  ],
  coaching: [
    { id: 'life_coach', label: 'Life Coaching', emoji: '' },
    { id: 'business_coach', label: 'Business Coaching', emoji: '' },
    { id: 'career_coach', label: 'Career Coaching', emoji: '' },
    { id: 'womens_empowerment', label: "Women's Empowerment", emoji: '' },
    { id: 'mindset_coach', label: 'Mindset & Confidence', emoji: '' },
    { id: 'teen_coach', label: 'Teen & Youth Coaching', emoji: '🏱' },
    { id: 'relationship_coach', label: 'Relationship Coaching', emoji: 'â¤ï¸' },
    { id: 'executive_coach', label: 'Executive Coaching', emoji: '' },
    { id: 'public_speaking', label: 'Public Speaking', emoji: '' },
    { id: 'leadership', label: 'Leadership Training', emoji: '' },
  ],
  mental_wellness: [
    { id: 'counselling', label: 'Counselling & Therapy', emoji: '' },
    { id: 'stress_mgmt', label: 'Stress Management', emoji: '' },
    { id: 'mindfulness', label: 'Mindfulness & Meditation', emoji: '' },
    { id: 'grief_support', label: 'Grief & Loss Support', emoji: '' },
    { id: 'anxiety_coach', label: 'Anxiety Coaching', emoji: '' },
    { id: 'burnout', label: 'Burnout Recovery', emoji: '' },
    { id: 'self_esteem', label: 'Self-Esteem & Confidence', emoji: '' },
  ],
  childcare: [
    { id: 'fulltime_nanny', label: 'Full-time Nanny', emoji: '' },
    { id: 'afterschool', label: 'After-school Care', emoji: '' },
    { id: 'babysitting', label: 'Babysitting', emoji: '' },
    { id: 'homework_help', label: 'Homework Help', emoji: '' },
    { id: 'special_needs', label: 'Special Needs Care', emoji: '' },
    { id: 'holiday_care', label: 'Holiday & Weekend Care', emoji: '' },
  ],
  food_catering: [
    { id: 'home_cooked', label: 'Home-cooked Meals', emoji: '' },
    { id: 'meal_prep', label: 'Weekly Meal Prep', emoji: '' },
    { id: 'office_catering', label: 'Office Catering', emoji: '' },
    { id: 'party_catering', label: 'Party & Event Catering', emoji: '🎉' },
    { id: 'diet_meals', label: 'Diet & Healthy Meal Plans', emoji: '' },
    { id: 'baking', label: 'Baking & Pastries', emoji: '' },
    { id: 'chefs_table', label: "Private Chef / Chef's Table", emoji: '' },
  ],
  agriculture: [
    { id: 'poultry', label: 'Poultry Farm Consultation', emoji: '' },
    { id: 'farm_labour', label: 'Farm Labour', emoji: '' },
    { id: 'irrigation', label: 'Irrigation Installation', emoji: '' },
    { id: 'tractor', label: 'Tractor / Ploughing', emoji: '' },
    { id: 'fish', label: 'Fish Farm Setup', emoji: '' },
    { id: 'produce', label: 'Produce Aggregation', emoji: '' },
  ],
}

const SUBCATEGORY_SERVICE_MAP: Record<string, string[]> = {
  electrician: ['House Wiring', 'Electrical'],
  plumber: ['Plumbing'],
  generator: ['Generator'],
  ac: ['AC', 'Air Condition'],
  painter: ['Paint'],
  tiler: ['Tiling', 'Flooring'],
  solar: ['Solar'],
  carpenter: ['Carpentry'],
  welder: ['Welding', 'Metal'],
  general: ['General House'],
  mechanic: ['Car Service', 'Oil Change'],
  carwash: ['Car Wash'],
  tyres: ['Tyre'],
  brakes: ['Brake'],
  auto_electrician: ['Auto Electrical'],
  panel_beater: ['Panel Beating', 'Body Repair'],
  detailing: ['Detailing'],
  motorcycle: ['Motorcycle'],
  massage: ['Massage', 'Body Therapy'],
  braiding: ['Braiding', 'Hair Stylist'],
  makeup: ['Makeup'],
  nails: ['Nail', 'Manicure'],
  barber: ['Haircut', 'Barber'],
  skincare: ['Facial', 'Skin'],
  wigs: ['Wig'],
  threading: ['Threading', 'Eyebrow'],
  relaxer: ['Relaxer', 'Treatment'],
  primary: ['Primary', 'Home Tutoring'],
  exam_prep: ['WAEC', 'JAMB', 'Exam'],
  computer: ['Computer', 'Microsoft'],
  music: ['Music', 'Piano'],
  language: ['English', 'Language'],
  digital: ['Digital', 'Online Business'],
  coding: ['Coding', 'Programming'],
  physio: ['Physiotherapy'],
  fitness: ['Fitness', 'Training'],
  nutrition: ['Nutrition', 'Diet'],
  nanny: ['Childcare', 'Nanny'],
  elderly: ['Elderly', 'Home Care'],
  nursing: ['Nursing', 'Mobile Nurse'],
  cleaning: ['Cleaning', 'Office Clean'],
  laundry: ['Laundry', 'Ironing'],
  cooking: ['Cooking', 'Chef'],
  pest: ['Pest'],
  weekly: ['Weekly'],
  photography: ['Photography'],
  videography: ['Videography'],
  catering: ['Catering'],
  decoration: ['Decoration'],
  cake: ['Cake'],
  dj: ['DJ'],
  mc: ['MC', 'Host'],
  logo: ['Logo', 'Graphic'],
  phone_repair: ['Phone Screen', 'Phone Repair'],
  laptop_repair: ['Laptop'],
  social_media: ['Social Media'],
  cv: ['CV', 'Cover Letter'],
  flyer: ['Flyer', 'Banner'],
  printing: ['Print'],
  delivery: ['Delivery', 'Same Day'],
  driver: ['Driver'],
  airport: ['Airport'],
  school_run: ['School Run'],
  moving: ['Moving', 'Relocation'],
  bike: ['Bike', 'Okada'],
  poultry: ['Poultry'],
  farm_labour: ['Farm Labour'],
  irrigation: ['Irrigation'],
  tractor: ['Tractor', 'Plough'],
  fish: ['Fish'],
  produce: ['Produce'],
  life_coach: ['Life Coach'],
  business_coach: ['Business Coach', 'Business Mentor'],
  career_coach: ['Career Coach', 'Career'],
  womens_empowerment: ["Women's Empowerment", 'Women Empowerment', 'Women'],
  mindset_coach: ['Mindset', 'Confidence Coach'],
  teen_coach: ['Teen', 'Youth'],
  relationship_coach: ['Relationship'],
  executive_coach: ['Executive'],
  public_speaking: ['Public Speaking', 'Presentation'],
  leadership: ['Leadership'],
  counselling: ['Counselling', 'Therapy', 'Therapist'],
  stress_mgmt: ['Stress', 'Burnout'],
  mindfulness: ['Mindfulness', 'Meditation'],
  grief_support: ['Grief', 'Loss'],
  anxiety_coach: ['Anxiety'],
  burnout: ['Burnout', 'Recovery'],
  self_esteem: ['Self-Esteem', 'Confidence'],
  fulltime_nanny: ['Full-time Nanny', 'Nanny'],
  afterschool: ['After-school', 'After School'],
  babysitting: ['Babysit'],
  homework_help: ['Homework'],
  special_needs: ['Special Needs'],
  holiday_care: ['Holiday Care', 'Weekend Care'],
  home_cooked: ['Home-cooked', 'Home Cooked', 'Meal'],
  meal_prep: ['Meal Prep', 'Weekly Meal'],
  office_catering: ['Office Catering'],
  party_catering: ['Party Catering', 'Event Catering'],
  diet_meals: ['Diet', 'Healthy Meal', 'Nutrition'],
  baking: ['Baking', 'Pastry', 'Cake'],
  chefs_table: ['Private Chef', 'Chef'],
}

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex gap-2 justify-center mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${
          i < current ? 'bg-brand-green w-6' : i === current ? 'bg-brand-green w-4' : 'bg-gray-200 w-4'
        }`} />
      ))}
    </div>
  )
}

export default function OnboardingPage() {
  const [lang, setLang] = useState<'en' | 'pid'>('pid')
  const [step, setStep] = useState<Step>('language')
  const [businessName, setBusinessName] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [whatsappRaw, setWhatsappRaw] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0])
  const [showCountryPicker, setShowCountryPicker] = useState(false)
  const [countrySearch, setCountrySearch] = useState('')
  const [email, setEmail] = useState('')
  const [category, setCategory] = useState('')
  const [businessType, setBusinessType] = useState<'products' | 'services' | ''>('')
  const [location, setLocation] = useState('')
  const [genStep, setGenStep] = useState(0)
  const [storeSlug, setStoreSlug] = useState('')
  const [error, setError] = useState('')
  const [loginSent, setLoginSent] = useState<'email' | 'whatsapp' | null>(null)
  const [alreadyExists, setAlreadyExists] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set())
  const [customCity, setCustomCity] = useState('')
  const [showOtherCity, setShowOtherCity] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState<EarketTheme>(EARKET_THEMES[0])
  const [selectedSubcategories, setSelectedSubcategories] = useState<Set<string>>(new Set())
  const [customServices, setCustomServices] = useState<Array<{name: string; description: string; price: number; price_display: string}>>([])
  const [customServiceInput, setCustomServiceInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<any>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isDescribing, setIsDescribing] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  const pid = lang === 'pid'
  const rawSampleItems = category ? (businessType === 'services' ? getSampleServices(category, selectedCountry.code) : getSampleProducts(category, selectedCountry.code)) : []
  const countryCurrencyMap: Record<string, {symbol: string; rate: number}> = {
    '234': {symbol: '₦', rate: 1}, '233': {symbol: 'GH₵', rate: 0.0094},
    '254': {symbol: 'KSh', rate: 0.078}, '27': {symbol: 'R', rate: 0.011},
    '1': {symbol: '$', rate: 0.00061}, '1876': {symbol: 'J$', rate: 0.094},
    '1868': {symbol: 'TT$', rate: 0.0041}, '1809': {symbol: 'RD$', rate: 0.035},
    '44': {symbol: '£', rate: 0.00048}, '353': {symbol: '€', rate: 0.00056},
    '55': {symbol: 'R$', rate: 0.0031}, '92': {symbol: '₨', rate: 0.17},
    '91': {symbol: '₹', rate: 0.051}, '60': {symbol: 'RM', rate: 0.0029},
    '63': {symbol: '₱', rate: 0.034}, '62': {symbol: 'Rp', rate: 9.6},
    '20': {symbol: 'E£', rate: 0.029}, '255': {symbol: 'TSh', rate: 1.53},
    '256': {symbol: 'USh', rate: 2.29}, '251': {symbol: 'Br', rate: 0.034},
    '221': {symbol: 'CFA', rate: 0.37}, '237': {symbol: 'FCFA', rate: 0.37},
    '33': {symbol: '€', rate: 0.00056}, '49': {symbol: '€', rate: 0.00056},
    '34': {symbol: '€', rate: 0.00056}, '39': {symbol: '€', rate: 0.00056},
    '31': {symbol: '€', rate: 0.00056}, '32': {symbol: '€', rate: 0.00056},
    '351': {symbol: '€', rate: 0.00056}, '30': {symbol: '€', rate: 0.00056},
    '43': {symbol: '€', rate: 0.00056}, '358': {symbol: '€', rate: 0.00056},
    '46': {symbol: 'kr', rate: 0.0064}, '47': {symbol: 'kr', rate: 0.0059},
    '45': {symbol: 'kr', rate: 0.0074}, '41': {symbol: 'CHF', rate: 0.00056},
    '81': {symbol: '¥', rate: 0.092}, '82': {symbol: '₩', rate: 0.83},
    '971': {symbol: 'AED', rate: 0.0022}, '966': {symbol: 'SAR', rate: 0.0023},
    '965': {symbol: 'KWD', rate: 0.00019}, '974': {symbol: 'QAR', rate: 0.0022},
    '966': {symbol: 'SAR', rate: 0.0023}, '880': {symbol: '৳', rate: 0.067},
    '94': {symbol: '₨', rate: 0.17}, '977': {symbol: 'NPR', rate: 0.082},
    '66': {symbol: '฿', rate: 0.021}, '84': {symbol: '₫', rate: 15.5},
    '95': {symbol: 'K', rate: 1.29}, '65': {symbol: 'S$', rate: 0.00082},
    '52': {symbol: 'MX$', rate: 0.011}, '54': {symbol: 'AR$', rate: 0.61},
    '56': {symbol: 'CLP', rate: 0.59}, '57': {symbol: 'COP', rate: 2.56},
    '51': {symbol: 'S/', rate: 0.0024}, '58': {symbol: 'Bs.D', rate: 0.022},
    '506': {symbol: '₡', rate: 0.31}, '507': {symbol: 'B/.', rate: 0.00061},
    '502': {symbol: 'Q', rate: 0.0049}, '504': {symbol: 'L', rate: 0.015},
    '505': {symbol: 'C$', rate: 0.023}, '503': {symbol: '$', rate: 0.00061},
    '213': {symbol: 'DA', rate: 0.082}, '212': {symbol: 'MAD', rate: 0.0061},
    '216': {symbol: 'TND', rate: 0.0019}, '249': {symbol: 'SDG', rate: 0.36},
    '250': {symbol: 'RWF', rate: 0.82}, '257': {symbol: 'BIF', rate: 1.77},
    '261': {symbol: 'Ar', rate: 2.75}, '260': {symbol: 'K', rate: 0.016},
    '258': {symbol: 'MT', rate: 0.039}, '267': {symbol: 'P', rate: 0.0084},
    '264': {symbol: 'N$', rate: 0.011}, '266': {symbol: 'L', rate: 0.011},
    '244': {symbol: 'Kz', rate: 0.52}, '224': {symbol: 'GNF', rate: 5.24},
    '232': {symbol: 'Le', rate: 13.4}, '220': {symbol: 'D', rate: 0.041},
    '231': {symbol: '$', rate: 0.00061}, '228': {symbol: 'CFA', rate: 0.37},
    '229': {symbol: 'CFA', rate: 0.37}, '226': {symbol: 'CFA', rate: 0.37},
    '223': {symbol: 'CFA', rate: 0.37}, '227': {symbol: 'CFA', rate: 0.37},
    '225': {symbol: 'CFA', rate: 0.37}, '236': {symbol: 'CFA', rate: 0.37},
    '61': {symbol: 'A$', rate: 0.00094}, '64': {symbol: 'NZ$', rate: 0.001},
  }
  const selectedCurrency = countryCurrencyMap[selectedCountry.dial] || {symbol: '$', rate: 0.00061}
  const sampleProducts = rawSampleItems.map(p => {
    if (selectedCurrency.symbol === '₦') return p
    // prices stored in kobo (smallest unit) — divide by 100 to get Naira, then convert
    const nairaValue = p.price / 100
    const converted = nairaValue * selectedCurrency.rate
    const rounded = converted >= 1000 ? Math.round(converted/100)*100 :
                    converted >= 100 ? Math.round(converted/10)*10 :
                    converted >= 10 ? Math.round(converted) :
                    Math.round(converted * 10) / 10 || 1
    return { ...p, price: Math.round(converted), price_display: `${selectedCurrency.symbol}${rounded.toLocaleString()}` }
  })
  const normalizedWa = normalizeNumber(whatsappRaw, selectedCountry.dial)

  const generatingSteps = businessType === 'services' ? [
    pid ? 'We dey create your business page...' : 'Creating your business page...',
    pid ? 'We dey set up your services...' : 'Setting up your services...',
    pid ? 'We dey configure your WhatsApp booking...' : 'Configuring your WhatsApp booking button...',
    pid ? 'We dey save your business details...' : 'Saving your business details...',
    pid ? 'E almost ready...' : 'Almost ready...',
  ] : [
    pid ? 'We dey create your shop design...' : 'Creating your store design...',
    pid ? 'We dey set up your product catalogue...' : 'Setting up your product catalogue...',
    pid ? 'We dey configure your WhatsApp order button...' : 'Configuring your WhatsApp order button...',
    pid ? 'We dey save your business details...' : 'Saving your business details...',
    pid ? 'E almost ready...' : 'Almost ready...',
  ]

  const prevStep: Record<string, Step> = {
    business: 'language', whatsapp: 'business', email: 'whatsapp',
    password: 'email', biztype: 'password', category: 'biztype',
    subcategory: 'category',
    location: businessType === 'services' ? 'subcategory' : 'category',
    theme: 'location',
    preview: 'theme',
    products: 'preview',
  }

  function toggleProduct(i: number) {
    setSelectedProducts(prev => { const next = new Set(prev); next.has(i) ? next.delete(i) : next.add(i); return next })
  }

  function toggleSubcategory(id: string) {
    setSelectedSubcategories(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next })
  }

  function addCustomService() {
    addCustomServiceWithDescription(customServiceInput)
  }

  function removeCustomService(name: string) {
    setCustomServices(prev => prev.filter(x => x.name !== name))
  }

  function startVoice() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) { alert('Voice input not supported on this browser. Please type instead.'); return }
    const rec = new SR()
    rec.lang = 'en-NG'; rec.continuous = false; rec.interimResults = false
    rec.onresult = (e: any) => {
      const t = e.results[0][0].transcript
      setCustomServiceInput(prev => prev ? prev + ', ' + t : t)
      setIsListening(false)
    }
    rec.onerror = () => setIsListening(false)
    rec.onend = () => setIsListening(false)
    recognitionRef.current = rec
    rec.start()
    setIsListening(true)
  }

  function stopVoice() { recognitionRef.current?.stop(); setIsListening(false) }

  // Common service suggestions per category for dropdown
  const SERVICE_SUGGESTIONS: Record<string, string[]> = {
    beauty_services: ['Deep Tissue Massage', 'Hot Stone Massage', 'Swedish Massage', 'Prenatal Massage', 'Couples Massage', 'Sports Massage', 'Aromatherapy Massage', 'Reflexology', 'Lash Lift', 'Lash Extensions', 'Microblading', 'Brazilian Wax', 'Hot Wax', 'Eyebrow Wax', 'Threading', 'Gele Tying', 'Balayage', 'Highlights', 'Keratin Treatment', 'Hair Colour', 'Gel Polish', 'Nail Art', 'Acrylic Nails', 'Dip Powder Nails', 'Beard Trim', 'Kids Haircut'],
    home_services: ['Roof Repair', 'False Ceiling', 'POP Ceiling', 'CCTV Installation', 'Intercom Installation', 'Borehole Drilling', 'Septic Tank Cleaning', 'Window Installation', 'Door Installation', 'Wallpaper Installation'],
    auto_services: ['Car Tinting', 'Wheel Alignment', 'Radiator Repair', 'AC Gas Recharge', 'Suspension Repair', 'Clutch Replacement', 'Gearbox Repair', 'Car Wrapping', 'Upholstery Repair'],
    events: ['Candy Cart', 'Photo Booth', 'Balloon Decoration', 'Chair & Table Rental', 'Generator Hire', 'Ushers & Protocol', 'Security Services', 'Makeup for Events'],
    digital_services: ['WhatsApp Business Setup', 'Website Design', 'Email Marketing', 'Video Editing', 'Content Writing', 'SEO Services', 'Branding Package', 'Business Card Design'],
    domestic: ['Fumigation', 'Carpet Cleaning', 'Window Cleaning', 'Upholstery Cleaning', 'Fridge Cleaning', 'Post-Construction Cleaning'],
    health_wellness: ['Blood Pressure Check', 'Blood Sugar Test', 'Antenatal Care', 'Weight Loss Programme', 'Yoga Classes', 'Pilates', 'Meditation Sessions'],
    transport: ['Interstate Travel', 'Charter Service', 'Event Shuttle', 'Haulage Service', 'Fuel Delivery'],
    education: ['SAT Prep', 'IELTS Preparation', 'Creative Writing', 'Drama & Acting', 'Art Classes', 'Dance Lessons'],
    agriculture: ['Crop Disease Diagnosis', 'Soil Testing', 'Crop Spraying', 'Animal Feed Supply', 'Greenhouse Setup'],
    coaching: ['Life Coaching Session', 'Business Strategy Session', 'Career Clarity Session', "Women's Empowerment Workshop", 'Group Coaching', 'Vision Board Workshop', 'Goal Setting Session', 'Accountability Coaching', 'Leadership Masterclass', 'Confidence Building Workshop', 'Public Speaking Training', 'Executive Coaching', 'Teen Mentorship Programme', 'Relationship Coaching', 'Money Mindset Coaching'],
    mental_wellness: ['1-on-1 Counselling Session', 'Stress Management Consultation', 'Mindfulness & Meditation Session', 'Grief Support Session', 'Anxiety Coaching', 'Burnout Recovery Programme', 'Self-Esteem Coaching', 'CBT Session', 'Emotional Wellbeing Check-in', 'Sleep Coaching'],
    childcare: ['Full-time Nanny Service', 'After-school Pickup & Care', 'Weekend Babysitting', 'Homework Help Sessions', 'Special Needs Childcare', 'Holiday Camp Care', 'Overnight Babysitting', 'Summer Holiday Care'],
    food_catering: ['Weekly Meal Prep', 'Home-cooked Meal Delivery', 'Office Lunch Catering', 'Birthday Party Catering', 'Diet Meal Plan (Weekly)', 'Custom Cake & Pastries', 'Private Chef for Dinner', 'Meal Subscription Service', 'Wedding Catering', 'Corporate Event Catering'],
  }

  function getServiceSuggestions(input: string): string[] {
    const all = SERVICE_SUGGESTIONS[category] || []
    if (!input.trim()) return all.slice(0, 8)
    const lower = input.toLowerCase()
    return all.filter(s => s.toLowerCase().includes(lower)).slice(0, 6)
  }

  async function handleCustomInputChange(val: string) {
    setCustomServiceInput(val)
    if (val.length >= 2) {
      const sugg = getServiceSuggestions(val)
      setSuggestions(sugg)
      setShowSuggestions(sugg.length > 0)
    } else if (val.length === 0) {
      setSuggestions(getServiceSuggestions(''))
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  async function addCustomServiceWithDescription(name: string) {
    const trimmed = name.trim()
    if (!trimmed || customServices.some(s => s.name === trimmed)) return
    setShowSuggestions(false)
    setCustomServiceInput('')
    setIsDescribing(true)
    try {
      const res = await fetch('/api/services/describe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed, category })
      })
      const data = await res.json()
      setCustomServices(prev => [...prev, {
        name: trimmed,
        description: data.description || `Professional ${trimmed} service.`,
        price: data.price || 1000000,
        price_display: data.price_display || `${selectedCurrency.symbol}${Math.round(1000000 * selectedCurrency.rate).toLocaleString()}`,
      }])
    } catch {
      setCustomServices(prev => [...prev, {
        name: trimmed,
        description: `Professional ${trimmed} service. Contact us via WhatsApp to book.`,
        price: 1000000,
        price_display: `${selectedCurrency.symbol}${Math.round(1000000 * selectedCurrency.rate).toLocaleString()}`,
      }])
    }
    setIsDescribing(false)
  }

  function getFilteredServices() {
    const allServices = getSampleServices(category, selectedCountry.code)

    // Build custom entries first so we can dedup against them too
    const customEntries = customServices.map(s => ({
      name: s.name,
      description: s.description,
      price: s.price,
      price_display: s.price_display,
      in_stock: true,
      image_url: getCustomServiceImage(s.name),
    }))

    if (selectedSubcategories.size === 0 && customServices.length === 0) {
      return allServices.slice(0, 8) // cap at 8 for a clean page
    }

    // Pull from subcategory-specific libraries — take max 5 per subcategory
    const subcatServices: typeof allServices = []
    selectedSubcategories.forEach(id => {
      const specific = getSampleServicesBySubcategory(id, selectedCountry.code)
      if (specific.length > 0) {
        subcatServices.push(...specific.slice(0, 5))
      } else {
        // Fallback: keyword filter from category library
        const keywords = SUBCATEGORY_SERVICE_MAP[id] || []
        allServices
          .filter(s => keywords.some(kw => s.name.toLowerCase().includes(kw.toLowerCase())))
          .slice(0, 5)
          .forEach(s => subcatServices.push(s))
      }
    })

    // Strict dedup by normalised name
    const seen = new Set<string>()
    const deduped = subcatServices.filter(s => {
      const key = s.name.toLowerCase().replace(/[^a-z0-9]/g, '')
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })

    // Combine: subcategory services + custom entries, cap at 12 total
    const combined = [...(deduped.length > 0 ? deduped : allServices.slice(0, 6)), ...customEntries]
    return combined.slice(0, 12)
  }

  function getCustomServiceImage(name: string): string {
    const n = name.toLowerCase()
    if (n.includes('wax') || n.includes('brazilian') || n.includes('bikini')) return 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&q=80'
    if (n.includes('massage') || n.includes('tissue') || n.includes('stone')) return 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80'
    if (n.includes('facial') || n.includes('skin') || n.includes('glow')) return 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&q=80'
    if (n.includes('nail') || n.includes('manicure') || n.includes('pedicure')) return 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=80'
    if (n.includes('hair') || n.includes('braid') || n.includes('wig')) return 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80'
    if (n.includes('makeup') || n.includes('lash') || n.includes('brow')) return 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&q=80'
    if (n.includes('barber') || n.includes('cut') || n.includes('shave')) return 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80'
    return 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80'
  }

  async function handleGenerate() {
    setStep('generating')
    setGenStep(0)
    const slug = slugify(businessName) + '-' + Math.random().toString(36).slice(2, 6)
    for (let i = 0; i < generatingSteps.length; i++) {
      await new Promise(r => setTimeout(r, 700))
      setGenStep(i + 1)
    }
    const { data: existingList } = await supabase.from('merchants').select('slug, email, phone')
      .or(`email.eq.${email},phone.eq.${normalizedWa}`).limit(1)
    if (existingList?.[0]) { setStoreSlug(existingList[0].slug); setAlreadyExists(true); setStep('done'); return }
    try {
      await supabase.auth.signUp({ email, password })
      const { data: newMerchant, error: insertError } = await supabase.from('merchants').insert({
        business_name: businessName, owner_name: ownerName, slug, category, location,
        country: selectedCountry.code,
        whatsapp_number: normalizedWa, email, phone: normalizedWa,
        language: lang, business_type: businessType || 'products',
        theme_color: selectedTheme.primary,
        theme_preset: selectedTheme.id,
        plan: 'free', is_active: true, login_pin: password,
      }).select('id').single()

      if (!insertError && newMerchant) {
        if (businessType === 'services') {
          const filtered = getFilteredServices()
          const items = filtered.map(s => {
            if (selectedCurrency.symbol === '₦') return { ...s, merchant_id: newMerchant.id }
            const converted = Math.round(s.price * selectedCurrency.rate)
            const rounded = converted >= 1000 ? Math.floor(converted/500)*500 : converted >= 100 ? Math.floor(converted/50)*50 : Math.floor(converted/5)*5 || 1
            return { ...s, price: rounded, price_display: `${selectedCurrency.symbol}${rounded.toLocaleString()}`, merchant_id: newMerchant.id }
          })
          if (items.length > 0) await supabase.from('products').insert(items)
        } else if (selectedProducts.size > 0) {
          const chosen = sampleProducts.filter((_, i) => selectedProducts.has(i)).map(p => ({ ...p, merchant_id: newMerchant.id }))
          await supabase.from('products').insert(chosen)
        }
      }
      setStoreSlug(slug)
    } catch (e) { console.error('Save error:', e); setStoreSlug(slug) }
    setStep('done')
  }

  async function sendLoginEmail() {
    await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/auth/callback` } })
    setLoginSent('email')
  }

  function sendLoginWhatsApp() {
    const storeUrl = `https://earket.com/store/${storeSlug}`
    const dashboardUrl = `${window.location.origin}/dashboard`
    const isPidgin = lang === 'pid'
    const msg = isPidgin ? [
      `🎉 Your Earket shop don go live!`,
      ``,
      `🔗 Your shop link:`,
      storeUrl,
      ``,
      `——— DO THESE 3 THINGS NOW ———`,
      ``,
      `1️⃣ UPLOAD YOUR REAL PHOTOS`,
      `The photos wey dey for your shop now na sample only.`,
      `How to change am:`,
      `• Open your dashboard (link below)`,
      `• Tap any product`,
      `• Tap “Edit”`,
      `• Tap the image → Upload your photo`,
      `• Tap Save`,
      ``,
      `2️⃣ FIX YOUR PRICES`,
      `Check say all your prices correct.`,
      `How to change am:`,
      `• Tap any product → Edit`,
      `• Change the price`,
      `• Tap Save`,
      ``,
      `3️⃣ SHARE YOUR SHOP LINK`,
      `Copy your shop link and send am to your customers on WhatsApp:`,
      storeUrl,
      ``,
      `———————————————————`,
      `🔑 Your dashboard (manage your shop):`,
      dashboardUrl,
      `Login email: ${email}`,
    ].join('\n') : [
      `🎉 Your Earket store is now live!`,
      ``,
      `🔗 Your store link:`,
      storeUrl,
      ``,
      `——— 3 IMPORTANT NEXT STEPS ———`,
      ``,
      `1️⃣ UPLOAD YOUR OWN PRODUCT PHOTOS`,
      `The images in your store are sample placeholders.`,
      `Here is how to replace them:`,
      `• Open your dashboard (link below)`,
      `• Tap any product`,
      `• Tap “Edit”`,
      `• Tap the image → Upload your photo`,
      `• Tap Save`,
      ``,
      `2️⃣ UPDATE YOUR PRICES`,
      `Check that all prices are correct for your market.`,
      `How to update:`,
      `• Tap any product → Edit`,
      `• Change the price`,
      `• Tap Save`,
      ``,
      `3️⃣ SHARE YOUR STORE WITH CUSTOMERS`,
      `Copy your store link and send it to customers on WhatsApp:`,
      storeUrl,
      ``,
      `———————————————————`,
      `🔑 Your dashboard (manage your store):`,
      dashboardUrl,
      `Login email: ${email}`,
    ].join('\n')
    window.open(`https://wa.me/${normalizedWa}?text=${encodeURIComponent(msg)}`, '_blank')
    setLoginSent('whatsapp')
  }

  async function handleNext() {
    setError('')
    if (step === 'business') {
      if (!businessName.trim()) { setError(pid ? 'Abeg enter your business name' : 'Please enter your business name'); return }
      setStep('whatsapp')
    } else if (step === 'whatsapp') {
      const digits = whatsappRaw.replace(/\D/g, '')
      if (!digits) { setError(pid ? 'Abeg enter your WhatsApp number' : 'Please enter your WhatsApp number'); return }
      const PHONE_RULES: Record<string, {min:number;max:number}> = {
        '234': {min:10,max:11}, // Nigeria
        '1':   {min:10,max:10}, // US/Canada
        '44':  {min:10,max:11}, // UK
        '233': {min:9, max:10}, // Ghana
        '254': {min:9, max:10}, // Kenya
        '27':  {min:9, max:10}, // South Africa
        '255': {min:9, max:10}, // Tanzania
        '256': {min:9, max:10}, // Uganda
        '250': {min:9, max:9},  // Rwanda
        '251': {min:9, max:10}, // Ethiopia
        '221': {min:9, max:9},  // Senegal
        '237': {min:9, max:9},  // Cameroon
        '225': {min:10,max:10}, // CÃ´te d'Ivoire
        '20':  {min:10,max:11}, // Egypt
        '212': {min:9, max:10}, // Morocco
        '91':  {min:10,max:10}, // India
        '92':  {min:10,max:11}, // Pakistan
        '880': {min:10,max:11}, // Bangladesh
        '60':  {min:9, max:11}, // Malaysia
        '63':  {min:10,max:11}, // Philippines
        '62':  {min:9, max:13}, // Indonesia
        '55':  {min:10,max:11}, // Brazil
        '52':  {min:10,max:10}, // Mexico
        '61':  {min:9, max:9},  // Australia
        '49':  {min:10,max:12}, // Germany
        '33':  {min:9, max:10}, // France
        '971': {min:9, max:9},  // UAE
        '966': {min:9, max:9},  // Saudi Arabia
        '243': {min:9, max:10}, // DR Congo
        '263': {min:9, max:10}, // Zimbabwe
      }
      const rule = PHONE_RULES[selectedCountry.dial] || {min:7, max:15}
      if (digits.length < rule.min) { setError(`Please enter a valid ${selectedCountry.name} number (${rule.min} digits)`); return }
      if (digits.length > rule.max) { setError(`Too many digits for ${selectedCountry.name} (max ${rule.max})`); return }
      // Check if WhatsApp number already registered
      const { data: existingWa } = await supabase.from('merchants').select('id').eq('phone', normalizedWa).maybeSingle()
      if (existingWa) { setError(pid ? 'This WhatsApp number don already dey. Abeg use another number.' : 'This WhatsApp number is already registered. Please use a different number.'); return }
      setStep('email')
    } else if (step === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/; if (!email.trim() || !emailRegex.test(email.trim())) { setError(pid ? 'Abeg enter valid email (e.g. name@gmail.com)' : 'Please enter a valid email address (e.g. name@gmail.com)'); return }
      const { data: existing } = await supabase.from('merchants').select('id, slug').eq('email', email.toLowerCase()).maybeSingle()
      if (existing) { setError(pid ? 'This email don already dey. Abeg use another email.' : 'This email is already registered. Please use a different email.'); return }
      setStep('password')
    } else if (step === 'password') {
      if (password.length < 4) { setError(pid ? 'Abeg enter at least 4 characters' : 'Password must be at least 4 characters'); return }
      setStep('biztype')
    } else if (step === 'biztype') {
      if (!businessType) { setError('Please select your business type'); return }
      setStep('category')
    } else if (step === 'category') {
      if (!category) { setError(pid ? 'Abeg select your category' : 'Please select a category'); return }
      setStep(businessType === 'services' ? 'subcategory' : 'location')
    } else if (step === 'subcategory') {
      setStep('location')
    } else if (step === 'location') {
      const finalLocation = location || customCity
      if (!finalLocation) { setError(pid ? 'Abeg select your city' : 'Please select or enter your city'); return }
      if (!location && customCity) setLocation(customCity)
      const { data: dupName } = await supabase.from('merchants').select('id').ilike('business_name', businessName.trim()).ilike('location', location).maybeSingle()
      if (dupName) {
        setError(pid ? `"${businessName}" don already exist for ${location}. Abeg choose different name.` : `"${businessName}" already exists in ${location}. Please choose a different business name.`)
        setStep('business'); return
      }
      // Always go to theme selection after location
      setStep('theme')
    } else if (step === 'theme') {
      // Always preview before generating
      if (businessType !== 'services') {
        setSelectedProducts(new Set(getSampleProducts(category, selectedCountry.code).map((_, i) => i)))
      }
      setStep('preview')
    } else if (step === 'preview') {
      handleGenerate()
    } else if (step === 'products') {
      handleGenerate()
    }
  }

  const stepsList = businessType === 'services'
    ? ['business', 'whatsapp', 'email', 'password', 'biztype', 'category', 'subcategory', 'location', 'theme', 'preview']
    : ['business', 'whatsapp', 'email', 'password', 'biztype', 'category', 'location', 'theme', 'preview', 'products']

  const currentSubcats = SERVICE_SUBCATEGORIES[category] || []
  const totalSelected = selectedSubcategories.size + customServices.length

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-light to-white flex flex-col">
      <nav className="px-4 h-14 flex items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-brand-green rounded-lg flex items-center justify-center">
            <ShoppingBag size={14} className="text-white" />
          </div>
          <span className="font-display font-bold text-brand-dark text-base">Earket</span>
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">

          {!['generating', 'done', 'language'].includes(step) && (
            <StepIndicator current={stepsList.indexOf(step)} total={stepsList.length} />
          )}

          {step === 'language' && (
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 bg-brand-green rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-green/20">
                <ShoppingBag size={28} className="text-white" />
              </div>
              <h1 className="font-display text-2xl font-bold text-brand-dark mb-2">Let's build your business</h1>
              <p className="text-gray-500 text-sm mb-8">Answer a few quick questions. Your page will be live in minutes.</p>
              <div className="space-y-3">
                {([
                  { code: 'en' as const, label: 'English', sub: 'Continue in English' },
                  { code: 'pid' as const, label: 'Pidgin English', sub: 'I wan use Pidgin' },
                ]).map(l => (
                  <button key={l.code} onClick={() => { setLang(l.code); setStep('business') }}
                    className="w-full flex items-center justify-between bg-white border-2 border-gray-200 hover:border-brand-green rounded-2xl p-4 transition-all group">
                    <div className="text-left">
                      <div className="font-display font-bold text-brand-dark">{l.label}</div>
                      <div className="text-xs text-gray-400">{l.sub}</div>
                    </div>
                    <ArrowRight size={18} className="text-gray-300 group-hover:text-brand-green transition-colors" />
                  </button>
                ))}
                <p className="text-xs text-gray-400 text-center pt-2">More languages coming soon Â· French, Spanish, Arabic, Swahili</p>
              </div>
            </div>
          )}

          {step === 'business' && (
            <div className="animate-fade-in">
              <h2 className="font-display text-xl font-bold text-brand-dark mb-1">
                {pid ? 'Wetin be your business name?' : 'What is your business name?'}
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                {pid ? 'This go be the name wey customers go see.' : 'This is what customers will see on your page.'}
              </p>
              <input type="text" placeholder="e.g. JB Solar Installation" value={businessName}
                onChange={e => { setBusinessName(e.target.value); setError('') }}
                onKeyDown={e => e.key === 'Enter' && handleNext()} autoFocus
                className="w-full border-2 border-gray-200 focus:border-brand-green rounded-2xl px-4 py-4 text-brand-dark font-display font-bold text-lg outline-none transition-colors" />
              <p className="text-gray-500 text-sm mt-5 mb-2">
                {pid ? 'Wetin be your full name?' : "Business owner's full name"}
              </p>
              <input type="text" placeholder="e.g. James Bond" value={ownerName}
                onChange={e => { setOwnerName(e.target.value); setError('') }}
                onKeyDown={e => e.key === 'Enter' && handleNext()}
                className="w-full border-2 border-gray-200 focus:border-brand-green rounded-2xl px-4 py-4 text-brand-dark font-display font-bold text-lg outline-none transition-colors" />
              {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
            </div>
          )}

          {step === 'whatsapp' && (
            <div className="animate-fade-in">
              <h2 className="font-display text-xl font-bold text-brand-dark mb-1">Your WhatsApp business number?</h2>
              <p className="text-gray-500 text-sm mb-6">
                {pid ? 'Customers go contact you on this number' : 'Customers will contact you on this number'}
              </p>
              <div className="flex gap-2 mb-2">
                <button onClick={() => setShowCountryPicker(!showCountryPicker)}
                  className="flex items-center gap-1.5 bg-white border-2 border-gray-200 rounded-2xl px-3 py-4 text-sm font-semibold hover:border-brand-green transition-colors shrink-0">
                  <img src={`https://flagcdn.com/20x15/${selectedCountry.code.toLowerCase()}.png`}
                    alt={selectedCountry.name} className="w-5 h-4 object-cover rounded-sm"
                    onError={e => { (e.target as HTMLImageElement).style.display='none' }} />
                  <span className="text-gray-600 text-sm font-semibold">+{selectedCountry.dial}</span>
                </button>
                <input type="tel" inputMode="numeric" placeholder="Phone number" value={whatsappRaw}
                  onChange={e => { setWhatsappRaw(e.target.value.replace(/[^0-9+]/g, '')); setError('') }}
                  onKeyDown={e => e.key === 'Enter' && handleNext()} autoFocus
                  className="flex-1 border-2 border-gray-200 focus:border-brand-green rounded-2xl px-4 py-4 text-brand-dark font-display font-bold text-lg outline-none transition-colors" />
              </div>
              {showCountryPicker && (
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg mb-2">
                  <div className="p-2 border-b border-gray-100">
                    <input
                      type="text"
                      placeholder="Search country..."
                      value={countrySearch}
                      onChange={e => setCountrySearch(e.target.value)}
                      autoFocus
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-brand-green"
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {(() => {
                      const priority = ['NG','GH','KE','ZA','SN','CI','CM','US','GB','CA','AE']
                      const priorityCountries = priority.map(code => COUNTRIES.find(c => c.code === code)).filter(Boolean) as typeof COUNTRIES
                      const rest = [...COUNTRIES].filter(c => !priority.includes(c.code) && c.code !== 'OTHER').sort((a,b) => a.name.localeCompare(b.name))
                      const all = [...priorityCountries, ...rest, ...COUNTRIES.filter(c => c.code === 'OTHER')]
                      const filtered = countrySearch === '' ? all : all.filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase()) || c.dial.includes(countrySearch))
                      return filtered
                    })().map(c => (
                        <button key={c.code} onClick={() => { setSelectedCountry(c); setShowCountryPicker(false); setCountrySearch('') }}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 ${selectedCountry.code === c.code ? 'bg-brand-light text-brand-green font-semibold' : 'text-gray-700'}`}>
                          <img src={`https://flagcdn.com/20x15/${c.code.toLowerCase()}.png`}
                            alt={c.name} className="w-5 h-4 object-cover rounded-sm shrink-0"
                            onError={e => { (e.target as HTMLImageElement).style.display='none' }} />
                          <span className="flex-1 text-left">{c.name}</span>
                          <span className="text-gray-400 text-xs">+{c.dial}</span>
                        </button>
                    ))}
                  </div>
                </div>
              )}
              {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
              <p className="text-xs text-gray-400 mt-2">âš ï¸ Make sure this number is active on WhatsApp</p>
            </div>
          )}

          {step === 'email' && (
            <div className="animate-fade-in">
              <h2 className="font-display text-xl font-bold text-brand-dark mb-1">Your email address?</h2>
              <p className="text-gray-500 text-sm mb-6">{pid ? 'We go use this to send you login link' : 'We use this to send your login link'}</p>
              <input type="email" placeholder="you@example.com" value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
                onKeyDown={e => e.key === 'Enter' && handleNext()} autoFocus
                className="w-full border-2 border-gray-200 focus:border-brand-green rounded-2xl px-4 py-4 text-brand-dark font-semibold text-lg outline-none transition-colors" />
              {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

            </div>
          )}

          {step === 'password' && (
            <div className="animate-fade-in">
              <h2 className="font-display text-xl font-bold text-brand-dark mb-1">Set your password</h2>
              <p className="text-gray-500 text-sm mb-6">{pid ? 'You go use this to login anytime' : 'You will use this to log in to your dashboard anytime'}</p>
              <div className="relative">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} placeholder="Enter password" value={password}
                  onChange={e => { setPassword(e.target.value); setError('') }}
                  onKeyDown={e => e.key === 'Enter' && handleNext()} autoFocus autoComplete="new-password"
                  className="w-full border-2 border-gray-200 focus:border-brand-green rounded-2xl pl-10 pr-12 py-4 text-brand-dark font-semibold text-lg outline-none transition-colors" />
                <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
              <p className="text-xs text-gray-400 mt-3">🔐 {pid ? 'Minimum 4 characters. Save am well well.' : 'Minimum 4 characters. Keep it safe.'}</p>
            </div>
          )}

          {step === 'biztype' && (
            <div className="animate-fade-in">
              <h2 className="font-display text-xl font-bold text-brand-dark mb-2">
                {pid ? 'Wetin you dey do?' : 'Choose your business type'}
              </h2>
              <p className="text-gray-500 text-sm mb-6">{pid ? 'You dey sell things or you dey offer service?' : 'Are you selling products or offering a service?'}</p>
              <div className="space-y-3">
                <button onClick={() => setBusinessType('products')}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${businessType === 'products' ? 'border-brand-green bg-brand-light' : 'border-gray-200 bg-white'}`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${businessType === 'products' ? 'bg-brand-green/15' : 'bg-gray-100'}`}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={businessType === 'products' ? '#1a7a4a' : '#6b7280'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg></div>
                  <div className="text-left">
                    <p className="font-display font-bold text-brand-dark">{pid ? 'I dey sell products' : 'I sell products'}</p>
                    <p className="text-xs text-gray-500">Food, clothing, electronics, groceries etc.</p>
                  </div>
                </button>
                <button onClick={() => setBusinessType('services')}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${businessType === 'services' ? 'border-brand-green bg-brand-light' : 'border-gray-200 bg-white'}`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${businessType === 'services' ? 'bg-brand-green/15' : 'bg-gray-100'}`}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={businessType === 'services' ? '#1a7a4a' : '#6b7280'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg></div>
                  <div className="text-left">
                    <p className="font-display font-bold text-brand-dark">{pid ? 'I dey offer service' : 'I offer a service'}</p>
                    <p className="text-xs text-gray-500">Repairs, beauty, tutoring, events, delivery etc.</p>
                  </div>
                </button>
              </div>
              {error && <p className="text-red-500 text-xs mt-3">{error}</p>}
            </div>
          )}

          {step === 'category' && (
            <div className="animate-fade-in">
              <h2 className="font-display text-xl font-bold text-brand-dark mb-6">
                {businessType === 'services' ? (pid ? 'Wetin service you dey offer?' : 'What type of service do you offer?') : (pid ? 'Wetin you dey sell?' : 'What do you sell?')}
              </h2>
              <div className={businessType === 'services' ? "grid grid-cols-2 gap-2" : "grid grid-cols-2 gap-2"}>
                {(businessType === 'services' ? SERVICE_CATEGORIES : CATEGORIES).map(cat => (
                  <button key={cat.id} onClick={() => { setCategory(cat.id); setSelectedSubcategories(new Set()) }}
                    className={`flex items-center gap-2.5 p-3 rounded-2xl border-2 text-left transition-all ${category === cat.id ? 'border-brand-green bg-brand-light text-brand-green' : 'border-gray-200 text-gray-600 hover:border-brand-green/50'}`}>
                    <span className="text-2xl shrink-0">{cat.emoji}</span>
                    <span className="text-sm font-bold leading-tight">{pid ? cat.pidgin : cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'subcategory' && (
            <div className="animate-fade-in">
              <h2 className="font-display text-xl font-bold text-brand-dark mb-1">
                {pid ? 'Which service you dey offer?' : 'What specifically do you offer?'}
              </h2>
              <p className="text-gray-500 text-sm mb-4">
                {pid ? 'Tick all wey apply. You fit add your own too.' : 'Tick everything that applies. Add your own below.'}
              </p>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1 mb-4 rounded-xl border border-gray-100 p-2 bg-gray-50/50">
                {currentSubcats.map(sub => (
                  <button key={sub.id} onClick={() => toggleSubcategory(sub.id)}
                    className={`w-full flex items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-left transition-all ${selectedSubcategories.has(sub.id) ? 'border-brand-green bg-brand-light' : 'border-gray-200 bg-white hover:border-brand-green/40'}`}>
                    <span className="text-lg shrink-0">{sub.emoji}</span>
                    <span className="flex-1 text-sm font-semibold text-gray-800">{sub.label}</span>
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${selectedSubcategories.has(sub.id) ? 'bg-brand-green border-brand-green' : 'border-gray-300'}`}>
                      {selectedSubcategories.has(sub.id) && (
                        <svg viewBox="0 0 12 10" className="w-3 h-3">
                          <path d="M1 5l3 4L11 1" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {(SERVICE_SUBCATEGORIES[category] || []).length > 4 && (
                <p className="text-xs text-gray-400 text-center -mt-2 mb-3 flex items-center justify-center gap-1">
                  <span>â†•</span> Scroll to see all options
                </p>
              )}
              {customServices.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {customServices.map(s => (
                    <span key={s.name} className="flex items-center gap-1.5 bg-brand-green text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                      {s.name}
                      <button onClick={() => removeCustomService(s.name)} className="hover:opacity-70"><X size={12} /></button>
                    </span>
                  ))}
                </div>
              )}

              <div className="border-2 border-dashed border-gray-200 rounded-xl p-3">
                <p className="text-xs font-semibold text-gray-500 mb-2">
                  {pid ? 'âž• Add service wey no dey above' : 'âž• Add a service not listed above'}
                </p>
                <div className="relative">
                  <div className="flex gap-2">
                    <input type="text" value={customServiceInput}
                      onChange={e => handleCustomInputChange(e.target.value)}
                      onFocus={() => { setSuggestions(getServiceSuggestions(customServiceInput)); setShowSuggestions(true) }}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomService() } }}
                      placeholder="e.g. Hot Stone Massage — or pick below"
                      className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-brand-green" />
                    <button onClick={isListening ? stopVoice : startVoice}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-500 hover:bg-brand-light hover:text-brand-green'}`}>
                      {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                    </button>
                    <button onClick={addCustomService} disabled={!customServiceInput.trim() || isDescribing}
                      className="w-9 h-9 rounded-xl bg-brand-green text-white flex items-center justify-center shrink-0 disabled:opacity-30">
                      {isDescribing ? <Loader2 size={14} className="animate-spin" /> : <Plus size={16} />}
                    </button>
                  </div>
                  {/* Smart suggestions dropdown */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-40 overflow-y-auto">
                      {suggestions.map(sugg => (
                        <button key={sugg} onMouseDown={() => addCustomServiceWithDescription(sugg)}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-brand-light hover:text-brand-green flex items-center gap-2 transition-colors">
                          <span className="text-base">âœ¨</span>
                          {sugg}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {isDescribing && (
                  <p className="text-xs text-brand-green font-medium mt-1.5 flex items-center gap-1">
                    <span className="w-2 h-2 bg-brand-green rounded-full animate-pulse inline-block" />
                    Writing a professional description for you...
                  </p>
                )}
                {isListening && (
                  <p className="text-xs text-red-500 font-medium mt-1.5 flex items-center gap-1">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse inline-block" />
                    {pid ? 'We dey listen... speak now' : 'Listening... speak now'}
                  </p>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-3 text-center">
                {pid ? "If you no select anything, we go add all services for you" : "Don't tick anything? We'll add all services for you"}
              </p>
            </div>
          )}

          {step === 'location' && (
            <div className="animate-fade-in">
              <h2 className="font-display text-xl font-bold text-brand-dark mb-2">
                {pid ? 'Where your business dey?' : 'Where is your business located?'}
              </h2>
              <div className="flex items-center gap-2 mb-4">
                <img src={`https://flagcdn.com/20x15/${selectedCountry.code.toLowerCase()}.png`}
                  alt={selectedCountry.name} className="w-5 h-4 object-cover rounded-sm" />
                <p className="text-xs text-gray-500">
                  {location && !showOtherCity
                    ? <><span className="font-semibold text-gray-700">{location}, {selectedCountry.name}</span> — tap another city to change</>
                    : <>Showing cities in <span className="font-semibold text-gray-700">{selectedCountry.name}</span></>}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[...(COUNTRY_LIST.find(c => c.code === selectedCountry.code)?.cities || ['Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan', 'Benin City']), 'Other'].map(loc => (
                  <button key={loc} onMouseDown={e => e.preventDefault()} onClick={() => { if (loc === 'Other') { setLocation(''); setShowOtherCity(true); } else { setLocation(loc); setShowOtherCity(false); } }}
                    className={`py-2.5 px-3 rounded-xl border-2 text-xs font-semibold transition-all ${(loc === 'Other' ? showOtherCity : location === loc) ? 'border-brand-green bg-brand-light text-brand-green' : 'border-gray-200 text-gray-600 hover:border-brand-green/50'}`}>
                    {loc}
                  </button>
                ))}
              </div>
              {location === '' && (
                <input type="text" defaultValue=""
                  onChange={e => setCustomCity(e.target.value)}
                  onBlur={e => setLocation(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { setLocation((e.target as HTMLInputElement).value); (e.target as HTMLInputElement).blur() } }}
                  placeholder="Type your city or town — press Enter when done"
                  className="mt-3 w-full border-2 border-brand-green rounded-xl px-4 py-3 text-sm focus:outline-none" />
              )}
            </div>
          )}


          {/* Theme picker step */}
          {step === 'theme' && (
            <div className="animate-fade-in">
              <h2 className="font-display text-xl font-bold text-brand-dark mb-1">
                {pid ? 'Choose your brand colour' : 'Choose your brand theme'}
              </h2>
              <p className="text-gray-500 text-sm mb-5">
                {pid ? 'Pick the colour wey go fit your business. You fit change am later.' : 'Pick a theme that fits your business. You can change it anytime.'}
              </p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {EARKET_THEMES.map(theme => (
                  <button key={theme.id} onClick={() => setSelectedTheme(theme)}
                    className={`relative rounded-2xl overflow-hidden border-2 transition-all ${
                      selectedTheme.id === theme.id ? 'border-brand-green scale-105 shadow-lg' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                    {/* Colour preview bar */}
                    <div className="h-10 w-full" style={getThemeStyle(theme)} />
                    {/* Theme name */}
                    <div className="bg-white px-2 py-1.5 text-center">
                      <p className="text-xs font-semibold text-gray-700 leading-tight">{theme.emoji} {theme.name}</p>
                      <p className="text-xs text-gray-400 leading-tight truncate">{theme.bestFor.split(',')[0]}</p>
                    </div>
                    {selectedTheme.id === theme.id && (
                      <div className="absolute top-1 right-1 w-5 h-5 bg-brand-green rounded-full flex items-center justify-center">
                        <svg viewBox="0 0 12 10" className="w-3 h-3"><path d="M1 5l3 4L11 1" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              {/* Selected theme preview */}
              <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                <div className="h-16 flex items-center px-4 gap-3" style={getThemeStyle(selectedTheme)}>
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">🛍</div>
                  <div>
                    <p className="font-display font-bold text-sm" style={{ color: selectedTheme.textOnPrimary }}>{businessName || 'Your Business'}</p>
                    <p className="text-xs opacity-70" style={{ color: selectedTheme.textOnPrimary }}>{location || 'Your City'}</p>
                  </div>
                </div>
                <div className="bg-white px-4 py-2 flex items-center justify-between">
                  <span className="text-xs text-gray-500">{selectedTheme.name} theme</span>
                  <span className="text-xs text-gray-400">Can be changed in Settings</span>
                </div>
              </div>
            </div>
          )}


          {/* Preview before publish */}
          {step === 'preview' && (
            <div className="animate-fade-in">
              <h2 className="font-display text-xl font-bold text-brand-dark mb-1">
                {pid ? 'See wetin your page go look like' : "Here's your business page preview"}
              </h2>
              <p className="text-gray-500 text-sm mb-4">
                {pid ? 'E go look like dis. You fit change everything later.' : 'This is how customers will see your page. You can edit everything after publishing.'}
              </p>

              {/* Mini store preview card */}
              <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-md mb-4">
                {/* Hero preview */}
                <div className="h-24 flex items-center px-4 gap-3 relative overflow-hidden" style={getThemeStyle(selectedTheme)}>
                  <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: 'radial-gradient(circle at 30% 50%, white 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }} />
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shrink-0 shadow-lg relative z-10">🛍</div>
                  <div className="relative z-10">
                    <p className="font-display font-bold text-base leading-tight" style={{ color: selectedTheme.textOnPrimary }}>{businessName}</p>
                    <p className="text-xs opacity-70 mt-0.5" style={{ color: selectedTheme.textOnPrimary }}>{location} Â· {selectedTheme.name} theme</p>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" />
                      <span className="text-xs opacity-80" style={{ color: selectedTheme.textOnPrimary }}>Open for bookings</span>
                    </div>
                  </div>
                </div>
                {/* Services preview */}
                <div className="bg-white p-3">
                  <p className="text-xs font-semibold text-gray-500 mb-2">
                    {businessType === 'services'
                      ? `${getFilteredServices().length} services will be added`
                      : `${selectedProducts.size} products selected`}
                  </p>
                  <div className="space-y-1.5">
                    {(businessType === 'services' ? getFilteredServices().slice(0, 3) : sampleProducts.filter((_, i) => selectedProducts.has(i)).slice(0, 3)).map((item, i) => (
                      <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg px-2.5 py-1.5">
                        {item.image_url && <img src={item.image_url} alt="" className="w-7 h-7 rounded-lg object-cover shrink-0" />}
                        <span className="text-xs font-medium text-gray-700 flex-1 truncate">{item.name}</span>
                        <span className="text-xs font-bold" style={{ color: selectedTheme.primary }}>{item.price_display}</span>
                      </div>
                    ))}
                    {(businessType === 'services' ? getFilteredServices() : sampleProducts.filter((_, i) => selectedProducts.has(i))).length > 3 && (
                      <p className="text-xs text-gray-400 text-center py-1">
                        + {(businessType === 'services' ? getFilteredServices() : sampleProducts.filter((_, i) => selectedProducts.has(i))).length - 3} more services
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Change options */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button onClick={() => setStep('theme')}
                  className="flex items-center justify-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100">
                  🎨 Change Theme
                </button>
                <button onClick={() => setStep(businessType === 'services' ? 'subcategory' : 'products')}
                  className="flex items-center justify-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100">
                  ✏️ Edit Services
                </button>
              </div>

              <p className="text-xs text-gray-400 text-center mb-2">
                📸 Images are placeholders — you can upload your own photos after publishing
              </p>
            </div>
          )}

          {step === 'products' && (
            <div className="animate-fade-in">
              <h2 className="font-display text-xl font-bold text-brand-dark mb-1">Pick your starter products</h2>
              <p className="text-gray-500 text-sm mb-4">
                {pid ? 'Select products wey you want add. You fit edit them later.' : 'Select products to add. You can edit or replace them later.'}
              </p>
              <div className="flex gap-2 mb-3">
                <button onClick={() => setSelectedProducts(new Set(sampleProducts.map((_, i) => i)))}
                  className="text-xs font-semibold text-brand-green border border-brand-green/30 bg-brand-light px-3 py-1.5 rounded-xl">Select All</button>
                <button onClick={() => setSelectedProducts(new Set())}
                  className="text-xs font-semibold text-gray-500 border border-gray-200 px-3 py-1.5 rounded-xl">Clear All</button>
                <span className="ml-auto text-xs text-gray-400 self-center">{selectedProducts.size} selected</span>
              </div>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {sampleProducts.map((product, i) => (
                  <button key={i} onClick={() => toggleProduct(i)}
                    className={`w-full flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition-all ${selectedProducts.has(i) ? 'border-brand-green bg-brand-light' : 'border-gray-200 bg-white hover:border-brand-green/40'}`}>
                    <img src={product.image_url} alt={product.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-800 text-xs leading-tight truncate">{product.name}</div>
                      <div className="text-brand-green font-bold text-sm mt-0.5">{product.price_display}</div>
                    </div>
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${selectedProducts.has(i) ? 'bg-brand-green border-brand-green' : 'border-gray-300'}`}>
                      {selectedProducts.has(i) && (
                        <svg viewBox="0 0 12 10" className="w-3 h-3">
                          <path d="M1 5l3 4L11 1" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'generating' && (
            <div className="animate-fade-in text-center py-8">
              <div className="w-20 h-20 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader2 size={36} className="text-brand-green animate-spin" />
              </div>
              <h2 className="font-display text-2xl font-bold text-brand-dark mb-3">
                {pid ? 'We dey build your business page...' : 'Building your business page...'}
              </h2>
              <div className="space-y-2">
                {generatingSteps.map((s, i) => (
                  <div key={i} className={`flex items-center justify-center gap-2 text-sm transition-all duration-300 ${i < genStep ? 'text-brand-green' : i === genStep ? 'text-brand-dark font-medium' : 'text-gray-300'}`}>
                    {i < genStep ? <Check size={14} /> : i === genStep ? <Loader2 size={14} className="animate-spin" /> : <div className="w-3.5 h-3.5 rounded-full border border-gray-300" />}
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 'done' && (
            <div className="animate-fade-in text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg ${alreadyExists ? 'bg-brand-accent shadow-brand-accent/30' : 'bg-brand-green shadow-brand-green/30'}`}>
                <Check size={36} className="text-white" />
              </div>
              {alreadyExists && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5 text-left">
                  <p className="font-semibold text-amber-800 text-sm mb-1">{pid ? 'âš ï¸ You don already get shop!' : 'âš ï¸ You already have a business page!'}</p>
                  <p className="text-amber-700 text-xs">{pid ? 'This email or WhatsApp don already use.' : 'This email or WhatsApp is already linked to a business.'}</p>
                </div>
              )}
              <h2 className="font-display text-2xl font-bold text-brand-dark mb-2">
                {alreadyExists ? (pid ? 'Your shop dey here! 👋' : 'Welcome back! 👋') : (pid ? 'Your shop don go live! 🎉' : 'Your business is live! 🎉')}
              </h2>
              <div className="bg-brand-light border-2 border-brand-green/20 rounded-2xl p-4 mb-6">
                <p className="text-xs text-gray-500 mb-1">{pid ? 'Your shop link:' : 'Your business link:'}</p>
                <p className="font-display font-bold text-brand-green text-sm">earket.com/store/{storeSlug}</p>
                <p className="text-xs text-gray-400 mt-1">{pid ? 'This na your unique shop link — no be your name, na your shop unique address.' : 'This is your unique store address — not your name. This is your store\'s unique link on Earket.'}</p>
              </div>

              {/* Next Steps - shown only for new stores */}
              {!alreadyExists && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4 text-left">
                  <p className="font-bold text-amber-900 text-sm mb-3">
                    {pid ? '📸 Do these 3 things first:' : '📸 3 important next steps:'}
                  </p>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-amber-900 font-bold text-xs">1</span>
                      </div>
                      <div>
                        <p className="text-amber-900 font-semibold text-xs">
                          {pid ? 'Upload your real product photos' : 'Upload your own product photos'}
                        </p>
                        <p className="text-amber-700 text-xs mt-0.5">
                          {pid ? 'The photos wey dey now na sample. Go dashboard \u2192 tap product \u2192 Edit \u2192 upload your real photo.' : 'Photos shown are samples only. Go to dashboard \u2192 tap any product \u2192 Edit \u2192 upload your real photo.'}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-amber-900 font-bold text-xs">2</span>
                      </div>
                      <div>
                        <p className="text-amber-900 font-semibold text-xs">
                          {pid ? 'Check and fix your prices' : 'Review and update your prices'}
                        </p>
                        <p className="text-amber-700 text-xs mt-0.5">
                          {pid ? 'Make sure say your prices correct for your market. Dashboard \u2192 tap product \u2192 Edit price.' : 'Confirm all prices match your real selling prices. Dashboard \u2192 tap product \u2192 Edit.'}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-amber-900 font-bold text-xs">3</span>
                      </div>
                      <div>
                        <p className="text-amber-900 font-semibold text-xs">
                          {pid ? 'Share your shop link' : 'Share your store link with customers'}
                        </p>
                        <p className="text-amber-700 text-xs mt-0.5">
                          {pid ? 'Copy your earket link and share am for WhatsApp. Your customers go fit order from you direct!' : 'Copy your earket.com link and share on WhatsApp. Customers can order directly from you!'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!loginSent ? (
                <>
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    {pid ? 'How you want receive your login link?' : 'How would you like to receive your login link?'}
                  </p>
                  <div className="space-y-2 mb-5">
                    <button onClick={sendLoginEmail}
                      className="w-full flex items-center gap-3 bg-white border-2 border-gray-200 hover:border-brand-green rounded-2xl p-4 transition-all">
                      <div className="w-10 h-10 bg-brand-light rounded-xl flex items-center justify-center"><Mail size={20} className="text-brand-green" /></div>
                      <div className="text-left">
                        <div className="font-semibold text-brand-dark text-sm">Send to my Email</div>
                        <div className="text-xs text-gray-400 truncate">{email}</div>
                      </div>
                    </button>
                    <button onClick={sendLoginWhatsApp}
                      className="w-full flex items-center gap-3 bg-[#25D366] rounded-2xl p-4 hover:opacity-90 transition-all">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><MessageCircle size={20} className="text-white" /></div>
                      <div className="text-left">
                        <div className="font-semibold text-white text-sm">Send to my WhatsApp</div>
                        <div className="text-xs text-white/70">+{normalizedWa}</div>
                      </div>
                    </button>
                  </div>
                </>
              ) : (
                <div className="bg-brand-light rounded-2xl p-4 mb-5 flex items-center gap-3">
                  <Check size={18} className="text-brand-green shrink-0" />
                  <p className="text-sm text-brand-dark font-semibold">
                    {loginSent === 'email' ? 'Login link sent to your email!' : 'Login details sent to your WhatsApp!'}
                  </p>
                </div>
              )}
              <Link href={`/store/${storeSlug}`}
                className="block w-full bg-brand-green text-white font-bold py-3 rounded-2xl hover:bg-brand-dark transition-colors mb-2 text-sm">
                {pid ? 'See My Shop' : 'View My Business'}
              </Link>
              <a href={`https://wa.me/?text=${encodeURIComponent('Check out my business page: https://earket.com/store/' + storeSlug)}`}
                target="_blank" rel="noreferrer" className="btn-whatsapp w-full justify-center">
                📲 {pid ? 'Share for WhatsApp' : 'Share on WhatsApp'}
              </a>

              {/* Next Steps — placeholder notice */}
              {!alreadyExists && (
              <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 text-left">
                <p className="font-bold text-amber-800 text-sm mb-3">
                  {pid ? '3 things wey you need do next:' : '3 important things to do next:'}
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</div>
                    <div>
                      <p className="text-xs font-bold text-amber-900">{pid ? 'Change your product photos' : 'Replace the placeholder photos'}</p>
                      <div className="text-xs text-amber-700 mt-0.5 space-y-1">
                        <p>{pid ? 'The photos wey dey your shop now na sample photos. You fit get better photo by:' : 'The images shown are samples. You can get better photos by:'}</p>
                        <p>📸 {pid ? 'Take photo of your real product with your phone' : 'Taking a photo of your real product with your phone'}</p>
                        <p>🌐 {pid ? 'Download am from the manufacturer website (e.g. nestle.com)' : "Downloading from the manufacturer's website (e.g. nestle.com, unilever.com)"}</p>
                        <p>🔍 {pid ? 'Search Google for the product and save the image' : 'Searching Google for your product and saving a clear image'}</p>
                        <p>💾 {pid ? 'Find any good quality image online wey fit your product' : 'Finding any good quality image online that represents your product'}</p>
                        <p className="mt-1 font-semibold">{pid ? 'Then go dashboard → tap product → Edit → upload.' : 'Then: Dashboard → tap any product → Edit → upload your image.'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</div>
                    <div>
                      <p className="text-xs font-bold text-amber-900">{pid ? 'Fix your prices' : 'Update your prices'}</p>
                      <p className="text-xs text-amber-700 mt-0.5">{pid ? 'Check each product price and update am to match your real price.' : 'Review every product and set the correct price for what you actually charge.'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</div>
                    <div>
                      <p className="text-xs font-bold text-amber-900">{pid ? 'Add your real products' : 'Add your actual products'}</p>
                      <p className="text-xs text-amber-700 mt-0.5">{pid ? 'Remove products wey you no sell and add the ones wey you really get.' : "Remove products you don't stock and add the ones you actually sell."}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-amber-200 flex items-start gap-2">
                  <span className="text-amber-600 text-xs shrink-0">&#128273;</span>
                  <p className="text-xs text-amber-600">
                    {pid ? 'UTo login anytime, go to earket.com/login — enter the email and password wey you use set up your shop.' : 'To log in anytime, go to earket.com/login and enter the email and password you used when setting up your store.'}
                  </p>
                </div>
              </div>
              )}

              {/* Dashboard features teaser */}
              {!alreadyExists && (
              <div className="mt-4 bg-brand-light border border-brand-green/20 rounded-2xl p-4 text-left">
                <p className="font-bold text-brand-dark text-sm mb-2">
                  {pid ? '🚀 More things you fit do for your dashboard:' : "🚀 There's much more inside your dashboard:"}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: '💵', title: pid ? 'Cash Sale' : 'Cash Sale', desc: pid ? 'Record sales you make in person' : 'Record in-person sales instantly' },
                    { icon: '📦', title: pid ? 'Inventory' : 'Inventory', desc: pid ? 'Track how many products you get' : 'Track your stock levels' },
                    { icon: '📊', title: pid ? 'Analytics' : 'Analytics', desc: pid ? 'See how your shop dey perform' : 'See how your store is performing' },
                    { icon: '📣', title: pid ? 'Broadcast' : 'Broadcast', desc: pid ? 'Send message to all your customers' : 'Message all your customers at once' },
                    { icon: '🏷', title: pid ? 'Discounts' : 'Discounts', desc: pid ? 'Create promo and discount codes' : 'Create promo codes and offers' },
                    { icon: '👥', title: pid ? 'Customers' : 'Customers', desc: pid ? 'See who don buy from you' : 'View and manage your customers' },
                    { icon: '🎨', title: pid ? 'Change Theme' : 'Change Theme', desc: pid ? 'Change how your shop dey look' : "Customise your store's look and feel" },
                    { icon: '📝', title: pid ? 'Orders' : 'Orders', desc: pid ? 'Track all your online orders' : 'Manage all your online orders' },
                  ].map((f, i) => (
                    <div key={i} className="bg-white rounded-xl p-2.5 flex items-start gap-2">
                      <span className="text-lg shrink-0">{f.icon}</span>
                      <div>
                        <p className="text-xs font-bold text-brand-dark">{f.title}</p>
                        <p className="text-xs text-gray-500 leading-snug">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-brand-green font-semibold mt-3 text-center">
                  {pid ? 'Login to earket.com/login to explore everything →' : 'Log in at earket.com/login to explore everything →'}
                </p>
              </div>
              )}
            </div>
          )}

          {!['language', 'generating', 'done'].includes(step) && (
            <div className="flex gap-3 mt-8">
              <button onClick={() => setStep(prevStep[step] as Step)}
                className="flex items-center gap-1.5 text-gray-500 hover:text-brand-dark text-sm font-medium px-4 py-3">
                <ArrowLeft size={16} /> {pid ? 'Go Back' : 'Back'}
              </button>
              <button onClick={handleNext}
                disabled={(step === 'category' && !category) || (step === 'location' && !location && !customCity)}
                className="flex-1 bg-brand-green text-white font-bold py-3 rounded-2xl hover:bg-brand-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm">
                {step === 'subcategory'
                  ? (totalSelected > 0
                    ? `Continue with ${totalSelected} service${totalSelected !== 1 ? 's' : ''} selected`
                    : 'Continue — add all services')
                  : step === 'preview'
                  ? <>🚀 {pid ? 'Publish My Business!' : 'Publish My Business!'}</>
                  : <>Continue <ArrowRight size={18} /></>
                }
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
