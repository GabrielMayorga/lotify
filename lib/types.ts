export type EstadoLote = "disponible" | "vendido" | "reservado" | "no_disponible";
export type TipoPago = "contado" | "credito" | "ambos";

export interface Geometria {
  x: number;
  y: number;
  width: number;
  height: number;
  orientacion?: "h" | "v";
}

export interface Lote {
  id: string;
  numero: string;
  manzana: string | null;
  estado: EstadoLote;
  tipo_pago: TipoPago;
  precio_contado: number | null;
  precio_credito: number | null;
  frente_m: number | null;
  fondo_m: number | null;
  area_m2: number | null;
  calle_frontal: string | null;
  enganche_min: number | null;
  plazo_meses: number | null;
  notas: string | null;
  geometria: Geometria;
}

export interface Calle {
  id: string;
  nombre: string;
  ancho_m: number | null;
  tipo: "calle" | "avenida" | "entrada" | "pasaje";
  geometria: Geometria;
}

export const COLOR_ESTADO: Record<EstadoLote, string> = {
  disponible: "#22c55e",
  vendido: "#ef4444",
  reservado: "#f59e0b",
  no_disponible: "#94a3b8",
};

export const LABEL_ESTADO: Record<EstadoLote, string> = {
  disponible: "Disponible",
  vendido: "Vendido",
  reservado: "Reservado",
  no_disponible: "No disponible",
};

export const TASA_CAMBIO_DEFECTO = 36.8;

export const moneda = (n: number | null | undefined) =>
  n == null ? "—" : "$" + n.toLocaleString("es-NI");

export const monedaNIO = (
  n: number | null | undefined,
  tasa: number = TASA_CAMBIO_DEFECTO
) => (n == null ? "—" : "C$" + Math.round(n * tasa).toLocaleString("es-NI"));
