import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import Globe, { type GlobeMethods } from 'react-globe.gl';
import type { WorldGuess } from '../hooks/useWorldGame';

interface WorldGlobeProps {
  guesses: WorldGuess[];
  targetFound: boolean;
  targetCountryIso?: string;
}

interface CountryFeature {
  type: string;
  properties: {
    ISO_A2?: string;
    ISO_A3?: string;
    ADMIN?: string;
    NAME?: string;
    [key: string]: unknown;
  };
  geometry: unknown;
}

export function WorldGlobe({ guesses, targetFound, targetCountryIso }: WorldGlobeProps) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const [countries, setCountries] = useState<CountryFeature[]>([]);
  const [dimensions, setDimensions] = useState({ width: 400, height: 400 });

  // Load GeoJSON
  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(r => r.json())
      .then((topology) => {
        // Convert TopoJSON to GeoJSON
        import('topojson-client').then(({ feature }) => {
          const geojson = feature(topology, topology.objects.countries) as unknown as { features: CountryFeature[] };
          setCountries(geojson.features);
        });
      })
      .catch(() => {
        // Fallback: try GeoJSON directly
        fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json')
          .then(r => r.json())
          .then((topology) => {
            import('topojson-client').then(({ feature }) => {
              const geojson = feature(topology, topology.objects.countries) as unknown as { features: CountryFeature[] };
              setCountries(geojson.features);
            });
          });
      });
  }, []);

  // Responsive sizing
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        setDimensions({ width: w, height: Math.min(w, 500) });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Build ISO lookup from guesses
  const guessMap = useMemo(() => {
    const map = new Map<string, WorldGuess>();
    for (const g of guesses) {
      map.set(g.country.iso, g);
    }
    return map;
  }, [guesses]);

  // Disable auto-rotate
  useEffect(() => {
    if (globeRef.current) {
      const controls = globeRef.current.controls();
      if (controls) {
        (controls as unknown as { autoRotate: boolean }).autoRotate = false;
      }
    }
  }, [countries]);

  // Rotate to latest guess
  useEffect(() => {
    if (guesses.length > 0 && globeRef.current) {
      const latest = guesses[0];
      globeRef.current.pointOfView({ lat: latest.country.lat, lng: latest.country.lng, altitude: 2 }, 1000);
    }
  }, [guesses]);

  // Country numeric ID to ISO mapping (world-atlas uses numeric IDs)
  // We need to match features. world-atlas numeric = UN M49 codes
  // We'll use a mapping approach
  const isoNumericMap = useMemo(() => {
    // Build from country features - they have numeric id property
    const map = new Map<string, string>();
    // Common numeric to ISO2 mappings
    const n2i: Record<string, string> = {
      '4': 'AF', '8': 'AL', '12': 'DZ', '20': 'AD', '24': 'AO', '28': 'AG', '32': 'AR', '51': 'AM',
      '36': 'AU', '40': 'AT', '31': 'AZ', '44': 'BS', '48': 'BH', '50': 'BD', '52': 'BB', '112': 'BY',
      '56': 'BE', '84': 'BZ', '204': 'BJ', '64': 'BT', '68': 'BO', '70': 'BA', '72': 'BW', '76': 'BR',
      '96': 'BN', '100': 'BG', '854': 'BF', '108': 'BI', '132': 'CV', '116': 'KH', '120': 'CM',
      '124': 'CA', '140': 'CF', '148': 'TD', '152': 'CL', '156': 'CN', '170': 'CO', '174': 'KM',
      '178': 'CG', '180': 'CD', '188': 'CR', '191': 'HR', '192': 'CU', '196': 'CY', '203': 'CZ',
      '208': 'DK', '262': 'DJ', '212': 'DM', '214': 'DO', '218': 'EC', '818': 'EG', '222': 'SV',
      '226': 'GQ', '232': 'ER', '233': 'EE', '748': 'SZ', '231': 'ET', '242': 'FJ', '246': 'FI',
      '250': 'FR', '266': 'GA', '270': 'GM', '268': 'GE', '276': 'DE', '288': 'GH', '300': 'GR',
      '308': 'GD', '320': 'GT', '324': 'GN', '624': 'GW', '328': 'GY', '332': 'HT', '340': 'HN',
      '348': 'HU', '352': 'IS', '356': 'IN', '360': 'ID', '364': 'IR', '368': 'IQ', '372': 'IE',
      '376': 'IL', '380': 'IT', '384': 'CI', '388': 'JM', '392': 'JP', '400': 'JO', '398': 'KZ',
      '404': 'KE', '296': 'KI', '-99': 'XK', '414': 'KW', '417': 'KG', '418': 'LA', '428': 'LV',
      '422': 'LB', '426': 'LS', '430': 'LR', '434': 'LY', '438': 'LI', '440': 'LT', '442': 'LU',
      '450': 'MG', '454': 'MW', '458': 'MY', '462': 'MV', '466': 'ML', '470': 'MT', '584': 'MH',
      '478': 'MR', '480': 'MU', '484': 'MX', '583': 'FM', '498': 'MD', '492': 'MC', '496': 'MN',
      '499': 'ME', '504': 'MA', '508': 'MZ', '104': 'MM', '516': 'NA', '520': 'NR', '524': 'NP',
      '528': 'NL', '554': 'NZ', '558': 'NI', '562': 'NE', '566': 'NG', '408': 'KP', '807': 'MK',
      '578': 'NO', '512': 'OM', '586': 'PK', '585': 'PW', '275': 'PS', '591': 'PA', '598': 'PG',
      '600': 'PY', '604': 'PE', '608': 'PH', '616': 'PL', '620': 'PT', '634': 'QA', '642': 'RO',
      '643': 'RU', '646': 'RW', '659': 'KN', '662': 'LC', '670': 'VC', '882': 'WS', '674': 'SM',
      '678': 'ST', '682': 'SA', '686': 'SN', '688': 'RS', '690': 'SC', '694': 'SL', '702': 'SG',
      '703': 'SK', '705': 'SI', '90': 'SB', '706': 'SO', '710': 'ZA', '410': 'KR', '728': 'SS',
      '724': 'ES', '144': 'LK', '729': 'SD', '740': 'SR', '752': 'SE', '756': 'CH', '760': 'SY',
      '158': 'TW', '762': 'TJ', '834': 'TZ', '764': 'TH', '626': 'TL', '768': 'TG', '776': 'TO',
      '780': 'TT', '788': 'TN', '792': 'TR', '795': 'TM', '798': 'TV', '800': 'UG', '804': 'UA',
      '784': 'AE', '826': 'GB', '840': 'US', '858': 'UY', '860': 'UZ', '548': 'VU', '336': 'VA',
      '862': 'VE', '704': 'VN', '887': 'YE', '894': 'ZM', '716': 'ZW',
    };
    for (const [num, iso] of Object.entries(n2i)) {
      map.set(num, iso);
    }
    return map;
  }, []);

  const getCountryIso = useCallback((feat: CountryFeature): string => {
    // Try properties first
    if (feat.properties.ISO_A2 && feat.properties.ISO_A2 !== '-99') return feat.properties.ISO_A2;
    // Use numeric id
    const id = (feat as unknown as { id: string }).id;
    if (id) {
      // Try as-is first, then strip leading zeros (world-atlas uses "076", lookup has "76")
      if (isoNumericMap.has(id)) return isoNumericMap.get(id)!;
      const stripped = String(parseInt(id, 10));
      if (isoNumericMap.has(stripped)) return isoNumericMap.get(stripped)!;
    }
    return '';
  }, [isoNumericMap]);

  const polygonColor = useCallback((feat: object) => {
    const f = feat as CountryFeature;
    const iso = getCountryIso(f);
    if (!iso) return 'rgba(0,0,0,0)';

    // Target found
    if (targetFound && iso === targetCountryIso) return 'rgba(34, 197, 94, 0.95)';

    const guess = guessMap.get(iso);
    if (guess) {
      // Strong opaque overlay so colors are clearly visible on satellite texture
      const colorMap: Record<string, string> = {
        correct: 'rgba(34, 197, 94, 0.95)',
        hot: 'rgba(239, 68, 68, 0.9)',
        warm: 'rgba(249, 115, 22, 0.85)',
        medium: 'rgba(234, 179, 8, 0.8)',
        cool: 'rgba(59, 130, 246, 0.8)',
      };
      return colorMap[guess.color] || 'rgba(59, 130, 246, 0.8)';
    }
    // Transparent so satellite texture shows through
    return 'rgba(0,0,0,0)';
  }, [guessMap, targetFound, targetCountryIso, getCountryIso]);

  // Force globe to re-render polygons when guesses change by creating a new array reference
  const polygonsData = useMemo(() => [...countries], [countries, guesses]);

  const polygonSideColor = useCallback(() => 'rgba(0,0,0,0)', []);
  const polygonStrokeColor = useCallback(() => 'rgba(255,255,255,0.3)', []);

  const polygonLabel = useCallback((feat: object) => {
    const f = feat as CountryFeature;
    const name = f.properties.ADMIN || f.properties.NAME || '';
    const iso = getCountryIso(f);
    const guess = guessMap.get(iso);
    if (guess) {
      return `<div style="background:rgba(0,0,0,0.8);color:white;padding:4px 8px;border-radius:4px;font-size:12px">
        ${guess.country.emoji} ${guess.country.name} — ${guess.distance.toLocaleString()} km ${guess.direction}
      </div>`;
    }
    return `<div style="background:rgba(0,0,0,0.7);color:white;padding:4px 8px;border-radius:4px;font-size:12px">${name}</div>`;
  }, [guessMap, getCountryIso]);

  return (
    <div ref={containerRef} className="w-full rounded-xl overflow-hidden" style={{ background: '#001a45' }}>
      {countries.length > 0 && (
        <Globe
          ref={globeRef}
          width={dimensions.width}
          height={dimensions.height}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          backgroundColor="rgba(0,0,0,0)"
          showGlobe={true}
          showAtmosphere={true}
          atmosphereColor="#6bb3ff"
          atmosphereAltitude={0.25}
          polygonsData={polygonsData}
          polygonCapColor={polygonColor}
          polygonSideColor={polygonSideColor}
          polygonStrokeColor={polygonStrokeColor}
          polygonLabel={polygonLabel}
          polygonAltitude={(feat: object) => {
            const f = feat as CountryFeature;
            const iso = getCountryIso(f);
            if (targetFound && iso === targetCountryIso) return 0.06;
            if (guessMap.has(iso)) return 0.03;
            return 0.001;
          }}
        />
      )}
    </div>
  );
}
