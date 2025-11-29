// src/services.ts
import { supabase } from './supabaseClient';
import type { Property } from './types';

// 🔹 Servicio para PROPIEDADES
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

// 🔹 Tipos básicos para visitas
type Visit = { [key: string]: any };
type NewVisit = { [key: string]: any };

// 🔹 Servicio para VISITAS (Supabase)
export const VisitsSupabaseService = {
  // 1) Obtener visitas desde Supabase
  async getVisits(): Promise<Visit[]> {
    const { data, error } = await supabase
      .from('visits')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error cargando visitas desde Supabase', error);
      throw error;
    }

    return data || [];
  },

  // 2) Crear nueva visita en Supabase
  async createVisit(newVisit: NewVisit): Promise<void> {
    const { error } = await supabase.from('visits').insert({
      property_id: newVisit.propertyId,
      date: newVisit.date,
      executive_name: newVisit.executiveName,

      client_name: newVisit.clientName,
      client_phone: newVisit.clientPhone || null,
      client_email: newVisit.clientEmail || null,

      offer_uf: typeof newVisit.offerUF === 'number' ? newVisit.offerUF : null,
      has_broker: !!newVisit.hasBroker,
      broker_name: newVisit.brokerName || null,
      comments: newVisit.comments,

      next_action: newVisit.nextAction,
      next_action_date: newVisit.nextActionDate,
      action_status: newVisit.actionStatus || 'PENDING',
      action_completed_date: newVisit.actionCompletedDate || null,

      history: newVisit.history || [],
    });

    if (error) {
      console.error('Error creando visita en Supabase', error);
      throw error;
    }
  },
};
