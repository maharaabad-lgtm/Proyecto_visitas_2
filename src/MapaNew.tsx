// src/MapaNew.tsx

import React, { useEffect, useMemo, useState } from 'react';
import {
  GoogleMap,
  Marker,
  InfoWindow,
  HeatmapLayer,
  useJsApiLoader,
} from '@react-google-maps/api';

import { supabase } from './supabaseClient';
import type { InvestmentPropertyRow, InvestmentProperty } from './types';
import { MapPin, Filter, TrendingUp, AlertTriangle } from 'lucide-react';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;

// Tamaño del contenedor del mapa
const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

type StatusFilterOption = 'ALL' | 'AVAILABLE' | 'LEASED' | 'NOTICE';

interface FiltersState {
  status: StatusFilterOption;
  minRentability?: number;
  maxRentability?: number;
  zone: string;
  propertyType: string;
}

const DEFAULT_FILTERS: FiltersState = {
  status: 'ALL',
  minRentability: undefined,
  maxRentability: undefined,
  zone: '',
  propertyType: '',
};

// Helpers para colores según texto del estado real
const getStatusColor = (statusRaw: string) => {
  const s = (statusRaw || '').toUpperCase();

  if (s.includes('ARREND')) return '#16a34a';          // Arrendada → verde
  if (s.includes('AVISO') || s.includes('NOTICE')) return '#eab308'; // Aviso → amarillo
  if (s.includes('DISP') || s.includes('AVAIL')) return '#ef4444';   // Disponible → rojo

  return '#64748b'; // default gris
};

const getStatusLabel = (statusRaw: string) => {
  const s = (statusRaw || '').toUpperCase();
  if (s.includes('ARREND')) return 'Arrendada';
  if (s.includes('AVISO') || s.includes('NOTICE')) return 'Con aviso de entrega';
  if (s.includes('DISP') || s.includes('AVAIL')) return 'Disponible';
  return statusRaw || 'Sin estado';
};

const formatNumber = (value: number | null | undefined, decimals = 1) => {
  if (value === null || value === undefined || Number.isNaN(value)) return 'N/A';
  return value.toFixed(decimals);
};

const buildFullAddress = (p: InvestmentPropertyRow) => {
  const parts = [p.address, p.comuna, p.ciudad, p.region].filter(Boolean);
  return parts.join(', ');
};

// Calcula métricas derivadas para cada propiedad
const computeMetrics = (row: InvestmentPropertyRow): InvestmentProperty => {
  const m2_bodega = row.m2_bodega ?? 0;
  const m2_terreno = row.m2_terreno ?? 0;
  const m2_construidos = row.m2_construidos ?? 0;

  const surface_total = m2_bodega + m2_terreno + m2_construidos || null;

  const rent_monthly = row.rent_monthly ?? null;
  const expenses_annual = row.expenses_annual ?? null;
  const investment_total = row.investment_total ?? null;

  let rentability_annual_net: number | null = null;
  let rentability_per_m2: number | null = null;
  let rent_per_m2: number | null = null;

  if (rent_monthly !== null && investment_total !== null && investment_total > 0) {
    const renta_anual = rent_monthly * 12;
    const gastos = expenses_annual ?? 0;

    // Rentabilidad neta anual (%) = (Renta anual – gastos) / inversión total × 100
    rentability_annual_net = ((renta_anual - gastos) / investment_total) * 100;

    if (surface_total && surface_total > 0) {
      // Rentabilidad por m² = rentabilidad neta / superficie
      rentability_per_m2 = rentability_annual_net / surface_total;

      // Precio promedio m2 = renta mensual / m2 totales
      rent_per_m2 = rent_monthly / surface_total;
    }
  }

  return {
    ...row,
    surface_total,
    rentability_annual_net,
    rentability_per_m2,
    rent_per_m2,
  };
};

