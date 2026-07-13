"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, obtenerLotes } from "@/lib/supabase";
import { Lote, EstadoLote, COLOR_ESTADO, LABEL_ESTADO, moneda, monedaNIO } from "@/lib/types";

const ESTADOS: EstadoLote[] = ["disponible", "reservado", "vendido", "no_disponible"];

export default function PanelAdmin() {
  const router = useRouter();
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [cargando, setCargando] = useState(true);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      if (!supabase) {
        setLotes(await obtenerLotes());
        setCargando(false);
        return;
      }
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/admin/login");
        return;
      }
      setEmail(data.session.user.email ?? null);
      setLotes(await obtenerLotes());
      setCargando(false);
    };
    init();
  }, [router]);

  const cambiarEstado = async (lote: Lote, nuevo: EstadoLote) => {
    setLotes((ls) => ls.map((l) => (l.id === lote.id ? { ...l, estado: nuevo } : l)));
    if (!supabase) return;
    await supabase.from("lotes").update({ estado: nuevo }).eq("id", lote.id);
    await supabase.from("historial_lotes").insert({
      lote_id: lote.id,
      campo: "estado",
      valor_anterior: lote.estado,
      valor_nuevo: nuevo,
      admin_email: email,
    });
  };

  const salir = async () => {
    await supabase?.auth.signOut();
    router.push("/admin/login");
  };

  const resumen = {
    total: lotes.filter((l) => l.numero !== "PARQUE").length,
    disponibles: lotes.filter((l) => l.estado === "disponible").length,
    vendidos: lotes.filter((l) => l.estado === "vendido").length,
    reservados: lotes.filter((l) => l.estado === "reservado").length,
    proyectado: lotes
      .filter((l) => l.estado === "disponible")
      .reduce((s, l) => s + (l.precio_contado ?? 0), 0),
  };

  if (cargando) return <main className="p-8 text-slate-500">Cargando panel…</main>;

  return (
    <main className="mx-auto max-w-6xl p-4 md:p-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Lotify — Administración</h1>
          {email && <p className="text-sm text-slate-500">{email}</p>}
          {!supabase && (
            <p className="text-sm text-amber-700">Modo demo — los cambios no se guardan hasta conectar Supabase</p>
          )}
        </div>
        <div className="flex gap-2">
          <a href="/" className="flex h-10 items-center rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50">Ver sitio público</a>
          {supabase && (
            <button onClick={salir} className="h-10 rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50">Cerrar sesión</button>
          )}
        </div>
      </header>

      <section className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-5">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Total lotes</p>
          <p className="text-xl font-bold text-slate-900">{resumen.total}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Disponibles</p>
          <p className="text-xl font-bold text-slate-900">{resumen.disponibles}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Reservados</p>
          <p className="text-xl font-bold text-slate-900">{resumen.reservados}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Vendidos</p>
          <p className="text-xl font-bold text-slate-900">{resumen.vendidos}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Ingreso proyectado</p>
          <p className="text-xl font-bold text-slate-900">{moneda(resumen.proyectado)}</p>
          <p className="text-[11px] text-slate-400">≈ {monedaNIO(resumen.proyectado)} NIO</p>
        </div>
      </section>

      <section className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs text-slate-500">
              <th className="p-3">Lote</th>
              <th className="p-3">Manzana</th>
              <th className="p-3">Área</th>
              <th className="p-3">Contado</th>
              <th className="p-3">Crédito</th>
              <th className="p-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {lotes
              .filter((l) => l.numero !== "PARQUE")
              .map((l) => (
                <tr key={l.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="p-3 font-semibold text-slate-900">{l.numero}</td>
                  <td className="p-3 text-slate-600">{l.manzana ?? "—"}</td>
                  <td className="p-3 text-slate-600">{l.area_m2 ?? "—"} m²</td>
                  <td className="p-3 text-slate-700">
                    {moneda(l.precio_contado)}
                    <span className="ml-1 text-[10px] text-slate-400">({monedaNIO(l.precio_contado)})</span>
                  </td>
                  <td className="p-3 text-slate-700">
                    {moneda(l.precio_credito)}
                    <span className="ml-1 text-[10px] text-slate-400">({monedaNIO(l.precio_credito)})</span>
                  </td>
                  <td className="p-3">
                    <select
                      value={l.estado}
                      onChange={(e) => cambiarEstado(l, e.target.value as EstadoLote)}
                      className="rounded-lg border border-slate-300 px-2 py-1.5 text-xs font-medium"
                      style={{ color: COLOR_ESTADO[l.estado] }}
                      aria-label={`Estado del lote ${l.numero}`}
                    >
                      {ESTADOS.map((e) => (
                        <option key={e} value={e}>{LABEL_ESTADO[e]}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
