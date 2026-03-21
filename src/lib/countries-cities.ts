export interface CountryData {
  name: string
  flag: string
  dial: string
  currency: string
  currencySymbol: string
  cities: string[]
}

export const COUNTRIES_WITH_CITIES: Record<string, CountryData> = {
  NG: {
    name: 'Nigeria', flag: '🇳🇬', dial: '234', currency: 'NGN', currencySymbol: '₦',
    cities: ['Abuja', 'Abeokuta', 'Akure', 'Asaba', 'Awka', 'Bauchi', 'Benin City', 'Calabar', 'Dutse', 'Ekiti', 'Enugu', 'Gombe', 'Ibadan', 'Ile-Ife', 'Ilorin', 'Jos', 'Kaduna', 'Kano', 'Katsina', 'Lafia', 'Lagos', 'Lokoja', 'Maiduguri', 'Makurdi', 'Minna', 'Nsukka', 'Ogbomosho', 'Onitsha', 'Osogbo', 'Owerri', 'Port Harcourt', 'Sokoto', 'Umuahia', 'Uyo', 'Warri', 'Yenagoa', 'Yola', 'Zaria']
  },
  GH: {
    name: 'Ghana', flag: '🇬🇭', dial: '233', currency: 'GHS', currencySymbol: 'GH₵',
    cities: ['Accra', 'Kumasi', 'Tamale', 'Takoradi', 'Cape Coast', 'Sunyani', 'Koforidua', 'Ho', 'Wa', 'Bolgatanga', 'Techiman', 'Obuasi']
  },
  KE: {
    name: 'Kenya', flag: '🇰🇪', dial: '254', currency: 'KES', currencySymbol: 'KSh',
    cities: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Malindi', 'Kitale', 'Garissa', 'Kakamega', 'Nyeri', 'Machakos']
  },
  ZA: {
    name: 'South Africa', flag: '🇿🇦', dial: '27', currency: 'ZAR', currencySymbol: 'R',
    cities: ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Port Elizabeth', 'Bloemfontein', 'East London', 'Polokwane', 'Nelspruit', 'Kimberley', 'Rustenburg', 'Pietermaritzburg']
  },
  BR: {
    name: 'Brazil', flag: '🇧🇷', dial: '55', currency: 'BRL', currencySymbol: 'R$',
    cities: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza', 'Belo Horizonte', 'Manaus', 'Curitiba', 'Recife', 'Porto Alegre', 'Belém', 'Goiânia']
  },
  PK: {
    name: 'Pakistan', flag: '🇵🇰', dial: '92', currency: 'PKR', currencySymbol: '₨',
    cities: ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala', 'Hyderabad', 'Bahawalpur']
  },
  IN: {
    name: 'India', flag: '🇮🇳', dial: '91', currency: 'INR', currencySymbol: '₹',
    cities: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow', 'Kanpur', 'Nagpur', 'Visakhapatnam', 'Indore']
  },
  EG: {
    name: 'Egypt', flag: '🇪🇬', dial: '20', currency: 'EGP', currencySymbol: 'E£',
    cities: ['Cairo', 'Alexandria', 'Giza', 'Shubra El Kheima', 'Port Said', 'Suez', 'Luxor', 'Asyut', 'Ismailia', 'Fayyum', 'Zagazig', 'Aswan']
  },
  TZ: {
    name: 'Tanzania', flag: '🇹🇿', dial: '255', currency: 'TZS', currencySymbol: 'TSh',
    cities: ['Dar es Salaam', 'Mwanza', 'Arusha', 'Dodoma', 'Mbeya', 'Morogoro', 'Tanga', 'Zanzibar City', 'Kigoma', 'Tabora']
  },
  ET: {
    name: 'Ethiopia', flag: '🇪🇹', dial: '251', currency: 'ETB', currencySymbol: 'Br',
    cities: ['Addis Ababa', 'Dire Dawa', 'Mekelle', 'Gondar', 'Adama', 'Hawassa', 'Bahir Dar', 'Dessie', 'Jimma', 'Jijiga']
  },
  SN: {
    name: 'Senegal', flag: '🇸🇳', dial: '221', currency: 'XOF', currencySymbol: 'CFA',
    cities: ['Dakar', 'Thiès', 'Kaolack', 'Saint-Louis', 'Ziguinchor', 'Diourbel', 'Louga', 'Tambacounda', 'Kolda', 'Matam']
  },
  CI: {
    name: "Côte d'Ivoire", flag: '🇨🇮', dial: '225', currency: 'XOF', currencySymbol: 'CFA',
    cities: ['Abidjan', 'Bouaké', 'Daloa', 'San Pédro', 'Yamoussoukro', 'Korhogo', 'Man', 'Divo', 'Gagnoa', 'Abengourou']
  },
  CM: {
    name: 'Cameroon', flag: '🇨🇲', dial: '237', currency: 'XAF', currencySymbol: 'FCFA',
    cities: ['Douala', 'Yaoundé', 'Garoua', 'Kousséri', 'Bamenda', 'Bafoussam', 'Ngaoundéré', 'Bertoua', 'Kumba', 'Loum']
  },
  UG: {
    name: 'Uganda', flag: '🇺🇬', dial: '256', currency: 'UGX', currencySymbol: 'USh',
    cities: ['Kampala', 'Gulu', 'Lira', 'Mbarara', 'Jinja', 'Bwizibwera', 'Mbale', 'Mukono', 'Kasese', 'Masaka']
  },
  US: {
    name: 'United States', flag: '🇺🇸', dial: '1', currency: 'USD', currencySymbol: '$',
    cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Atlanta', 'Miami', 'Seattle']
  },
  GB: {
    name: 'United Kingdom', flag: '🇬🇧', dial: '44', currency: 'GBP', currencySymbol: '£',
    cities: ['London', 'Birmingham', 'Manchester', 'Glasgow', 'Liverpool', 'Bristol', 'Sheffield', 'Leeds', 'Edinburgh', 'Leicester', 'Coventry', 'Bradford', 'Nottingham', 'Cardiff', 'Belfast']
  },
  CA: {
    name: 'Canada', flag: '🇨🇦', dial: '1', currency: 'CAD', currencySymbol: 'C$',
    cities: ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg', 'Quebec City', 'Hamilton', 'Kitchener']
  },
}

export const COUNTRY_LIST = Object.entries(COUNTRIES_WITH_CITIES).map(([code, data]) => ({
  code,
  ...data,
})).sort((a, b) => a.name.localeCompare(b.name))
