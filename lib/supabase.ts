import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Lote, Calle } from "./types";
import { LOTES_MOCK, CALLES_MOCK } from "./mock-data";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null =
  url && key ? createClient(url, key) : null;

export const usandoMock = !supabase;

export async function obtenerLotes(): Promise<Lote[]> {
  if (!supabase) return LOTES_MOCK;
  const { data, error } = await supabase.from("lotes").select("*").order("numero");
  if (error || !data) {
    console.error("Error cargando lotes:", error);
    return LOTES_MOCK;
  }
  return data as Lote[];
}

export async function obtenerCalles(): Promise<Calle[]> {
  if (!supabase) return CALLES_MOCK;
  const { data, error } = await supabase.from("calles").select("*");
  if (error || !data) {
    console.error("Error cargando calles:", error);
    return CALLES_MOCK;
  }
  return data as Calle[];
}
