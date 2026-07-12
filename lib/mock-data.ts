import { Lote, Calle } from "./types";

let n = 0;
const id = () => `mock-${++n}`;

const L = (
  numero: string, manzana: string, estado: Lote["estado"], tipo_pago: Lote["tipo_pago"],
  contado: number | null, credito: number | null, frente: number, fondo: number,
  calle: string, geo: [number, number, number, number],
  enganche: number | null = null, plazo: number | null = null
): Lote => ({
  id: id(), numero, manzana, estado, tipo_pago,
  precio_contado: contado, precio_credito: credito,
  frente_m: frente, fondo_m: fondo, area_m2: Math.round(frente * fondo),
  calle_frontal: calle, enganche_min: enganche, plazo_meses: plazo, notas: null,
  geometria: { x: geo[0], y: geo[1], width: geo[2], height: geo[3] },
});

export const LOTES_MOCK: Lote[] = [
  L("A-01","A","disponible","ambos",  9000,10800,12,18,"Calle Norte",[40,40,90,140],1500,36),
  L("A-02","A","vendido","contado",   8500,null, 10,18,"Calle Norte",[130,40,80,140]),
  L("A-03","A","disponible","ambos", 10500,12600,13,18,"Calle Norte",[210,40,100,140],1800,36),
  L("A-04","A","reservado","credito", 8500,10200,10,18,"Calle Norte",[310,40,80,140],1500,24),
  L("A-05","A","disponible","ambos",  8500,10200,10,18,"Calle Norte",[390,40,80,140],1500,36),
  L("A-06","A","disponible","ambos", 11000,13200,14,18,"Calle Principal",[40,180,110,140],2000,36),
  L("A-07","A","vendido","credito",   9500,11400,12,18,"Calle Principal",[150,180,90,140]),
  L("A-08","A","disponible","ambos", 11000,13200,14,18,"Calle Principal",[240,180,110,140],2000,36),
  L("A-09","A","disponible","contado",12000,null, 15,18,"Calle Principal",[350,180,120,140]),
  L("B-01","B","disponible","ambos", 10000,12000,13,18,"Calle Norte",[530,40,100,140],1800,36),
  L("B-02","B","reservado","ambos",   9200,11000,11,18,"Calle Norte",[630,40,90,140],1600,36),
  L("B-03","B","disponible","ambos", 10800,13000,14,18,"Calle Norte",[720,40,110,140],1900,36),
  L("B-04","B","vendido","contado",  13000,null, 16,18,"Calle Norte esquina",[830,40,130,140]),
  L("B-05","B","disponible","ambos", 11800,14200,15,18,"Calle Principal",[530,180,120,140],2100,36),
  L("B-06","B","disponible","ambos", 10000,12000,13,18,"Calle Principal",[650,180,100,140],1800,36),
  L("B-07","B","vendido","credito",  10000,12000,13,18,"Calle Principal",[750,180,100,140]),
  L("B-08","B","disponible","ambos", 11000,13200,14,18,"Calle Principal esquina",[850,180,110,140],2000,36),
  L("C-01","C","disponible","ambos",  9800,11800,12,17,"Calle Principal",[40,390,100,130],1700,36),
  L("C-02","C","disponible","ambos",  9000,10800,11,17,"Calle Principal",[140,390,90,130],1600,36),
  L("C-03","C","reservado","credito",10500,12600,13,17,"Calle Principal",[230,390,110,130],1800,24),
  L("C-04","C","disponible","ambos", 12500,15000,16,17,"Calle Principal esquina",[340,390,130,130],2200,36),
  L("C-05","C","disponible","ambos", 13500,16200,17,17,"Calle Sur",[40,520,140,140],2400,36),
  L("C-06","C","vendido","contado",  12800,null, 16,17,"Calle Sur",[180,520,130,140]),
  L("C-07","C","disponible","ambos", 15000,18000,19,17,"Calle Sur esquina",[310,520,160,140],2600,48),
  L("D-01","D","disponible","ambos", 10800,13000,13,17,"Calle Principal",[530,390,110,130],1900,36),
];

LOTES_MOCK.push({
  id: id(), numero: "PARQUE", manzana: "D", estado: "no_disponible", tipo_pago: "contado",
  precio_contado: null, precio_credito: null, frente_m: null, fondo_m: null,
  area_m2: 950, calle_frontal: null, enganche_min: null, plazo_meses: null,
  notas: "Área verde común del desarrollo",
  geometria: { x: 680, y: 520, width: 280, height: 140 },
});

export const CALLES_MOCK: Calle[] = [
  { id: id(), nombre: "Calle Principal", ancho_m: 8, tipo: "calle",
    geometria: { x: 20, y: 330, width: 960, height: 50, orientacion: "h" } },
  { id: id(), nombre: "Avenida Central", ancho_m: 10, tipo: "avenida",
    geometria: { x: 470, y: 20, width: 60, height: 660, orientacion: "v" } },
  { id: id(), nombre: "Entrada", ancho_m: 12, tipo: "entrada",
    geometria: { x: 470, y: 0, width: 60, height: 22, orientacion: "v" } },
];
