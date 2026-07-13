"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginAdmin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const entrar = async () => {
    setError(null);
    if (!supabase) {
      setError("Supabase no está configurado todavía. Completa .env.local primero.");
      return;
    }
    setCargando(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setCargando(false);
    if (error) {
      setError("Correo o contraseña incorrectos.");
      return;
    }
    router.push("/admin");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="mb-1 text-xl font-bold text-slate-900">Lotify — Administración</h1>
        <p className="mb-5 text-sm text-slate-500">Acceso solo para el vendedor</p>

        <label className="mb-1 block text-sm font-medium text-slate-700">Correo</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-3 h-11 w-full rounded-lg border border-slate-300 px-3 outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700"
          autoComplete="email"
        />

        <label className="mb-1 block text-sm font-medium text-slate-700">Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && entrar()}
          className="mb-4 h-11 w-full rounded-lg border border-slate-300 px-3 outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700"
          autoComplete="current-password"
        />

        {error && (
          <p className="mb-3 rounded-lg bg-red-50 p-2 text-sm text-red-700">{error}</p>
        )}

        <button
          onClick={entrar}
          disabled={cargando || !email || !password}
          className="h-11 w-full rounded-xl bg-blue-800 font-semibold text-white hover:bg-blue-900 disabled:opacity-50"
        >
          {cargando ? "Entrando…" : "Entrar"}
        </button>
      </div>
    </main>
  );
}
