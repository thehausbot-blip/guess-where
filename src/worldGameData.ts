export interface WorldCountry {
  name: string;
  iso: string;
  emoji: string;
  lat: number;
  lng: number;
  aliases?: string[];
}

export const WORLD_COUNTRIES_DATA: WorldCountry[] = [
  { name: "Afghanistan", iso: "AF", emoji: "🇦🇫", lat: 33.94, lng: 67.71 },
  { name: "Albania", iso: "AL", emoji: "🇦🇱", lat: 41.15, lng: 20.17 },
  { name: "Algeria", iso: "DZ", emoji: "🇩🇿", lat: 28.03, lng: 1.66 },
  { name: "Andorra", iso: "AD", emoji: "🇦🇩", lat: 42.55, lng: 1.60 },
  { name: "Angola", iso: "AO", emoji: "🇦🇴", lat: -11.20, lng: 17.87 },
  { name: "Antigua and Barbuda", iso: "AG", emoji: "🇦🇬", lat: 17.06, lng: -61.80, aliases: ["Antigua"] },
  { name: "Argentina", iso: "AR", emoji: "🇦🇷", lat: -38.42, lng: -63.62 },
  { name: "Armenia", iso: "AM", emoji: "🇦🇲", lat: 40.07, lng: 45.04 },
  { name: "Australia", iso: "AU", emoji: "🇦🇺", lat: -25.27, lng: 133.78 },
  { name: "Austria", iso: "AT", emoji: "🇦🇹", lat: 47.52, lng: 14.55 },
  { name: "Azerbaijan", iso: "AZ", emoji: "🇦🇿", lat: 40.14, lng: 47.58 },
  { name: "Bahamas", iso: "BS", emoji: "🇧🇸", lat: 25.03, lng: -77.40, aliases: ["The Bahamas"] },
  { name: "Bahrain", iso: "BH", emoji: "🇧🇭", lat: 26.07, lng: 50.55 },
  { name: "Bangladesh", iso: "BD", emoji: "🇧🇩", lat: 23.68, lng: 90.36 },
  { name: "Barbados", iso: "BB", emoji: "🇧🇧", lat: 13.19, lng: -59.54 },
  { name: "Belarus", iso: "BY", emoji: "🇧🇾", lat: 53.71, lng: 27.95 },
  { name: "Belgium", iso: "BE", emoji: "🇧🇪", lat: 50.50, lng: 4.47 },
  { name: "Belize", iso: "BZ", emoji: "🇧🇿", lat: 17.19, lng: -88.50 },
  { name: "Benin", iso: "BJ", emoji: "🇧🇯", lat: 9.31, lng: 2.32 },
  { name: "Bhutan", iso: "BT", emoji: "🇧🇹", lat: 27.51, lng: 90.43 },
  { name: "Bolivia", iso: "BO", emoji: "🇧🇴", lat: -16.29, lng: -63.59 },
  { name: "Bosnia and Herzegovina", iso: "BA", emoji: "🇧🇦", lat: 43.92, lng: 17.68, aliases: ["Bosnia"] },
  { name: "Botswana", iso: "BW", emoji: "🇧🇼", lat: -22.33, lng: 24.68 },
  { name: "Brazil", iso: "BR", emoji: "🇧🇷", lat: -14.24, lng: -51.93 },
  { name: "Brunei", iso: "BN", emoji: "🇧🇳", lat: 4.54, lng: 114.73 },
  { name: "Bulgaria", iso: "BG", emoji: "🇧🇬", lat: 42.73, lng: 25.49 },
  { name: "Burkina Faso", iso: "BF", emoji: "🇧🇫", lat: 12.24, lng: -1.56 },
  { name: "Burundi", iso: "BI", emoji: "🇧🇮", lat: -3.37, lng: 29.92 },
  { name: "Cabo Verde", iso: "CV", emoji: "🇨🇻", lat: 16.00, lng: -24.01, aliases: ["Cape Verde"] },
  { name: "Cambodia", iso: "KH", emoji: "🇰🇭", lat: 12.57, lng: 104.99 },
  { name: "Cameroon", iso: "CM", emoji: "🇨🇲", lat: 7.37, lng: 12.35 },
  { name: "Canada", iso: "CA", emoji: "🇨🇦", lat: 56.13, lng: -106.35 },
  { name: "Central African Republic", iso: "CF", emoji: "🇨🇫", lat: 6.61, lng: 20.94, aliases: ["CAR"] },
  { name: "Chad", iso: "TD", emoji: "🇹🇩", lat: 15.45, lng: 18.73 },
  { name: "Chile", iso: "CL", emoji: "🇨🇱", lat: -35.68, lng: -71.54 },
  { name: "China", iso: "CN", emoji: "🇨🇳", lat: 35.86, lng: 104.20 },
  { name: "Colombia", iso: "CO", emoji: "🇨🇴", lat: 4.57, lng: -74.30 },
  { name: "Comoros", iso: "KM", emoji: "🇰🇲", lat: -11.88, lng: 43.87 },
  { name: "Congo", iso: "CG", emoji: "🇨🇬", lat: -0.23, lng: 15.83, aliases: ["Republic of the Congo", "Congo-Brazzaville"] },
  { name: "DR Congo", iso: "CD", emoji: "🇨🇩", lat: -4.04, lng: 21.76, aliases: ["Democratic Republic of the Congo", "Congo-Kinshasa", "DRC"] },
  { name: "Costa Rica", iso: "CR", emoji: "🇨🇷", lat: 9.75, lng: -83.75 },
  { name: "Croatia", iso: "HR", emoji: "🇭🇷", lat: 45.10, lng: 15.20 },
  { name: "Cuba", iso: "CU", emoji: "🇨🇺", lat: 21.52, lng: -77.78 },
  { name: "Cyprus", iso: "CY", emoji: "🇨🇾", lat: 35.13, lng: 33.43 },
  { name: "Czech Republic", iso: "CZ", emoji: "🇨🇿", lat: 49.82, lng: 15.47, aliases: ["Czechia"] },
  { name: "Denmark", iso: "DK", emoji: "🇩🇰", lat: 56.26, lng: 9.50 },
  { name: "Djibouti", iso: "DJ", emoji: "🇩🇯", lat: 11.83, lng: 42.59 },
  { name: "Dominica", iso: "DM", emoji: "🇩🇲", lat: 15.41, lng: -61.37 },
  { name: "Dominican Republic", iso: "DO", emoji: "🇩🇴", lat: 18.74, lng: -70.16 },
  { name: "Ecuador", iso: "EC", emoji: "🇪🇨", lat: -1.83, lng: -78.18 },
  { name: "Egypt", iso: "EG", emoji: "🇪🇬", lat: 26.82, lng: 30.80 },
  { name: "El Salvador", iso: "SV", emoji: "🇸🇻", lat: 13.79, lng: -88.90 },
  { name: "Equatorial Guinea", iso: "GQ", emoji: "🇬🇶", lat: 1.65, lng: 10.27 },
  { name: "Eritrea", iso: "ER", emoji: "🇪🇷", lat: 15.18, lng: 39.78 },
  { name: "Estonia", iso: "EE", emoji: "🇪🇪", lat: 58.60, lng: 25.01 },
  { name: "Eswatini", iso: "SZ", emoji: "🇸🇿", lat: -26.52, lng: 31.47, aliases: ["Swaziland"] },
  { name: "Ethiopia", iso: "ET", emoji: "🇪🇹", lat: 9.15, lng: 40.49 },
  { name: "Fiji", iso: "FJ", emoji: "🇫🇯", lat: -17.71, lng: 178.07 },
  { name: "Finland", iso: "FI", emoji: "🇫🇮", lat: 61.92, lng: 25.75 },
  { name: "France", iso: "FR", emoji: "🇫🇷", lat: 46.23, lng: 2.21 },
  { name: "Gabon", iso: "GA", emoji: "🇬🇦", lat: -0.80, lng: 11.61 },
  { name: "Gambia", iso: "GM", emoji: "🇬🇲", lat: 13.44, lng: -15.31, aliases: ["The Gambia"] },
  { name: "Georgia", iso: "GE", emoji: "🇬🇪", lat: 42.32, lng: 43.36 },
  { name: "Germany", iso: "DE", emoji: "🇩🇪", lat: 51.17, lng: 10.45 },
  { name: "Ghana", iso: "GH", emoji: "🇬🇭", lat: 7.95, lng: -1.02 },
  { name: "Greece", iso: "GR", emoji: "🇬🇷", lat: 39.07, lng: 21.82 },
  { name: "Grenada", iso: "GD", emoji: "🇬🇩", lat: 12.26, lng: -61.60 },
  { name: "Guatemala", iso: "GT", emoji: "🇬🇹", lat: 15.78, lng: -90.23 },
  { name: "Guinea", iso: "GN", emoji: "🇬🇳", lat: 9.95, lng: -9.70 },
  { name: "Guinea-Bissau", iso: "GW", emoji: "🇬🇼", lat: 11.80, lng: -15.18 },
  { name: "Guyana", iso: "GY", emoji: "🇬🇾", lat: 4.86, lng: -58.93 },
  { name: "Haiti", iso: "HT", emoji: "🇭🇹", lat: 18.97, lng: -72.29 },
  { name: "Honduras", iso: "HN", emoji: "🇭🇳", lat: 15.20, lng: -86.24 },
  { name: "Hungary", iso: "HU", emoji: "🇭🇺", lat: 47.16, lng: 19.50 },
  { name: "Iceland", iso: "IS", emoji: "🇮🇸", lat: 64.96, lng: -19.02 },
  { name: "India", iso: "IN", emoji: "🇮🇳", lat: 20.59, lng: 78.96 },
  { name: "Indonesia", iso: "ID", emoji: "🇮🇩", lat: -0.79, lng: 113.92 },
  { name: "Iran", iso: "IR", emoji: "🇮🇷", lat: 32.43, lng: 53.69 },
  { name: "Iraq", iso: "IQ", emoji: "🇮🇶", lat: 33.22, lng: 43.68 },
  { name: "Ireland", iso: "IE", emoji: "🇮🇪", lat: 53.14, lng: -7.69 },
  { name: "Israel", iso: "IL", emoji: "🇮🇱", lat: 31.05, lng: 34.85 },
  { name: "Italy", iso: "IT", emoji: "🇮🇹", lat: 41.87, lng: 12.57 },
  { name: "Ivory Coast", iso: "CI", emoji: "🇨🇮", lat: 7.54, lng: -5.55, aliases: ["Cote d'Ivoire", "Côte d'Ivoire"] },
  { name: "Jamaica", iso: "JM", emoji: "🇯🇲", lat: 18.11, lng: -77.30 },
  { name: "Japan", iso: "JP", emoji: "🇯🇵", lat: 36.20, lng: 138.25 },
  { name: "Jordan", iso: "JO", emoji: "🇯🇴", lat: 30.59, lng: 36.24 },
  { name: "Kazakhstan", iso: "KZ", emoji: "🇰🇿", lat: 48.02, lng: 66.92 },
  { name: "Kenya", iso: "KE", emoji: "🇰🇪", lat: -0.02, lng: 37.91 },
  { name: "Kiribati", iso: "KI", emoji: "🇰🇮", lat: -3.37, lng: -168.73 },
  { name: "Kosovo", iso: "XK", emoji: "🇽🇰", lat: 42.60, lng: 20.90 },
  { name: "Kuwait", iso: "KW", emoji: "🇰🇼", lat: 29.31, lng: 47.48 },
  { name: "Kyrgyzstan", iso: "KG", emoji: "🇰🇬", lat: 41.20, lng: 74.77 },
  { name: "Laos", iso: "LA", emoji: "🇱🇦", lat: 19.86, lng: 102.50 },
  { name: "Latvia", iso: "LV", emoji: "🇱🇻", lat: 56.88, lng: 24.60 },
  { name: "Lebanon", iso: "LB", emoji: "🇱🇧", lat: 33.85, lng: 35.86 },
  { name: "Lesotho", iso: "LS", emoji: "🇱🇸", lat: -29.61, lng: 28.23 },
  { name: "Liberia", iso: "LR", emoji: "🇱🇷", lat: 6.43, lng: -9.43 },
  { name: "Libya", iso: "LY", emoji: "🇱🇾", lat: 26.34, lng: 17.23 },
  { name: "Liechtenstein", iso: "LI", emoji: "🇱🇮", lat: 47.17, lng: 9.56 },
  { name: "Lithuania", iso: "LT", emoji: "🇱🇹", lat: 55.17, lng: 23.88 },
  { name: "Luxembourg", iso: "LU", emoji: "🇱🇺", lat: 49.82, lng: 6.13 },
  { name: "Madagascar", iso: "MG", emoji: "🇲🇬", lat: -18.77, lng: 46.87 },
  { name: "Malawi", iso: "MW", emoji: "🇲🇼", lat: -13.25, lng: 34.30 },
  { name: "Malaysia", iso: "MY", emoji: "🇲🇾", lat: 4.21, lng: 101.98 },
  { name: "Maldives", iso: "MV", emoji: "🇲🇻", lat: 3.20, lng: 73.22 },
  { name: "Mali", iso: "ML", emoji: "🇲🇱", lat: 17.57, lng: -4.00 },
  { name: "Malta", iso: "MT", emoji: "🇲🇹", lat: 35.94, lng: 14.38 },
  { name: "Marshall Islands", iso: "MH", emoji: "🇲🇭", lat: 7.13, lng: 171.18 },
  { name: "Mauritania", iso: "MR", emoji: "🇲🇷", lat: 21.01, lng: -10.94 },
  { name: "Mauritius", iso: "MU", emoji: "🇲🇺", lat: -20.35, lng: 57.55 },
  { name: "Mexico", iso: "MX", emoji: "🇲🇽", lat: 23.63, lng: -102.55 },
  { name: "Micronesia", iso: "FM", emoji: "🇫🇲", lat: 7.43, lng: 150.55 },
  { name: "Moldova", iso: "MD", emoji: "🇲🇩", lat: 47.41, lng: 28.37 },
  { name: "Monaco", iso: "MC", emoji: "🇲🇨", lat: 43.75, lng: 7.41 },
  { name: "Mongolia", iso: "MN", emoji: "🇲🇳", lat: 46.86, lng: 103.85 },
  { name: "Montenegro", iso: "ME", emoji: "🇲🇪", lat: 42.71, lng: 19.37 },
  { name: "Morocco", iso: "MA", emoji: "🇲🇦", lat: 31.79, lng: -7.09 },
  { name: "Mozambique", iso: "MZ", emoji: "🇲🇿", lat: -18.67, lng: 35.53 },
  { name: "Myanmar", iso: "MM", emoji: "🇲🇲", lat: 21.91, lng: 95.96, aliases: ["Burma"] },
  { name: "Namibia", iso: "NA", emoji: "🇳🇦", lat: -22.96, lng: 18.49 },
  { name: "Nauru", iso: "NR", emoji: "🇳🇷", lat: -0.52, lng: 166.93 },
  { name: "Nepal", iso: "NP", emoji: "🇳🇵", lat: 28.39, lng: 84.12 },
  { name: "Netherlands", iso: "NL", emoji: "🇳🇱", lat: 52.13, lng: 5.29, aliases: ["Holland"] },
  { name: "New Zealand", iso: "NZ", emoji: "🇳🇿", lat: -40.90, lng: 174.89 },
  { name: "Nicaragua", iso: "NI", emoji: "🇳🇮", lat: 12.87, lng: -85.21 },
  { name: "Niger", iso: "NE", emoji: "🇳🇪", lat: 17.61, lng: 8.08 },
  { name: "Nigeria", iso: "NG", emoji: "🇳🇬", lat: 9.08, lng: 8.68 },
  { name: "North Korea", iso: "KP", emoji: "🇰🇵", lat: 40.34, lng: 127.51, aliases: ["DPRK"] },
  { name: "North Macedonia", iso: "MK", emoji: "🇲🇰", lat: 41.51, lng: 21.75, aliases: ["Macedonia"] },
  { name: "Norway", iso: "NO", emoji: "🇳🇴", lat: 60.47, lng: 8.47 },
  { name: "Oman", iso: "OM", emoji: "🇴🇲", lat: 21.47, lng: 55.98 },
  { name: "Pakistan", iso: "PK", emoji: "🇵🇰", lat: 30.38, lng: 69.35 },
  { name: "Palau", iso: "PW", emoji: "🇵🇼", lat: 7.51, lng: 134.58 },
  { name: "Palestine", iso: "PS", emoji: "🇵🇸", lat: 31.95, lng: 35.23 },
  { name: "Panama", iso: "PA", emoji: "🇵🇦", lat: 8.54, lng: -80.78 },
  { name: "Papua New Guinea", iso: "PG", emoji: "🇵🇬", lat: -6.31, lng: 143.96, aliases: ["PNG"] },
  { name: "Paraguay", iso: "PY", emoji: "🇵🇾", lat: -23.44, lng: -58.44 },
  { name: "Peru", iso: "PE", emoji: "🇵🇪", lat: -9.19, lng: -75.02 },
  { name: "Philippines", iso: "PH", emoji: "🇵🇭", lat: 12.88, lng: 121.77 },
  { name: "Poland", iso: "PL", emoji: "🇵🇱", lat: 51.92, lng: 19.15 },
  { name: "Portugal", iso: "PT", emoji: "🇵🇹", lat: 39.40, lng: -8.22 },
  { name: "Qatar", iso: "QA", emoji: "🇶🇦", lat: 25.35, lng: 51.18 },
  { name: "Romania", iso: "RO", emoji: "🇷🇴", lat: 45.94, lng: 24.97 },
  { name: "Russia", iso: "RU", emoji: "🇷🇺", lat: 61.52, lng: 105.32 },
  { name: "Rwanda", iso: "RW", emoji: "🇷🇼", lat: -1.94, lng: 29.87 },
  { name: "Saint Kitts and Nevis", iso: "KN", emoji: "🇰🇳", lat: 17.36, lng: -62.78, aliases: ["St Kitts", "St Kitts and Nevis"] },
  { name: "Saint Lucia", iso: "LC", emoji: "🇱🇨", lat: 13.91, lng: -60.98, aliases: ["St Lucia"] },
  { name: "Saint Vincent and the Grenadines", iso: "VC", emoji: "🇻🇨", lat: 12.98, lng: -61.29, aliases: ["St Vincent", "SVG"] },
  { name: "Samoa", iso: "WS", emoji: "🇼🇸", lat: -13.76, lng: -172.10 },
  { name: "San Marino", iso: "SM", emoji: "🇸🇲", lat: 43.94, lng: 12.46 },
  { name: "São Tomé and Príncipe", iso: "ST", emoji: "🇸🇹", lat: 0.19, lng: 6.61, aliases: ["Sao Tome", "Sao Tome and Principe"] },
  { name: "Saudi Arabia", iso: "SA", emoji: "🇸🇦", lat: 23.89, lng: 45.08 },
  { name: "Senegal", iso: "SN", emoji: "🇸🇳", lat: 14.50, lng: -14.45 },
  { name: "Serbia", iso: "RS", emoji: "🇷🇸", lat: 44.02, lng: 21.01 },
  { name: "Seychelles", iso: "SC", emoji: "🇸🇨", lat: -4.68, lng: 55.49 },
  { name: "Sierra Leone", iso: "SL", emoji: "🇸🇱", lat: 8.46, lng: -11.78 },
  { name: "Singapore", iso: "SG", emoji: "🇸🇬", lat: 1.35, lng: 103.82 },
  { name: "Slovakia", iso: "SK", emoji: "🇸🇰", lat: 48.67, lng: 19.70 },
  { name: "Slovenia", iso: "SI", emoji: "🇸🇮", lat: 46.15, lng: 14.99 },
  { name: "Solomon Islands", iso: "SB", emoji: "🇸🇧", lat: -9.65, lng: 160.16 },
  { name: "Somalia", iso: "SO", emoji: "🇸🇴", lat: 5.15, lng: 46.20 },
  { name: "South Africa", iso: "ZA", emoji: "🇿🇦", lat: -30.56, lng: 22.94 },
  { name: "South Korea", iso: "KR", emoji: "🇰🇷", lat: 35.91, lng: 127.77, aliases: ["Korea"] },
  { name: "South Sudan", iso: "SS", emoji: "🇸🇸", lat: 6.88, lng: 31.31 },
  { name: "Spain", iso: "ES", emoji: "🇪🇸", lat: 40.46, lng: -3.75 },
  { name: "Sri Lanka", iso: "LK", emoji: "🇱🇰", lat: 7.87, lng: 80.77 },
  { name: "Sudan", iso: "SD", emoji: "🇸🇩", lat: 12.86, lng: 30.22 },
  { name: "Suriname", iso: "SR", emoji: "🇸🇷", lat: 3.92, lng: -56.03 },
  { name: "Sweden", iso: "SE", emoji: "🇸🇪", lat: 60.13, lng: 18.64 },
  { name: "Switzerland", iso: "CH", emoji: "🇨🇭", lat: 46.82, lng: 8.23 },
  { name: "Syria", iso: "SY", emoji: "🇸🇾", lat: 34.80, lng: 39.00 },
  { name: "Taiwan", iso: "TW", emoji: "🇹🇼", lat: 23.70, lng: 120.96 },
  { name: "Tajikistan", iso: "TJ", emoji: "🇹🇯", lat: 38.86, lng: 71.28 },
  { name: "Tanzania", iso: "TZ", emoji: "🇹🇿", lat: -6.37, lng: 34.89 },
  { name: "Thailand", iso: "TH", emoji: "🇹🇭", lat: 15.87, lng: 100.99 },
  { name: "Timor-Leste", iso: "TL", emoji: "🇹🇱", lat: -8.87, lng: 125.73, aliases: ["East Timor"] },
  { name: "Togo", iso: "TG", emoji: "🇹🇬", lat: 8.62, lng: 0.82 },
  { name: "Tonga", iso: "TO", emoji: "🇹🇴", lat: -21.18, lng: -175.20 },
  { name: "Trinidad and Tobago", iso: "TT", emoji: "🇹🇹", lat: 10.69, lng: -61.22, aliases: ["Trinidad"] },
  { name: "Tunisia", iso: "TN", emoji: "🇹🇳", lat: 33.89, lng: 9.54 },
  { name: "Turkey", iso: "TR", emoji: "🇹🇷", lat: 38.96, lng: 35.24, aliases: ["Türkiye", "Turkiye"] },
  { name: "Turkmenistan", iso: "TM", emoji: "🇹🇲", lat: 38.97, lng: 59.56 },
  { name: "Tuvalu", iso: "TV", emoji: "🇹🇻", lat: -7.11, lng: 177.65 },
  { name: "Uganda", iso: "UG", emoji: "🇺🇬", lat: 1.37, lng: 32.29 },
  { name: "Ukraine", iso: "UA", emoji: "🇺🇦", lat: 48.38, lng: 31.17 },
  { name: "United Arab Emirates", iso: "AE", emoji: "🇦🇪", lat: 23.42, lng: 53.85, aliases: ["UAE"] },
  { name: "United Kingdom", iso: "GB", emoji: "🇬🇧", lat: 55.38, lng: -3.44, aliases: ["UK", "Britain", "Great Britain", "England"] },
  { name: "United States", iso: "US", emoji: "🇺🇸", lat: 37.09, lng: -95.71, aliases: ["USA", "US", "America", "United States of America"] },
  { name: "Uruguay", iso: "UY", emoji: "🇺🇾", lat: -32.52, lng: -55.77 },
  { name: "Uzbekistan", iso: "UZ", emoji: "🇺🇿", lat: 41.38, lng: 64.59 },
  { name: "Vanuatu", iso: "VU", emoji: "🇻🇺", lat: -15.38, lng: 166.96 },
  { name: "Vatican City", iso: "VA", emoji: "🇻🇦", lat: 41.90, lng: 12.45, aliases: ["Vatican", "Holy See"] },
  { name: "Venezuela", iso: "VE", emoji: "🇻🇪", lat: 6.42, lng: -66.59 },
  { name: "Vietnam", iso: "VN", emoji: "🇻🇳", lat: 14.06, lng: 108.28 },
  { name: "Yemen", iso: "YE", emoji: "🇾🇪", lat: 15.55, lng: 48.52 },
  { name: "Zambia", iso: "ZM", emoji: "🇿🇲", lat: -13.13, lng: 27.85 },
  { name: "Zimbabwe", iso: "ZW", emoji: "🇿🇼", lat: -19.02, lng: 29.15 },
];