// Geocoding usando Google Maps
const geocodeWithGoogle = async (
  property: InvestmentPropertyRow,
): Promise<{ lat?: number; lng?: number }> => {
  if (!GOOGLE_MAPS_API_KEY) return {};
  const fullAddress = buildFullAddress(property);
  if (!fullAddress) return {};

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      fullAddress,
    )}&key=${GOOGLE_MAPS_API_KEY}`;
    const res = await fetch(url);
    const json = await res.json();

    if (json.results && json.results.length > 0) {
      const loc = json.results[0].geometry.location;
      return { lat: loc.lat, lng: loc.lng };
    }
  } catch (err) {
    console.error('Error geocodificando propiedad', property.id, err);
  }

  return {};
};

const MapaNew: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [properties, setProperties] = useState<InvestmentProperty[]>([]);
  const [filters, setFilters] = useState<FiltersState>(DEFAULT_FILTERS);

  const [selectedProperty, setSelectedProperty] = useState<InvestmentProperty | null>(null);

  // Centro del mapa (Santiago por defecto)
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: -33.4569,
    lng: -70.6483,
  });
  const [mapZoom, setMapZoom] = useState(10);

  // Carga del script de Google Maps
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY || '',
    libraries: ['visualization'] as any, // para Heatmap
  });

  // Cargar datos desde Supabase
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

        const { data, error } = await supabase
      .from('properties') // misma tabla que usa el resto de tu app
      .select('*');       // traemos todas las columnas

    if (error) {
      console.error('Error Supabase mapa inversiones:', error);
      setError('Error al cargar propiedades para el mapa de inversiones.');
      setLoading(false);
      return;
    }

    const rows = (data ?? []) as any[];

    // Adaptamos lo que viene de tu tabla "properties" a InvestmentPropertyRow
    const computed: InvestmentProperty[] = rows.map((row) => {
      const base: InvestmentPropertyRow = {
        id: row.id,
        // usamos property_name si existe, si no name, si no null
        name: row.property_name ?? row.name ?? null,
        address: row.address ?? '',
        comuna: row.comuna ?? null,
        ciudad: row.ciudad ?? null,
        region: row.region ?? null,

        lat: row.lat ?? null,
        lng: row.lng ?? null,

        status: row.status ?? '',

        // Si tu tabla tiene renta en UF, la mapeamos aquí
        rent_monthly: row.rent_uf ?? row.rent_monthly ?? null,

        // Si más adelante agregas estos campos, se usarán; por ahora N/A
        expenses_annual: row.expenses_annual ?? null,
        investment_total: row.investment_total ?? row.valor_comercial_uf ?? null,

        m2_bodega: row.m2_bodega ?? null,
        m2_terreno: row.m2_terreno ?? null,
        m2_construidos: row.m2_construidos ?? null,

        zone: row.zone ?? row.zona ?? null,
        property_type: row.property_type ?? null,

        vacancy_days_avg: row.vacancy_days_avg ?? null,
        vacancy_start_date: row.vacancy_start_date ?? null,
      };

      return computeMetrics(base);
    });

    // Si hay coordenadas, centramos el mapa
    const coords = computed.filter((p) => p.lat != null && p.lng != null);
    if (coords.length > 0) {
      const avgLat = coords.reduce((sum, p) => sum + (p.lat ?? 0), 0) / coords.length;
      const avgLng = coords.reduce((sum, p) => sum + (p.lng ?? 0), 0) / coords.length;
      setMapCenter({ lat: avgLat, lng: avgLng });
      setMapZoom(11);
    }

    setProperties(computed);
    setLoading(false);
  

      setProperties(computed);
      setLoading(false);
    };

    loadData();
  }, []);

  // Geocodificar propiedades sin coordenadas (front, demo)
  useEffect(() => {
    const runGeocoding = async () => {
      if (!GOOGLE_MAPS_API_KEY) return;
      if (!properties.length) return;
      if (geocoding) return;

      const missing = properties.filter((p) => (p.lat == null || p.lng == null) && p.address);
      if (!missing.length) return;

      setGeocoding(true);
      const updated = [...properties];

      for (const prop of missing) {
        const coords = await geocodeWithGoogle(prop);
        if (coords.lat && coords.lng) {
          const index = updated.findIndex((p) => p.id === prop.id);
          if (index >= 0) {
            updated[index] = {
              ...updated[index],
              lat: coords.lat,
              lng: coords.lng,
            };
          }
        }
      }

      setProperties(updated);
      setGeocoding(false);
    };

    runGeocoding();
  }, [properties, geocoding]);

  // Listas de zonas y tipos para los filtros
  const zones = useMemo(() => {
    const set = new Set<string>();
    properties.forEach((p) => {
      if (p.zone) set.add(p.zone);
    });
    return Array.from(set);
  }, [properties]);

  const propertyTypes = useMemo(() => {
    const set = new Set<string>();
    properties.forEach((p) => {
      if (p.property_type) set.add(p.property_type);
    });
    return Array.from(set);
  }, [properties]);

  // Aplicar filtros
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      // Filtro de estado (según palabras clave en español)
      if (filters.status !== 'ALL') {
        const s = (p.status || '').toUpperCase();

        if (filters.status === 'AVAILABLE') {
          if (!(s.includes('DISP') || s.includes('AVAIL'))) return false;
        }
        if (filters.status === 'LEASED') {
          if (!s.includes('ARREND')) return false;
        }
        if (filters.status === 'NOTICE') {
          if (!(s.includes('AVISO') || s.includes('NOTICE'))) return false;
        }
      }

      if (filters.zone && p.zone !== filters.zone) {
        return false;
      }

      if (filters.propertyType && p.property_type !== filters.propertyType) {
        return false;
      }

      if (filters.minRentability !== undefined && p.rentability_annual_net !== null) {
        if (p.rentability_annual_net < filters.minRentability) return false;
      }

      if (filters.maxRentability !== undefined && p.rentability_annual_net !== null) {
        if (p.rentability_annual_net > filters.maxRentability) return false;
      }

      return true;
    });
  }, [properties, filters]);

  // Métricas agregadas (promedios, top zonas)
  const {
    avgRentabilityTotal,
    avgVacancy,
    topZonesRentables,
    topZonesRiesgosas,
  } = useMemo(() => {
    if (!properties.length) {
      return {
        avgRentabilityTotal: null,
        avgVacancy: null,
        topZonesRentables: [] as { zone: string; rentability: number | null }[],
        topZonesRiesgosas: [] as { zone: string; vacancy: number | null }[],
      };
    }

    const rentProps = properties.filter((p) => p.rentability_annual_net !== null);
    const avgRent =
      rentProps.length > 0
        ? rentProps.reduce((sum, p) => sum + (p.rentability_annual_net ?? 0), 0) /
          rentProps.length
        : null;

    const vacProps = properties.filter(
      (p) => p.vacancy_days_avg !== null && p.vacancy_days_avg !== undefined,
    );
    const avgVac =
      vacProps.length > 0
        ? vacProps.reduce((sum, p) => sum + (p.vacancy_days_avg ?? 0), 0) / vacProps.length
        : null;

    const byZone = new Map<
      string,
      { rentSum: number; rentCount: number; vacancySum: number; vacancyCount: number }
    >();

    properties.forEach((p) => {
      const zone = p.zone ?? 'Sin zona';
      if (!byZone.has(zone)) {
        byZone.set(zone, { rentSum: 0, rentCount: 0, vacancySum: 0, vacancyCount: 0 });
      }
      const agg = byZone.get(zone)!;

      if (p.rentability_annual_net !== null) {
        agg.rentSum += p.rentability_annual_net;
        agg.rentCount += 1;
      }

      if (p.vacancy_days_avg !== null && p.vacancy_days_avg !== undefined) {
        agg.vacancySum += p.vacancy_days_avg;
        agg.vacancyCount += 1;
      }
    });

    const zonesRent: { zone: string; rentability: number | null }[] = [];
    const zonesVac: { zone: string; vacancy: number | null }[] = [];

    byZone.forEach((agg, zone) => {
      zonesRent.push({
        zone,
        rentability: agg.rentCount ? agg.rentSum / agg.rentCount : null,
      });
      zonesVac.push({
        zone,
        vacancy: agg.vacancyCount ? agg.vacancySum / agg.vacancyCount : null,
      });
    });

    zonesRent.sort((a, b) => (b.rentability ?? -Infinity) - (a.rentability ?? -Infinity));
    const topRent = zonesRent.slice(0, 3);

    zonesVac.sort((a, b) => (b.vacancy ?? -Infinity) - (a.vacancy ?? -Infinity));
    const topRisk = zonesVac.slice(0, 3);

    return {
      avgRentabilityTotal: avgRent,
      avgVacancy: avgVac,
      topZonesRentables: topRent,
      topZonesRiesgosas: topRisk,
    };
  }, [properties]);

  // Heatmap data (Google Maps Visualization)
  const heatmapData = useMemo(() => {
    if (!isLoaded || !(window as any).google) return [];
    return filteredProperties
      .filter((p) => p.lat != null && p.lng != null)
      .map(
        (p) =>
          new (window as any).google.maps.LatLng(
            p.lat as number,
            p.lng as number,
          ),
      );
  }, [filteredProperties, isLoaded]);

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-7rem)] gap-4">
      {/* Panel lateral */}
      <aside className="w-full md:w-80 xl:w-96 bg-white rounded-2xl shadow-sm border border-slate-200 p-4 space-y-4 overflow-y-auto">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-sky-600" />
            Mapa de Inversiones
          </h2>
          {(loading || geocoding) && (
            <span className="text-xs text-slate-500">
              {loading ? 'Cargando datos…' : 'Geolocalizando…'}
            </span>
          )}
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-3">
            {error}
          </div>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-1 gap-3">
          <div className="rounded-xl border border-slate-200 p-3 bg-slate-50/60">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs uppercase tracking-wide text-slate-500">
                Rentabilidad promedio total
              </span>
              <TrendingUp className="w-4 h-4 text-sky-600" />
            </div>
            <p className="text-xl font-semibold text-slate-900">
              {avgRentabilityTotal !== null ? `${avgRentabilityTotal.toFixed(1)} %` : 'N/A'}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 p-3 bg-slate-50/60">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs uppercase tracking-wide text-slate-500">
                Vacancia promedio
              </span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-xl font-semibold text-slate-900">
              {avgVacancy !== null ? `${avgVacancy.toFixed(0)} días` : 'N/A'}
            </p>
          </div>
        </div>

        {/* Top zonas */}
        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-1">
              Top 3 zonas más rentables
            </p>
            <div className="space-y-1">
              {topZonesRentables.length === 0 && (
                <p className="text-xs text-slate-400">
                  N/A (faltan datos de rentabilidad)
                </p>
              )}
              {topZonesRentables.map((z) => (
                <div
                  key={z.zone}
                  className="flex items-center justify-between text-xs rounded-lg bg-emerald-50 border border-emerald-100 px-2 py-1"
                >
                  <span className="font-medium text-emerald-900">{z.zone}</span>
                  <span className="text-emerald-700">
                    {z.rentability !== null ? `${z.rentability.toFixed(1)} %` : 'N/A'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500 mb-1">
              Top 3 zonas más riesgosas
            </p>
            <div className="space-y-1">
              {topZonesRiesgosas.length === 0 && (
                <p className="text-xs text-slate-400">
                  N/A (faltan datos de vacancia)
                </p>
              )}
              {topZonesRiesgosas.map((z) => (
                <div
                  key={z.zone}
                  className="flex items-center justify-between text-xs rounded-lg bg-rose-50 border border-rose-100 px-2 py-1"
                >
                  <span className="font-medium text-rose-900">{z.zone}</span>
                  <span className="text-rose-700">
                    {z.vacancy !== null ? `${z.vacancy.toFixed(0)} días` : 'N/A'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="pt-2 border-t border-slate-200 mt-2">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Filtros
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Estado */}
            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-slate-500">
                Estado
              </label>
              <select
                className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
                value={filters.status}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    status: e.target.value as StatusFilterOption,
                  }))
                }
              >
                <option value="ALL">Todos</option>
                <option value="AVAILABLE">Disponible</option>
                <option value="LEASED">Arrendada</option>
                <option value="NOTICE">Con aviso de entrega</option>
              </select>
            </div>

            {/* Zona */}
            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-slate-500">
                Zona
              </label>
              <select
                className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
                value={filters.zone}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    zone: e.target.value,
                  }))
                }
              >
                <option value="">Todas</option>
                {zones.map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </select>
            </div>

            {/* Tipo de propiedad */}
            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-slate-500">
                Tipo de propiedad
              </label>
              <select
                className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
                value={filters.propertyType}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    propertyType: e.target.value,
                  }))
                }
              >
                <option value="">Todos</option>
                {propertyTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Rango de rentabilidad */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-medium text-slate-500">
                  Rent. min (%)
                </label>
                <input
                  type="number"
                  className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
                  value={filters.minRentability ?? ''}
                  onChange={(e) =>
                    setFilters((f) => ({
                      ...f,
                      minRentability:
                        e.target.value === '' ? undefined : Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-500">
                  Rent. máx (%)
                </label>
                <input
                  type="number"
                  className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
                  value={filters.maxRentability ?? ''}
                  onChange={(e) =>
                    setFilters((f) => ({
                      ...f,
                      maxRentability:
                        e.target.value === '' ? undefined : Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>

            <button
              type="button"
              className="mt-2 w-full text-xs border border-slate-200 rounded-lg px-2 py-1.5 text-slate-600 hover:bg-slate-50 transition"
              onClick={() => setFilters(DEFAULT_FILTERS)}
            >
              Limpiar filtros
            </button>
          </div>
        </div>

        {/* Leyenda */}
        <div className="pt-2 border-t border-slate-200 mt-2 text-xs">
          <p className="mb-2 font-semibold text-slate-600">Leyenda</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: getStatusColor('ARRENDADA') }}
              />
              <span>Arrendada</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: getStatusColor('AVISO') }}
              />
              <span>Con aviso de entrega</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: getStatusColor('DISPONIBLE') }}
              />
              <span>Disponible</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mapa */}
      <section className="flex-1 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
        {(!GOOGLE_MAPS_API_KEY || loadError) && (
          <div className="h-full flex flex-col items-center justify-center text-sm text-slate-500 p-6">
            {!GOOGLE_MAPS_API_KEY && (
              <p className="mb-2">
                Falta configurar{' '}
                <code className="px-1 py-0.5 rounded bg-slate-900 text-xs text-white">
                  VITE_GOOGLE_MAPS_API_KEY
                </code>
              </p>
            )}
            {loadError && <p>Error al cargar Google Maps.</p>}
          </div>
        )}

        {GOOGLE_MAPS_API_KEY && !loadError && !isLoaded && (
          <div className="h-full flex flex-col items-center justify-center text-sm text-slate-500 p-6">
            Cargando mapa…
          </div>
        )}

        {GOOGLE_MAPS_API_KEY && isLoaded && properties.length === 0 && !loading && (
          <div className="h-full flex flex-col items-center justify-center text-sm text-slate-500 p-6">
            No hay propiedades para mostrar en el mapa.
          </div>
        )}

        {GOOGLE_MAPS_API_KEY && isLoaded && properties.length > 0 && (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={mapZoom}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
          >
            {/* Heatmap de rentabilidad */}
            {heatmapData.length > 0 && (
              <HeatmapLayer data={heatmapData as any} />
            )}

            {/* Marcadores de propiedades */}
            {filteredProperties
              .filter((p) => p.lat != null && p.lng != null)
              .map((p) => (
                <Marker
                  key={p.id}
                  position={{ lat: p.lat as number, lng: p.lng as number }}
                  onClick={() => setSelectedProperty(p)}
                  icon={{
                    path: (window as any).google?.maps.SymbolPath.CIRCLE,
                    scale: 6,
                    fillColor: getStatusColor(p.status),
                    fillOpacity: 1,
                    strokeColor: '#ffffff',
                    strokeWeight: 1,
                  }}
                />
              ))}

            {/* Popup de detalle */}
            {selectedProperty &&
              selectedProperty.lat != null &&
              selectedProperty.lng != null && (
                <InfoWindow
                  position={{
                    lat: selectedProperty.lat as number,
                    lng: selectedProperty.lng as number,
                  }}
                  onCloseClick={() => setSelectedProperty(null)}
                >
                  <div className="text-xs space-y-1">
                    <p className="font-semibold text-slate-900">
                      {selectedProperty.name ?? 'Propiedad sin nombre'}
                    </p>
                    <p className="text-slate-600">
                      {buildFullAddress(selectedProperty)}
                    </p>
                    <p className="mt-1">
                      <span className="font-medium">Estado: </span>
                      {getStatusLabel(selectedProperty.status)}
                    </p>
                    <p>
                      <span className="font-medium">Rentabilidad neta anual: </span>
                      {selectedProperty.rentability_annual_net !== null
                        ? `${selectedProperty.rentability_annual_net.toFixed(1)} %`
                        : 'N/A'}
                    </p>
                    <p>
                      <span className="font-medium">Rentabilidad por m²: </span>
                      {formatNumber(selectedProperty.rentability_per_m2)}
                    </p>
                    <p>
                      <span className="font-medium">Precio arriendo/m²: </span>
                      {selectedProperty.rent_per_m2 !== null
                        ? `${selectedProperty.rent_per_m2.toFixed(1)} UF/m²`
                        : 'N/A'}
                    </p>
                    <p>
                      <span className="font-medium">Vacancia promedio: </span>
                      {selectedProperty.vacancy_days_avg !== null &&
                      selectedProperty.vacancy_days_avg !== undefined
                        ? `${selectedProperty.vacancy_days_avg.toFixed(0)} días`
                        : 'N/A'}
                    </p>
                    <p>
                      <span className="font-medium">Superficie total: </span>
                      {selectedProperty.surface_total !== null
                        ? `${selectedProperty.surface_total.toFixed(0)} m²`
                        : 'N/A'}
                    </p>
                  </div>
                </InfoWindow>
              )}
          </GoogleMap>
        )}
      </section>
    </div>
  );
};

export default MapaNew;
