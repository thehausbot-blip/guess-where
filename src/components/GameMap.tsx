import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Guess, GuessColor } from '../types';
import type { MapConfig } from '../mapConfigs';
import { getHexColor } from '../utils';
import { convertDistance, type DistanceUnit } from '../hooks/useUnitPref';
import { useI18n } from '../i18n/useI18n';

interface GameMapProps {
  config: MapConfig;
  guesses: Guess[];
  showMystery?: { lat: number; lng: number; name: string; population?: number } | null;
  tierWinners?: Guess[];
  distUnit?: DistanceUnit;
}

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

export function GameMap({ config, guesses, showMystery, tierWinners = [], distUnit = 'mi' }: GameMapProps) {
  const { t } = useI18n();
  const [outline, setOutline] = useState<GeoJSON.FeatureCollection | null>(null);
  const [boundaries, setBoundaries] = useState<Map<string, CityBoundaryFeature>>(new Map());

  useEffect(() => {
    setOutline(null);
    setBoundaries(new Map());
    
    fetch(config.outlineFile)
      .then(res => res.json())
      .then(data => setOutline(data))
      .catch(err => console.error('Failed to load outline:', err));

    if (config.boundaryFile) {
      fetch(config.boundaryFile)
        .then(res => {
          if (!res.ok) throw new Error('not found');
          return res.json();
        })
        .then((data: GeoJSON.FeatureCollection) => {
          const map = new Map<string, CityBoundaryFeature>();
          for (const feature of data.features) {
            let name = (feature.properties as { name?: string; NAME?: string })?.name 
              || (feature.properties as { NAME?: string })?.NAME;
            if (name) {
              // Clean name same way as useGame cleans city names
              name = name
                .replace(/\s+(city|town|village|CDP|borough|municipality),?\s*.*/i, '')
                .replace(/,\s+\w[\w\s]*$/, '')
                .trim();
              map.set(name.toLowerCase(), feature as CityBoundaryFeature);
            }
          }
          setBoundaries(map);
        })
        .catch(() => { /* boundaries not available yet — use dots */ });
    }
  }, [config.id]);

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

  const unit = distUnit;

  return (
    <div className="w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden border-2 border-white/20 shadow-lg shadow-black/30">
      <MapContainer
        key={config.id}
        center={config.center}
        zoom={config.zoom}
        minZoom={config.minZoom}
        maxZoom={config.maxZoom}
        maxBounds={config.bounds}
        maxBoundsViscosity={1.0}
        style={{ height: '100%', width: '100%', background: '#1a2a1a' }}
        zoomControl={true}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}"
          attribution='&copy; Esri'
          opacity={1}
          maxZoom={config.maxZoom}
        />
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}"
          attribution=''
          opacity={0.5}
          maxNativeZoom={8}
          maxZoom={config.maxZoom}
        />
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}"
          attribution=''
          opacity={0.5}
          maxZoom={config.maxZoom}
        />

        {outline && (
          <GeoJSON
            key={`outline-${config.id}`}
            data={outline}
            style={{
              color: 'rgba(0, 40, 104, 0.7)',
              weight: 2.5,
              fillColor: 'transparent',
              fillOpacity: 0,
            }}
          />
        )}

        {boundaryGuesses.map(({ guess, feature }) => {
          const isOOB = guess.outOfBand;
          const fillColor = isOOB ? '#888888' : getHexColor(guess.color);
          const borderColor = guess.color === 'correct' ? '#00FF00' : isOOB ? '#666666' : '#000000';
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
                  <span className="font-bold">{guess.city.name}</span>
                  <span className="ml-1 text-gray-500">({t('game.pop')}: {guess.city.population.toLocaleString()})</span>
                  <span className="text-green-600 ml-1">🎉</span>
                </Tooltip>
              ) : (
                <Tooltip direction="top" sticky>
                  <span className="font-semibold">{guess.city.name}</span>
                  <span className="ml-1 text-gray-500">({t('game.pop')}: {guess.city.population.toLocaleString()})</span>
                  <span className="ml-1 text-gray-600">{convertDistance(guess.distance, unit)} {unit}</span>
                  {isOOB && <span className="ml-1 text-gray-500">({t('guessList.outOfPool')})</span>}
                </Tooltip>
              )}
            </GeoJSON>
          );
        })}

        {dotGuesses.map((guess, index) => {
          const isOOB = guess.outOfBand;
          return (
            <CircleMarker
              key={`dot-${guess.city.name}-${index}`}
              center={[guess.city.lat, guess.city.lng]}
              radius={guess.color === 'correct' ? 16 : 10}
              pathOptions={{
                color: guess.color === 'correct' ? '#00FF00' : isOOB ? '#666666' : '#000000',
                fillColor: isOOB ? '#888888' : getHexColor(guess.color),
                fillOpacity: isOOB ? 0.4 : 0.9,
                weight: 2.5,
                ...(isOOB ? { dashArray: '4 4' } : {}),
                ...(guess.color === 'correct' ? { className: 'correct-boundary-pulse' } : {}),
              }}
            >
              {guess.color === 'correct' ? (
                <Tooltip permanent direction="top">
                  <span className="font-bold">{guess.city.name}</span>
                  <span className="ml-1 text-gray-500">({t('game.pop')}: {guess.city.population.toLocaleString()})</span>
                  <span className="text-green-600 ml-1">🎉</span>
                </Tooltip>
              ) : (
                <Tooltip direction="top">
                  <span className="font-semibold">{guess.city.name}</span>
                  <span className="ml-1 text-gray-500">({t('game.pop')}: {guess.city.population.toLocaleString()})</span>
                  <span className="ml-1 text-gray-600">{convertDistance(guess.distance, unit)} {unit}</span>
                  {isOOB && <span className="ml-1 text-gray-500">({t('guessList.outOfPool')})</span>}
                </Tooltip>
              )}
            </CircleMarker>
          );
        })}

        {/* Previous tier winners */}
        {tierWinners.map((guess) => {
          const winnerBoundary = boundaries.get(guess.city.name.toLowerCase());
          if (winnerBoundary) {
            return (
              <GeoJSON
                key={`winner-boundary-${guess.city.name}`}
                data={winnerBoundary as unknown as GeoJSON.GeoJsonObject}
                style={{
                  color: '#00FF00',
                  weight: 2,
                  fillColor: '#00FF00',
                  fillOpacity: 0.3,
                }}
              >
                <Tooltip direction="top" sticky>
                  <span className="font-bold text-green-600">✅ {guess.city.name}</span>
                  <span className="ml-1 text-gray-500">({t('game.pop')}: {guess.city.population.toLocaleString()})</span>
                </Tooltip>
              </GeoJSON>
            );
          }
          return (
            <CircleMarker
              key={`winner-dot-${guess.city.name}`}
              center={[guess.city.lat, guess.city.lng]}
              radius={10}
              pathOptions={{
                color: '#00FF00',
                fillColor: '#00FF00',
                fillOpacity: 0.4,
                weight: 2,
              }}
            >
              <Tooltip direction="top">
                <span className="font-bold text-green-600">✅ {guess.city.name}</span>
                <span className="ml-1 text-gray-500">({t('game.pop')}: {guess.city.population.toLocaleString()})</span>
              </Tooltip>
            </CircleMarker>
          );
        })}

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
              <span className="font-bold text-green-600">🎯 {showMystery.name}</span>
              {showMystery.population && <span className="ml-1 text-gray-500">({t('game.pop')}: {showMystery.population.toLocaleString()})</span>}
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
              <span className="font-bold text-green-600">🎯 {showMystery.name}</span>
              {showMystery.population && <span className="ml-1 text-gray-500">({t('game.pop')}: {showMystery.population.toLocaleString()})</span>}
            </Tooltip>
          </CircleMarker>
        )}
        <ScaleBar />
      </MapContainer>
    </div>
  );
}

function ScaleBar() {
  const map = useMap();
  useEffect(() => {
    const scale = L.control.scale({
      position: 'bottomleft',
      imperial: true,
      metric: true,
      maxWidth: 150,
    });
    scale.addTo(map);
    return () => { scale.remove(); };
  }, [map]);
  return null;
}
