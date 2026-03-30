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
  { id: 'building', label: 'Building & Construction', emoji: '🟧', pidgin: 'Building Materials' },
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
  { id: 'auto_services', label: 'Auto & Vehicle Services', emoji: '🔧', pidgin: 'Car & Vehicle' },
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
