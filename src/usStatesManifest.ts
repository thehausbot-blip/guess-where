import type { StateManifest } from './stateRegistry';

export const US_STATES_MANIFEST: StateManifest[] = [
  // === NORTHEAST ===
  { id: 'connecticut', name: 'Connecticut', abbr: 'CT', emoji: '🥜', region: 'northeast', cityCount: 100, center: [41.6, -72.7], zoom: 9, minZoom: 8, maxZoom: 14, bounds: [[40.9, -73.8], [42.1, -71.7]] },
  { id: 'delaware', name: 'Delaware', abbr: 'DE', emoji: '💎', region: 'northeast', cityCount: 60, center: [39.0, -75.5], zoom: 9, minZoom: 8, maxZoom: 14, bounds: [[38.4, -75.9], [39.9, -74.9]] },
  { id: 'maine', name: 'Maine', abbr: 'ME', emoji: '🦞', region: 'northeast', cityCount: 200, center: [45.3, -69.0], zoom: 7, minZoom: 6, maxZoom: 13, bounds: [[43.0, -71.1], [47.5, -66.9]] },
  { id: 'maryland', name: 'Maryland', abbr: 'MD', emoji: '🦀', region: 'northeast', cityCount: 200, center: [39.0, -76.8], zoom: 8, minZoom: 7, maxZoom: 14, bounds: [[37.9, -79.6], [39.8, -74.9]] },
  { id: 'massachusetts', name: 'Massachusetts', abbr: 'MA', emoji: '🫖', region: 'northeast', cityCount: 250, center: [42.2, -71.8], zoom: 8, minZoom: 7, maxZoom: 14, bounds: [[41.1, -73.6], [42.9, -69.8]] },
  { id: 'new_hampshire', name: 'New Hampshire', abbr: 'NH', emoji: '⛰️', region: 'northeast', cityCount: 100, center: [43.7, -71.6], zoom: 8, minZoom: 7, maxZoom: 14, bounds: [[42.7, -72.6], [45.4, -70.6]] },
  { id: 'new_jersey', name: 'New Jersey', abbr: 'NJ', emoji: '🎢', region: 'northeast', cityCount: 350, center: [40.2, -74.7], zoom: 8, minZoom: 7, maxZoom: 14, bounds: [[38.9, -75.6], [41.4, -73.8]] },
  { id: 'new_york', name: 'New York', abbr: 'NY', emoji: '🗽', region: 'northeast', iconUrl: '/icons/new-york-flag.svg', cityCount: 600, center: [42.9, -75.5], zoom: 7, minZoom: 6, maxZoom: 13, bounds: [[40.4, -79.8], [45.1, -71.8]] },
  { id: 'pennsylvania', name: 'Pennsylvania', abbr: 'PA', emoji: '🔔', region: 'northeast', iconUrl: '/icons/pennsylvania-flag.svg', cityCount: 500, center: [40.9, -77.8], zoom: 7, minZoom: 6, maxZoom: 13, bounds: [[39.7, -80.6], [42.3, -74.6]] },
  { id: 'rhode_island', name: 'Rhode Island', abbr: 'RI', emoji: '⛵', region: 'northeast', cityCount: 40, center: [41.7, -71.5], zoom: 10, minZoom: 9, maxZoom: 15, bounds: [[41.1, -72.0], [42.1, -71.0]] },
  { id: 'vermont', name: 'Vermont', abbr: 'VT', emoji: '🍁', region: 'northeast', cityCount: 80, center: [44.0, -72.7], zoom: 8, minZoom: 7, maxZoom: 14, bounds: [[42.7, -73.5], [45.1, -71.4]] },

  // === SOUTHEAST ===
  { id: 'alabama', name: 'Alabama', abbr: 'AL', emoji: '🏈', region: 'southeast', cityCount: 350, center: [32.8, -86.8], zoom: 7, minZoom: 6, maxZoom: 13, bounds: [[30.1, -88.5], [35.1, -84.9]] },
  { id: 'arkansas', name: 'Arkansas', abbr: 'AR', emoji: '💎', region: 'southeast', cityCount: 300, center: [34.8, -92.2], zoom: 7, minZoom: 6, maxZoom: 13, bounds: [[33.0, -94.7], [36.5, -89.6]] },
  { id: 'florida', name: 'Florida', abbr: 'FL', emoji: '🐊', region: 'southeast', iconUrl: '/icons/florida-flag.svg', cityCount: 600, center: [28.5, -82.5], zoom: 6, minZoom: 5, maxZoom: 13, bounds: [[24.3, -87.7], [31.1, -79.8]] },
  { id: 'georgia', name: 'Georgia', abbr: 'GA', emoji: '🍑', region: 'southeast', iconUrl: '/icons/georgia-flag.svg', cityCount: 400, center: [32.7, -83.5], zoom: 7, minZoom: 6, maxZoom: 13, bounds: [[30.3, -85.7], [35.1, -80.7]] },
  { id: 'kentucky', name: 'Kentucky', abbr: 'KY', emoji: '🐎', region: 'southeast', cityCount: 350, center: [37.8, -85.8], zoom: 7, minZoom: 6, maxZoom: 13, bounds: [[36.4, -89.6], [39.2, -81.9]] },
  { id: 'louisiana', name: 'Louisiana', abbr: 'LA', emoji: '⚜️', region: 'southeast', cityCount: 300, center: [31.0, -91.9], zoom: 7, minZoom: 6, maxZoom: 13, bounds: [[28.9, -94.1], [33.1, -88.8]] },
  { id: 'mississippi', name: 'Mississippi', abbr: 'MS', emoji: '🎵', region: 'southeast', cityCount: 250, center: [32.7, -89.7], zoom: 7, minZoom: 6, maxZoom: 13, bounds: [[30.1, -91.7], [35.1, -88.0]] },
  { id: 'north_carolina', name: 'North Carolina', abbr: 'NC', emoji: '🏔️', region: 'southeast', iconUrl: '/icons/north-carolina-flag.svg', cityCount: 450, center: [35.5, -79.8], zoom: 7, minZoom: 6, maxZoom: 13, bounds: [[33.7, -84.4], [36.6, -75.4]] },
  { id: 'south_carolina', name: 'South Carolina', abbr: 'SC', emoji: '🌙', region: 'southeast', cityCount: 250, center: [33.8, -81.0], zoom: 7, minZoom: 7, maxZoom: 13, bounds: [[32.0, -83.4], [35.3, -78.4]] },
  { id: 'tennessee', name: 'Tennessee', abbr: 'TN', emoji: '🎸', region: 'southeast', cityCount: 350, center: [35.9, -86.4], zoom: 7, minZoom: 6, maxZoom: 13, bounds: [[34.9, -90.4], [36.7, -81.6]] },
  { id: 'virginia', name: 'Virginia', abbr: 'VA', emoji: '🏛️', region: 'southeast', cityCount: 400, center: [37.5, -79.0], zoom: 7, minZoom: 6, maxZoom: 13, bounds: [[36.5, -83.7], [39.5, -75.2]] },
  { id: 'west_virginia', name: 'West Virginia', abbr: 'WV', emoji: '⛏️', region: 'southeast', cityCount: 200, center: [38.6, -80.6], zoom: 7, minZoom: 7, maxZoom: 13, bounds: [[37.2, -82.7], [40.7, -77.7]] },
  { id: 'dc', name: 'Washington D.C.', abbr: 'DC', emoji: '🏛️', region: 'southeast', cityCount: 1, center: [38.9, -77.0], zoom: 12, minZoom: 11, maxZoom: 16, bounds: [[38.79, -77.12], [38.99, -76.91]] },

  // === MIDWEST ===
  { id: 'illinois', name: 'Illinois', abbr: 'IL', emoji: '🌽', region: 'midwest', iconUrl: '/icons/illinois-flag.svg', cityCount: 600, center: [40.0, -89.2], zoom: 7, minZoom: 6, maxZoom: 13, bounds: [[36.9, -91.6], [42.6, -87.0]] },
  { id: 'indiana', name: 'Indiana', abbr: 'IN', emoji: '🏎️', region: 'midwest', cityCount: 400, center: [39.8, -86.2], zoom: 7, minZoom: 6, maxZoom: 13, bounds: [[37.7, -88.1], [41.8, -84.7]] },
  { id: 'iowa', name: 'Iowa', abbr: 'IA', emoji: '🌽', region: 'midwest', cityCount: 400, center: [42.0, -93.5], zoom: 7, minZoom: 6, maxZoom: 13, bounds: [[40.3, -96.7], [43.6, -89.9]] },
  { id: 'kansas', name: 'Kansas', abbr: 'KS', emoji: '🌻', region: 'midwest', cityCount: 400, center: [38.5, -98.4], zoom: 7, minZoom: 6, maxZoom: 13, bounds: [[36.9, -102.1], [40.1, -94.5]] },
  { id: 'michigan', name: 'Michigan', abbr: 'MI', emoji: '🚗', region: 'midwest', iconUrl: '/icons/michigan-flag.svg', cityCount: 400, center: [44.3, -84.6], zoom: 6, minZoom: 6, maxZoom: 13, bounds: [[41.6, -90.5], [48.3, -82.1]] },
  { id: 'minnesota', name: 'Minnesota', abbr: 'MN', emoji: '🏒', region: 'midwest', cityCount: 500, center: [46.0, -94.5], zoom: 6, minZoom: 6, maxZoom: 13, bounds: [[43.4, -97.3], [49.4, -89.4]] },
  { id: 'missouri', name: 'Missouri', abbr: 'MO', emoji: '🏛️', region: 'midwest', cityCount: 500, center: [38.5, -92.5], zoom: 7, minZoom: 6, maxZoom: 13, bounds: [[35.9, -95.8], [40.7, -89.0]] },
  { id: 'nebraska', name: 'Nebraska', abbr: 'NE', emoji: '🌾', region: 'midwest', cityCount: 300, center: [41.5, -99.8], zoom: 7, minZoom: 6, maxZoom: 13, bounds: [[39.8, -104.1], [43.1, -95.2]] },
  { id: 'north_dakota', name: 'North Dakota', abbr: 'ND', emoji: '🦬', region: 'midwest', cityCount: 200, center: [47.4, -100.5], zoom: 7, minZoom: 6, maxZoom: 13, bounds: [[45.9, -104.1], [49.1, -96.5]] },
  { id: 'ohio', name: 'Ohio', abbr: 'OH', emoji: '🌰', region: 'midwest', iconUrl: '/icons/ohio-flag.svg', cityCount: 500, center: [40.4, -82.7], zoom: 7, minZoom: 6, maxZoom: 13, bounds: [[38.4, -85.0], [42.0, -80.4]] },
  { id: 'south_dakota', name: 'South Dakota', abbr: 'SD', emoji: '🗿', region: 'midwest', cityCount: 200, center: [44.4, -100.2], zoom: 7, minZoom: 6, maxZoom: 13, bounds: [[42.4, -104.1], [46.0, -96.3]] },
  { id: 'wisconsin', name: 'Wisconsin', abbr: 'WI', emoji: '🧀', region: 'midwest', cityCount: 400, center: [44.6, -89.8], zoom: 7, minZoom: 6, maxZoom: 13, bounds: [[42.4, -93.0], [47.3, -86.7]] },

  // === SOUTHWEST ===
  { id: 'arizona', name: 'Arizona', abbr: 'AZ', emoji: '🌵', region: 'southwest', cityCount: 250, center: [34.3, -111.7], zoom: 6, minZoom: 6, maxZoom: 13, bounds: [[31.3, -115.0], [37.1, -109.0]] },
  { id: 'new_mexico', name: 'New Mexico', abbr: 'NM', emoji: '🎨', region: 'southwest', cityCount: 200, center: [34.5, -106.0], zoom: 7, minZoom: 6, maxZoom: 13, bounds: [[31.3, -109.1], [37.1, -103.0]] },
  { id: 'oklahoma', name: 'Oklahoma', abbr: 'OK', emoji: '🪶', region: 'southwest', cityCount: 400, center: [35.5, -97.5], zoom: 7, minZoom: 6, maxZoom: 13, bounds: [[33.6, -103.1], [37.1, -94.3]] },
  // Texas is manually configured in mapConfigs.ts

  // === WEST ===
  { id: 'alaska', name: 'Alaska', abbr: 'AK', emoji: '🐻', region: 'west', cityCount: 150, center: [64.0, -153.0], zoom: 4, minZoom: 3, maxZoom: 12, bounds: [[51.0, -180.0], [71.5, -129.0]] },
  { id: 'california', name: 'California', abbr: 'CA', emoji: '🐻', region: 'west', iconUrl: '/icons/california-flag.svg', cityCount: 1000, center: [37.2, -119.5], zoom: 6, minZoom: 5, maxZoom: 13, bounds: [[32.4, -124.5], [42.1, -114.0]] },
  { id: 'colorado', name: 'Colorado', abbr: 'CO', emoji: '⛷️', region: 'west', cityCount: 300, center: [39.0, -105.5], zoom: 7, minZoom: 6, maxZoom: 13, bounds: [[36.9, -109.1], [41.1, -102.0]] },
  { id: 'hawaii', name: 'Hawaii', abbr: 'HI', emoji: '🌺', region: 'west', cityCount: 100, center: [20.5, -157.5], zoom: 7, minZoom: 6, maxZoom: 13, bounds: [[18.5, -161.0], [22.5, -154.5]] },
  { id: 'idaho', name: 'Idaho', abbr: 'ID', emoji: '🥔', region: 'west', cityCount: 200, center: [44.4, -114.7], zoom: 6, minZoom: 6, maxZoom: 13, bounds: [[41.9, -117.3], [49.1, -111.0]] },
  { id: 'montana', name: 'Montana', abbr: 'MT', emoji: '🏔️', region: 'west', cityCount: 200, center: [47.0, -109.6], zoom: 6, minZoom: 5, maxZoom: 13, bounds: [[44.3, -116.1], [49.1, -104.0]] },
  { id: 'nevada', name: 'Nevada', abbr: 'NV', emoji: '🎰', region: 'west', cityCount: 100, center: [39.3, -116.6], zoom: 6, minZoom: 6, maxZoom: 13, bounds: [[34.9, -120.1], [42.1, -114.0]] },
  { id: 'oregon', name: 'Oregon', abbr: 'OR', emoji: '🌲', region: 'west', cityCount: 250, center: [44.0, -120.5], zoom: 7, minZoom: 6, maxZoom: 13, bounds: [[41.9, -124.7], [46.4, -116.4]] },
  { id: 'utah', name: 'Utah', abbr: 'UT', emoji: '🏜️', region: 'west', cityCount: 200, center: [39.3, -111.7], zoom: 7, minZoom: 6, maxZoom: 13, bounds: [[36.9, -114.1], [42.1, -109.0]] },
  { id: 'washington', name: 'Washington', abbr: 'WA', emoji: '☕', region: 'west', cityCount: 350, center: [47.4, -120.7], zoom: 7, minZoom: 6, maxZoom: 13, bounds: [[45.5, -124.9], [49.1, -116.9]] },
  { id: 'wyoming', name: 'Wyoming', abbr: 'WY', emoji: '🤠', region: 'west', cityCount: 100, center: [43.0, -107.5], zoom: 7, minZoom: 6, maxZoom: 13, bounds: [[40.9, -111.1], [45.1, -104.0]] },

  // === TERRITORIES ===
  // Puerto Rico is manually configured in mapConfigs.ts
  { id: 'guam', name: 'Guam', abbr: 'GU', emoji: '🏝️', region: 'territories', cityCount: 20, center: [13.44, 144.79], zoom: 11, minZoom: 10, maxZoom: 15, bounds: [[13.2, 144.6], [13.7, 145.0]] },
  { id: 'us_virgin_islands', name: 'U.S. Virgin Islands', abbr: 'VI', emoji: '🏝️', region: 'territories', cityCount: 20, center: [18.0, -64.8], zoom: 10, minZoom: 9, maxZoom: 15, bounds: [[17.6, -65.1], [18.5, -64.5]] },
  { id: 'american_samoa', name: 'American Samoa', abbr: 'AS', emoji: '🏝️', region: 'territories', cityCount: 10, center: [-14.27, -170.7], zoom: 11, minZoom: 10, maxZoom: 15, bounds: [[-14.5, -171.1], [-14.1, -170.5]] },
  { id: 'northern_mariana_islands', name: 'Northern Mariana Islands', abbr: 'MP', emoji: '🏝️', region: 'territories', cityCount: 10, center: [15.2, 145.75], zoom: 10, minZoom: 9, maxZoom: 15, bounds: [[14.0, 144.8], [20.6, 146.1]] },
];
