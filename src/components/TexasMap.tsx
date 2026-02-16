import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Tooltip } from 'react-leaflet';
import type { LatLngBoundsExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Guess, GuessColor } from '../types';
import { getHexColor } from '../utils';

interface TexasMapProps {
  guesses: Guess[];
  showMystery?: { lat: number; lng: number; name: string; population?: number } | null;
}

const TEXAS_BOUNDS: LatLngBoundsExpression = [
  [25.8, -106.7],
  [36.5, -93.5]
];

const TEXAS_CENTER: [number, number] = [31.5, -99.5];

function getBoundaryFillOpacity(color: GuessColor): number {
  return color === 'correct' ? 0.7 : 0.5;
}

function getBoundaryWeight(color: GuessColor): number {
  return color === 'correct' ? 3 : 2;
}

interface CityBoundaryFeature {
  type: 'Feature';
  properties: { name: string; [key: string]: unknown };
  geometry: GeoJSON.Geometry;
}

export function TexasMap({ guesses, showMystery }: TexasMapProps) {
  const [texasOutline, setTexasOutline] = useState<GeoJSON.FeatureCollection | null>(null);
  const [boundaries, setBoundaries] = useState<Map<string, CityBoundaryFeature>>(new Map());

  useEffect(() => {
    fetch('/data/texas_outline_web.geojson')
      .then(res => res.json())
      .then(data => setTexasOutline(data))
      .catch(err => console.error('Failed to load Texas outline:', err));
  }, []);

  useEffect(() => {
    fetch('/data/texas_city_boundaries_web.geojson')
      .then(res => res.json())
      .then((data: GeoJSON.FeatureCollection) => {
        const map = new Map<string, CityBoundaryFeature>();
        for (const feature of data.features) {
          const name = (feature.properties as { name?: string })?.name;
          if (name) map.set(name.toLowerCase(), feature as CityBoundaryFeature);
        }
        setBoundaries(map);
      })
      .catch(err => console.error('Failed to load city boundaries:', err));
  }, []);

  const { boundaryGuesses, dotGuesses } = useMemo(() => {
    const bg: { guess: Guess; feature: CityBoundaryFeature }[] = [];
    const dg: Guess[] = [];
    for (const guess of guesses) {
      const boundary = boundaries.get(guess.city.name.toLowerCase());
      if (boundary) bg.push({ guess, feature: boundary });
      else dg.push(guess);
    }
    return { boundaryGuesses: bg, dotGuesses: dg };
  }, [guesses, boundaries]);

  const mysteryBoundary = useMemo(() => {
    if (!showMystery) return null;
    return boundaries.get(showMystery.name.toLowerCase()) || null;
  }, [showMystery, boundaries]);

  return (
    <div className="w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden border-2 border-white/20 shadow-lg shadow-black/30">
      <MapContainer
        center={TEXAS_CENTER}
        zoom={5}
        minZoom={5}
        maxZoom={13}
        maxBounds={TEXAS_BOUNDS}
        maxBoundsViscosity={1.0}
        style={{ height: '100%', width: '100%', background: '#1a2a1a' }}
        zoomControl={true}
      >
        {/* Terrain relief base — high zoom support */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}"
          attribution='&copy; Esri'
          opacity={1}
          maxZoom={13}
        />
        {/* Physical color overlay for terrain tinting */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}"
          attribution=''
          opacity={0.5}
          maxNativeZoom={8}
          maxZoom={13}
        />
        {/* Roads/highways overlay — sharp at all zooms */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}"
          attribution=''
          opacity={0.5}
          maxZoom={13}
        />

        {texasOutline && (
          <GeoJSON
            data={texasOutline}
            style={{
              color: 'rgba(0, 40, 104, 0.7)',
              weight: 2.5,
              fillColor: 'transparent',
              fillOpacity: 0,
            }}
          />
        )}

        {/* City boundary polygons for guesses */}
        {boundaryGuesses.map(({ guess, feature }) => {
          const isOOB = guess.outOfBand;
          const fillColor = isOOB ? '#FF0000' : getHexColor(guess.color);
          const borderColor = guess.color === 'correct' ? '#00FF00' : isOOB ? '#FF0000' : '#000000';
          const opacity = isOOB ? 0.25 : getBoundaryFillOpacity(guess.color);

          return (
            <GeoJSON
              key={`boundary-${guess.city.name}-${guess.timestamp}`}
              data={feature as unknown as GeoJSON.GeoJsonObject}
              style={{
                color: borderColor,
                weight: getBoundaryWeight(guess.color),
                fillColor,
                fillOpacity: opacity,
                ...(isOOB ? { dashArray: '4 4' } : {}),
                ...(guess.color === 'correct' ? { className: 'correct-boundary-pulse' } : {}),
              }}
            >
              {guess.color === 'correct' ? (
                <Tooltip permanent direction="top">
                  <span className="font-bold">{guess.city.name}</span><span className="ml-1 text-gray-500">(pop: {guess.city.population.toLocaleString()})</span>
                  <span className="text-green-600 ml-1">🎉</span>
                </Tooltip>
              ) : (
                <Tooltip direction="top" sticky>
                  <span className="font-semibold">{guess.city.name}</span><span className="ml-1 text-gray-500">(pop: {guess.city.population.toLocaleString()})</span>
                  <span className="ml-1 text-gray-600">{guess.distance} mi</span>
                  {isOOB && <span className="ml-1 text-red-600">(out of pool)</span>}
                </Tooltip>
              )}
            </GeoJSON>
          );
        })}

        {/* Fallback CircleMarkers */}
        {dotGuesses.map((guess, index) => {
          const isOOB = guess.outOfBand;
          return (
            <CircleMarker
              key={`dot-${guess.city.name}-${index}`}
              center={[guess.city.lat, guess.city.lng]}
              radius={guess.color === 'correct' ? 16 : 10}
              pathOptions={{
                color: guess.color === 'correct' ? '#00FF00' : isOOB ? '#FF0000' : '#000000',
                fillColor: isOOB ? '#FF0000' : getHexColor(guess.color),
                fillOpacity: isOOB ? 0.4 : 0.9,
                weight: 2.5,
                ...(isOOB ? { dashArray: '4 4' } : {}),
                ...(guess.color === 'correct' ? { className: 'correct-boundary-pulse' } : {}),
              }}
            >
              {guess.color === 'correct' ? (
                <Tooltip permanent direction="top">
                  <span className="font-bold">{guess.city.name}</span><span className="ml-1 text-gray-500">(pop: {guess.city.population.toLocaleString()})</span>
                  <span className="text-green-600 ml-1">🎉</span>
                </Tooltip>
              ) : (
                <Tooltip direction="top">
                  <span className="font-semibold">{guess.city.name}</span><span className="ml-1 text-gray-500">(pop: {guess.city.population.toLocaleString()})</span>
                  <span className="ml-1 text-gray-600">{guess.distance} mi</span>
                  {isOOB && <span className="ml-1 text-red-600">(out of pool)</span>}
                </Tooltip>
              )}
            </CircleMarker>
          );
        })}

        {/* Mystery city shown after game ends */}
        {showMystery && mysteryBoundary && (
          <GeoJSON
            key={`mystery-boundary-${showMystery.name}`}
            data={mysteryBoundary as unknown as GeoJSON.GeoJsonObject}
            style={{
              color: '#00FF00',
              weight: 3,
              fillColor: '#00FF00',
              fillOpacity: 0.7,
              className: 'correct-boundary-pulse',
            }}
          >
            <Tooltip permanent direction="top">
              <span className="font-bold text-green-600">🎯 {showMystery.name}</span>{showMystery.population && <span className="ml-1 text-gray-500">(pop: {showMystery.population.toLocaleString()})</span>}
            </Tooltip>
          </GeoJSON>
        )}
        {showMystery && !mysteryBoundary && (
          <CircleMarker
            center={[showMystery.lat, showMystery.lng]}
            radius={12}
            pathOptions={{
              color: '#00FF00',
              fillColor: '#00FF00',
              fillOpacity: 0.9,
              weight: 3
            }}
          >
            <Tooltip permanent direction="top">
              <span className="font-bold text-green-600">🎯 {showMystery.name}</span>{showMystery.population && <span className="ml-1 text-gray-500">(pop: {showMystery.population.toLocaleString()})</span>}
            </Tooltip>
          </CircleMarker>
        )}
      </MapContainer>
    </div>
  );
}
