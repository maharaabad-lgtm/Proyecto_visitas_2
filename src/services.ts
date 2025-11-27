// src/services.ts
import { supabase } from './supabaseClient';
import type { Property } from './types';

export const Services = {
  async fetchPropertiesFromSupabase(): Promise<Property[]> {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('property_name', { ascending: true });

    if (error) {
      console.error('Error al cargar propiedades desde Supabase:', error);
      return [];
    }

    return (data || []) as Property[];
  },
};


