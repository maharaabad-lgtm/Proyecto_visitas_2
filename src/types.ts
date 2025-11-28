// src/types.ts

export interface Property {
  id: string;
  property_name: string;
  address: string;
  comuna: string;
  rol: string | null;
  owner_name: string | null;
  condominium_name: string | null;
  property_type: string | null;
  status: 'Disponible' | 'Arrendado' | 'Aviso entrega';
  fecha_disponible_desde: string | null; // viene como fecha en texto
  avaluo_fiscal: number | null;
  valor_comercial_uf: number | null;
  arriendo_publicacion_uf: number | null;
  superficie_terreno: number | null;
  superficie_construida: number | null;
  superficie_bodega: number | null;
}

// --- Tipos para el módulo "Mapa de Inversiones" ---

// El status real en BD viene como texto (por ahora usamos string genérico)
export type PropertyStatusRaw = string;

// Esta es la versión "fila cruda" que viene desde Supabase para el mapa
export interface InvestmentPropertyRow {
  id: string;
  name?: string | null;           // nombre corto de la propiedad (si lo tienes)
  address: string;
  comuna?: string | null;
  ciudad?: string | null;
  region?: string | null;

  lat?: number | null;
  lng?: number | null;

  status: PropertyStatusRaw;      // 'Disponible' | 'Arrendado' | 'Aviso entrega' o similar

  // Datos financieros (pueden ser null / N/A por ahora)
  rent_monthly?: number | null;       // renta mensual
  expenses_annual?: number | null;    // gastos anuales
  investment_total?: number | null;   // inversión total

  m2_bodega?: number | null;
  m2_terreno?: number | null;
  m2_construidos?: number | null;

  zone?: string | null;               // zona / sector (opcional)
  property_type?: string | null;      // tipo de propiedad

  vacancy_days_avg?: number | null;   // vacancia promedio (días)
  vacancy_start_date?: string | null; // inicio de vacancia actual (texto)
}

// Esta es la versión ya "procesada" que usa el mapa (agrega métricas calculadas)
export interface InvestmentProperty extends InvestmentPropertyRow {
  surface_total: number | null;          // m2 totales
  rentability_annual_net: number | null; // Rentabilidad neta anual %
  rentability_per_m2: number | null;     // Rentabilidad por m²
  rent_per_m2: number | null;            // Precio arriendo / m²
}

