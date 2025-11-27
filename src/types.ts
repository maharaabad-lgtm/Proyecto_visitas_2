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