// Build lookup maps for fast matching
const _nameLookup = new Map<string, WorldCountry>();
const _aliasLookup = new Map<string, WorldCountry>();

for (const country of WORLD_COUNTRIES_DATA) {
  _nameLookup.set(country.name.toLowerCase(), country);
  if (country.aliases) {
    for (const alias of country.aliases) {
      _aliasLookup.set(alias.toLowerCase(), country);
    }
  }
}

export function findCountry(query: string): WorldCountry | null {
  const q = query.trim().toLowerCase();
  return _nameLookup.get(q) || _aliasLookup.get(q) || null;
}

export function fuzzyMatchCountries(query: string, limit = 8): WorldCountry[] {
  if (!query.trim()) return [];
  const q = query.trim().toLowerCase();
  const results: { country: WorldCountry; score: number }[] = [];

  for (const country of WORLD_COUNTRIES_DATA) {
    const nameLower = country.name.toLowerCase();
    // Exact start match = best score
    if (nameLower.startsWith(q)) {
      results.push({ country, score: 0 });
      continue;
    }
    // Check aliases
    if (country.aliases?.some(a => a.toLowerCase().startsWith(q))) {
      results.push({ country, score: 0.1 });
      continue;
    }
    // Contains match
    if (nameLower.includes(q)) {
      results.push({ country, score: 0.5 });
      continue;
    }
    if (country.aliases?.some(a => a.toLowerCase().includes(q))) {
      results.push({ country, score: 0.6 });
      continue;
    }
  }

  results.sort((a, b) => a.score - b.score || a.country.name.localeCompare(b.country.name));
  return results.slice(0, limit).map(r => r.country);
}
