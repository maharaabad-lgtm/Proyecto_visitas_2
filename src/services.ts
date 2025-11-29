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

// ---- VISITAS EN SUPABASE ----

type Visit = { [key: string]: any };
type NewVisit = { [key: string]: any };

export const VisitsSupabaseService = {
  // 1) Obtener visitas desde Supabase (por si después las quieres usar)
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
      // 👇 este es el id de TU app (V-12345)
      visit_id: newVisit.id,

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

  // 3) Borrar visita en Supabase usando el id de la app
  async deleteVisitByAppId(visitId: string): Promise<void> {
    const { error } = await supabase
      .from('visits')
      .delete()
      .eq('visit_id', visitId);

    if (error) {
      console.error('Error borrando visita en Supabase', error);
      throw error;
    }
  },

  // 4) Actualizar visita en Supabase (compromiso / estado / comentarios)
  async updateVisitByAppId(updatedVisit: Visit): Promise<void> {
    const { id } = updatedVisit; // este es el V-12345

    const { error } = await supabase
      .from('visits')
      .update({
        next_action: updatedVisit.nextAction,
        next_action_date: updatedVisit.nextActionDate,
        action_status: updatedVisit.actionStatus,
        action_completed_date: updatedVisit.actionCompletedDate || null,
        comments: updatedVisit.comments,
        history: updatedVisit.history || [],
      })
      .eq('visit_id', id);

    if (error) {
      console.error('Error actualizando visita en Supabase', error);
      throw error;
    }
  },
};