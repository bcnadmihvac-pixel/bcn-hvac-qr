import React, { useEffect, useMemo, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

/**
 * BCN HVAC — QR Equipos (Mobile‑first, Pro UI, Branding)
 * - Acordeones por empresa (despliegue vertical)
 * - Lista: nombre, Estado general (OK/NO OK) debajo del nombre, Último servicio
 * - Ficha: hoja deslizante full‑screen en mobile
 * - Admin: PIN, edición inline, Importar/Exportar JSON solo en admin
 * - QR: link directo ?id= (para etiquetas)
 * - Branding: logo + color corporativo configurables desde admin (se guardan en LocalStorage)
 * - Dark mode automático si el sistema del usuario lo tiene
 */

// ===================== Utiles y constantes =====================
const EMPRESAS = [
  { key: "capex", label: "capex" },
  { key: "terrazas", label: "terrazas" },
];

const LS_KEY = "qr-equipos-data-v1";
const LS_ADMIN = "qr-equipos-admin";
const LS_BRAND = "qr-equipos-brand"; // { logoDataUrl?: string, color?: string }

function hoyISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function formatDate(iso?: string) {
  try {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleDateString();
  } catch {
    return iso || "-";
  }
}

function estadoStyles(estado: string) {
  const ok = estado === "OK";
  return ok
    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
    : "bg-rose-50 text-rose-700 ring-1 ring-rose-200";
}

// ===================== Datos de ejemplo =====================
function makeCapex38() {
  return [
    { id: "capex-1", empresa: "capex", nombre: "BHG 3000 FG R410", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-2", empresa: "capex", nombre: "BHG 3000 FG R410", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-3", empresa: "capex", nombre: "LG 3000 FG R410", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-4", empresa: "capex", nombre: "LG 3000 FG R410", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-5", empresa: "capex", nombre: "BGH 3000 FG R410", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-6", empresa: "capex", nombre: "LG DUAL INVERTER 4500 FG R410", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-7", empresa: "capex", nombre: "SURREY 3000 FG R410", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-8", empresa: "capex", nombre: "BGH 4500 FG R22", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-9", empresa: "capex", nombre: "BGH 4500 FG R22", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-10", empresa: "capex", nombre: "PISO TECHO 9000 FG", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-11", empresa: "capex", nombre: "LG DUAL INVERTER 4500 FG R410", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-12", empresa: "capex", nombre: "TRANE 6000 FG R410", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-13", empresa: "capex", nombre: "TRANE 6000 FG R410", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-14", empresa: "capex", nombre: "TRANE 6000 FG R410", tipo: "split", estado: "SIN ENERGIA/ POSIBLE FUGA", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-15", empresa: "capex", nombre: "TELEFLUR 6000 FG R410", tipo: "split", estado: "NO ENCIENDE", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-16", empresa: "capex", nombre: "TRANE INVERTER 2250 FG R410", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-17", empresa: "capex", nombre: "TRANE INVERTER 2250 FG R410", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-18", empresa: "capex", nombre: "TRANE INVERTER 2250 FG R410", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-19", empresa: "capex", nombre: "TRANE INVERTER 2250 FG R410", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-20", empresa: "capex", nombre: "TRANE 4500 FG R410 SERVER PB", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-21", empresa: "capex", nombre: "SURREY 2250 FG R22", tipo: "split", estado: "FLAP FUNCIONA AL REVES/ SIN TAPA ELECTRICA", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-22", empresa: "capex", nombre: "BGH INVERTER 4500 FG R410", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-23", empresa: "capex", nombre: "BGH INVERTER 4500 FG R410", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-24", empresa: "capex", nombre: "TOSHIBA 4500 FG R22", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-25", empresa: "capex", nombre: "TOSHIBA 4500 FG R22", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-26", empresa: "capex", nombre: "TRANE 4500 FG R410", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-27", empresa: "capex", nombre: "TOSHIBA 4500 FG R22", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-28", empresa: "capex", nombre: "BGH 4500 FG R22", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-29", empresa: "capex", nombre: "LG 3000 FG R410", tipo: "split", estado: "NO OK/ FALTA GAS", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-30", empresa: "capex", nombre: "ELECTROLUX 4500 FG R22", tipo: "split", estado: "NO OK/ SIN ENERGIA", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-31", empresa: "capex", nombre: "BGH 6000 FG R22", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-32", empresa: "capex", nombre: "TOSHIBA 4500 FG R22", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-33", empresa: "capex", nombre: "TOSHIBA 4500 FG R22", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-34", empresa: "capex", nombre: "SANYO 3000 FG R410", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-35", empresa: "capex", nombre: "ELECTROLUX 4500 FG R22", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-36", empresa: "capex", nombre: "WHITE WESTINHOUSE 3000 FG", tipo: "split", estado: "NO OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-37", empresa: "capex", nombre: "TRANE 5600 FG R410", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-38", empresa: "capex", nombre: "TRANE 4500 FG R410 SERVER PB", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
  ];
}

const EXAMPLE_DATA = [
  ...makeCapex38(),
  {
    id: "ter-rt-1",
    empresa: "terrazas",
    nombre: "Rooftop 01",
    tipo: "rooftop",
    estado: "OK",
    ultimoServicio: "2025-09-25",
    split: null,
    rooftop: {
      temperaturaImpulsion: 12.5,
      amperajeCompresor: 18.2,
      presionAlta: 240,
      presionBaja: 65,
    },
    notas: "Revisar filtro en próxima visita",
  },
  {
    id: "ter-sp-2",
    empresa: "terrazas",
    nombre: "Split 02",
    tipo: "split",
    estado: "NO OK",
    ultimoServicio: "2025-08-18",
    split: {
      consumoFan: 1.1,
      consumoCompresor: 7.2,
      presionAlta: 255,
      presionBaja: 58,
    },
    rooftop: null,
    notas: "Bajo gas, programar carga",
  },
];

function loadData() {
  const s = localStorage.getItem(LS_KEY);
  if (!s) return EXAMPLE_DATA;
  try {
    const arr = JSON.parse(s);
    return Array.isArray(arr) ? arr : EXAMPLE_DATA;
  } catch {
    return EXAMPLE_DATA;
  }
}

function saveData(arr: any[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(arr));
}

function loadBrand() {
  try {
    const s = localStorage.getItem(LS_BRAND);
    return s
      ? JSON.parse(s)
      : {
          color: "#0ea5e9",
          // Logo fijo embed (puede ser reemplazado por Admin). Valor base64 abreviado a efectos de demo.
          logoDataUrl:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABAAAAAQACAYAAAB/HSuDAACtcGNhQlgAAK1wan...AAAKoAOJtxA3VybjpjMnBhOjNhNmYzYjE0LTU2YWUtNDllMy05OTk0LTMyMmUx",
        };
  } catch {
    return { color: "#0ea5e9" };
  }
}

function saveBrand(obj: any) {
  localStorage.setItem(LS_BRAND, JSON.stringify(obj));
}

function useQueryId() {
  const [id, setId] = useState<string | null>(null);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setId(params.get("id"));
  }, []);
  return id;
}

// ===================== Componente principal =====================
export default function App() {
  const [items, setItems] = useState<any[]>(() => loadData());
  const [admin, setAdmin] = useState<boolean>(() => localStorage.getItem(LS_ADMIN) === "1");
  const [pinTry, setPinTry] = useState("");
  const [selected, setSelected] = useState<any | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [brand, setBrand] = useState<any>(() => loadBrand()); // {logoDataUrl?, color}

  // acordeones abiertos por empresa
  const [openSec, setOpenSec] = useState<Record<string, boolean>>(() => ({ capex: true, terrazas: false }));

  const queryId = useQueryId();

  const porEmpresa = useMemo(() => {
    const map: Record<string, any[]> = { capex: [], terrazas: [] };
    for (const it of items) if (map[it.empresa]) map[it.empresa].push(it);
    
    
    return map;
  }, [items]);

  useEffect(() => {
    if (queryId && !selected) {
      const eq = items.find((e) => e.id === queryId);
      if (eq) {
        setOpenSec((s) => ({ ...s, [eq.empresa]: true }));
        setSelected(eq);
      }
    }
  }, [queryId, items, selected]);

  function tryLoginAdmin() {
    if (pinTry === "13579") {
      localStorage.setItem(LS_ADMIN, "1");
      setAdmin(true);
      setPinTry("");
    } else {
      alert("PIN incorrecto");
    }
  }
  function logoutAdmin() {
    localStorage.removeItem(LS_ADMIN);
    setAdmin(false);
  }

  function updateEquipo(id: string, patch: any) {
    setItems((prev) => {
      const next = prev.map((e) => (e.id === id ? { ...e, ...patch } : e));
      saveData(next);
      return next;
    });
  }
  function updateNestedSplit(id: string, patch: any) {
    setItems((prev) => {
      const next = prev.map((e) => (e.id === id ? { ...e, split: { ...(e.split || {}), ...patch } } : e));
      saveData(next);
      return next;
    });
  }
  function updateNestedRooftop(id: string, patch: any) {
    setItems((prev) => {
      const next = prev.map((e) => (e.id === id ? { ...e, rooftop: { ...(e.rooftop || {}), ...patch } } : e));
      saveData(next);
      return next;
    });
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `equipos_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
  function importJSON(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        if (Array.isArray(data)) {
          setItems(data);
          saveData(data);
          alert("Datos importados");
        } else {
          alert("Formato inválido: se esperaba un array");
        }
      } catch {
        alert("No se pudo leer el JSON");
      }
    };
    reader.readAsText(file);
  }

  function onPickLogo(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const next = { ...brand, logoDataUrl: String(reader.result) };
      setBrand(next);
      saveBrand(next);
    };
    reader.readAsDataURL(file);
  }
  function onPickColor(hex: string) {
    const next = { ...brand, color: hex };
    setBrand(next);
    saveBrand(next);
  }

  // ---- Self-tests (simple) ----
  useEffect(() => {
    try {
      // Test 1: CAPEX debe tener 38 equipos
      const capexCount = porEmpresa.capex?.length ?? 0;
      if (capexCount !== 38) console.warn("[TEST] CAPEX count esperado=38, actual=", capexCount);

      // Test 2: Todas las entradas deben tener id/nombre/empresa
      const invalid = items.find((e) => !e.id || !e.nombre || !e.empresa);
      if (invalid) console.warn("[TEST] Equipo inválido:", invalid);

      // Test 3: Link QR para un item
      const sample = items[0];
      if (sample) {
        const link = window.location.origin + window.location.pathname + `?id=${sample.id}`;
        if (typeof link !== "string" || !link.includes("?id=")) console.warn("[TEST] Link QR inválido");
      }

      // Test 4 (nuevo): estilos de estado
      const okCls = estadoStyles("OK");
      const badCls = estadoStyles("NO OK");
      if (!okCls.includes("emerald") || !badCls.includes("rose")) {
        console.warn("[TEST] estadoStyles no retorna clases esperadas");
      }

      // Test 5 (nuevo): suma por empresa == total
      const total = items.length;
      const sum = (porEmpresa.capex?.length ?? 0) + (porEmpresa.terrazas?.length ?? 0);
      if (total !== sum) console.warn("[TEST] Conteo por empresa no coincide con total");
    } catch (err) {
      console.warn("[TEST] Error de pruebas:", err);
    }
  }, [items, porEmpresa]);

  // ===================== Render =====================
  // CSS variables (para evitar error TS2353 en style keys "--brand")
  const styleVars = {
    "--brand": brand.color || "#0ea5e9",
    "--brand-faint": `${hexToRgba(brand.color || "#0ea5e9", 0.08)}`,
  } as React.CSSProperties & Record<string, string>;
  return (
    <div
      className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-50"
      style={styleVars}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-20 border-b border-neutral-200 dark:border-neutral-800 backdrop-blur supports-[backdrop-filter]:bg-white/75 dark:supports-[backdrop-filter]:bg-neutral-900/75"
        style={{ background: `linear-gradient(90deg, var(--brand-faint), transparent)` }}
      >
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="flex items-center gap-3">
            {brand.logoDataUrl ? (
              <img src={brand.logoDataUrl} alt="logo" className="h-8 w-8 object-contain" />
            ) : (
              <div
                className="h-8 w-8 rounded-xl grid place-items-center ring-1"
                style={{ borderColor: "var(--brand)", color: "var(--brand)" }}
              >
                🏷️
              </div>
            )}
            <h1 className="text-xl font-semibold tracking-tight">BCN HVAC · Equipos</h1>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {!admin ? (
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  value={pinTry}
                  onChange={(e) => setPinTry(e.target.value)}
                  placeholder="PIN"
                  className="h-9 px-3 rounded-lg border border-neutral-300 text-sm w-24 dark:bg-neutral-900 dark:border-neutral-700"
                />
                <button
                  onClick={tryLoginAdmin}
                  className="h-9 px-3 rounded-lg text-sm text-white"
                  style={{ backgroundColor: "var(--brand)" }}
                >
                  Admin
                </button>
              </div>
            ) : (
              <button onClick={logoutAdmin} className="h-9 px-3 rounded-lg border text-sm dark:border-neutral-700">
                Salir
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Actions row (solo admin) */}
      {admin && (
        <div className="max-w-3xl mx-auto px-4 py-3 grid gap-2">
          <div className="flex gap-2">
            <button
              onClick={exportJSON}
              className="h-10 px-4 rounded-xl border text-sm dark:border-neutral-700 hover:shadow-sm"
              style={{ borderColor: "var(--brand)" }}
            >
              Exportar JSON
            </button>
            <label
              className="h-10 px-4 rounded-xl border text-sm grid place-items-center cursor-pointer dark:border-neutral-700 hover:shadow-sm"
              style={{ borderColor: "var(--brand)" }}
            >
              Importar JSON
              <input
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => e.target.files && importJSON(e.target.files[0])}
              />
            </label>
          </div>

          <div className="rounded-2xl border p-3 grid gap-3 md:grid-cols-[auto_1fr_auto] items-center dark:border-neutral-800">
            <div className="flex items-center gap-3">
              {brand.logoDataUrl ? (
                <img src={brand.logoDataUrl} alt="logo" className="h-10 w-10 object-contain" style={{ borderColor: "var(--brand)" }} />
              ) : (
                <div
                  className="h-10 w-10 rounded-xl grid place-items-center ring-1"
                  style={{ borderColor: "var(--brand)", color: "var(--brand)" }}
                >
                  🏷️
                </div>
              )}
              <div>
                <div className="text-xs text-neutral-500">Branding</div>
                <div className="text-sm font-medium">Logo y color corporativo</div>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-2 flex-wrap">
              <label
                className="px-3 h-10 rounded-xl border grid place-items-center cursor-pointer text-sm dark:border-neutral-700"
                style={{ borderColor: "var(--brand)" }}
              >
                Subir logo
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && onPickLogo(e.target.files[0])} />
              </label>
              <div className="h-10 rounded-xl border flex items-center px-3 gap-2 text-sm dark:border-neutral-700" style={{ borderColor: "var(--brand)" }}>
                <span>Color:</span>
                <input type="color" value={brand.color || "#0ea5e9"} onChange={(e) => onPickColor(e.target.value)} className="h-7 w-10 p-0 border-0 bg-transparent" />
              </div>
            </div>
            <button onClick={() => { setBrand({}); saveBrand({}); }} className="h-10 px-3 rounded-xl border text-sm dark:border-neutral-700">
              Reiniciar
            </button>
          </div>
        </div>
      )}

      {/* Empresas como acordeones */}
      <main className="max-w-3xl mx-auto px-4 pb-24">
        <ul className="grid gap-4">
          {EMPRESAS.map((emp) => {
            const lista = porEmpresa[emp.key] || [];
            const abierto = !!openSec[emp.key];
            return (
              <li key={emp.key} className="rounded-2xl border bg-white dark:bg-neutral-950 shadow-sm overflow-hidden dark:border-neutral-800">
                <button
                  onClick={() => setOpenSec((s) => ({ ...s, [emp.key]: !s[emp.key] }))}
                  className="w-full flex items-center justify-between p-4 active:scale-[0.99] transition text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-7 px-3 rounded-full text-xs grid place-items-center font-semibold bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                      {emp.label.toUpperCase()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-neutral-100 dark:bg-neutral-800">{lista.length} equipos</span>
                    <span className="text-neutral-400">{abierto ? "▴" : "▾"}</span>
                  </div>
                </button>
                {/* Contenido desplegable */}
                <div className={`${abierto ? "block" : "hidden"} border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-950`}>
                  <ul className="grid gap-3 p-3">
                    {lista.map((it, idx) => (
                      <li key={it.id}>
                        <button
                          onClick={() => {
                            setSelected(it);
                            setShowQR(false);
                          }}
                          className="w-full text-left rounded-xl border bg-white dark:bg-neutral-950 p-4 shadow-sm active:scale-[0.99] transition border-neutral-200 dark:border-neutral-800 hover:shadow-md"
                        >
                          <div className="flex items-center">
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col">
                                <h3 className="font-semibold truncate text-base">Equipo {idx + 1}</h3>
                                <div className="text-sm text-neutral-700 dark:text-neutral-300 truncate">{it.nombre}</div>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-neutral-500">Estado general:</span>
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${estadoStyles(it.estado)}`}>{it.estado}</span>
                                </div>
                              </div>
                              <div className="text-xs text-neutral-500 mt-1">Último servicio · {formatDate(it.ultimoServicio)}</div>
                            </div>
                            <div className="ml-3 text-neutral-400">›</div>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>
      </main>

      {/* Ficha: hoja deslizante */}
      {selected && (
        <div className="fixed inset-0 z-30">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
          <div className="absolute inset-x-0 bottom-0 md:inset-y-0 md:right-0 md:left-auto md:w-[520px] bg-white dark:bg-neutral-950 rounded-t-3xl md:rounded-l-3xl shadow-2xl overflow-y-auto max-h-[92vh] md:max-h-none">
            <div className="p-4 sticky top-0 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <button onClick={() => setSelected(null)} className="h-9 w-9 grid place-items-center rounded-xl border md:hidden dark:border-neutral-700">
                  ←
                </button>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">{selected.nombre}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-neutral-500">Estado general:</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${estadoStyles(selected.estado)}`}>{selected.estado}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 grid gap-5">
              {/* Generales */}
              <section className="grid gap-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <Info label="Empresa" value={selected.empresa.toUpperCase()} />
                  <Info label="Tipo" value={selected.tipo} />
                  <div>
                    <label className="block text-[11px] text-neutral-500">Último servicio</label>
                    {!admin ? (
                      <div className="font-medium">{formatDate(selected.ultimoServicio)}</div>
                    ) : (
                      <input
                        type="date"
                        value={selected.ultimoServicio || hoyISO()}
                        onChange={(e) => updateEquipo(selected.id, { ultimoServicio: e.target.value })}
                        className="mt-1 w-full h-10 px-3 rounded-xl border dark:bg-neutral-950 dark:border-neutral-700"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-[11px] text-neutral-500">Estado</label>
                    {!admin ? (
                      <div className="font-medium">{selected.estado}</div>
                    ) : (
                      <select
                        value={selected.estado}
                        onChange={(e) => updateEquipo(selected.id, { estado: e.target.value })}
                        className="mt-1 w-full h-10 px-3 rounded-xl border dark:bg-neutral-950 dark:border-neutral-700"
                      >
                        <option>OK</option>
                        <option>NO OK</option>
                      </select>
                    )}
                  </div>
                </div>
              </section>

              {selected.tipo === "split" && (
                <section className="grid gap-3">
                  <h3 className="text-base font-semibold">Consumos</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <FieldNumber
                      admin={admin}
                      label="Consumo fan (A)"
                      value={selected.split?.consumoFan}
                      onChange={(v: number) => updateNestedSplit(selected.id, { consumoFan: v })}
                      step={0.1}
                    />
                    <FieldNumber
                      admin={admin}
                      label="Consumo compresor (A)"
                      value={selected.split?.consumoCompresor}
                      onChange={(v: number) => updateNestedSplit(selected.id, { consumoCompresor: v })}
                      step={0.1}
                    />
                  </div>
                  <h3 className="text-base font-semibold">Presiones</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <FieldNumber
                      admin={admin}
                      label="Presión alta (psi)"
                      value={selected.split?.presionAlta}
                      onChange={(v: number) => updateNestedSplit(selected.id, { presionAlta: v })}
                      step={1}
                    />
                    <FieldNumber
                      admin={admin}
                      label="Presión baja (psi)"
                      value={selected.split?.presionBaja}
                      onChange={(v: number) => updateNestedSplit(selected.id, { presionBaja: v })}
                      step={1}
                    />
                  </div>
                </section>
              )}

              {selected.tipo === "rooftop" && (
                <section className="grid gap-3">
                  <h3 className="text-base font-semibold">Parámetros Rooftop</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <FieldNumber
                      admin={admin}
                      label="Temperatura impulsión (°C)"
                      value={selected.rooftop?.temperaturaImpulsion}
                      onChange={(v: number) => updateNestedRooftop(selected.id, { temperaturaImpulsion: v })}
                      step={0.1}
                    />
                    <FieldNumber
                      admin={admin}
                      label="Amperaje compresor (A)"
                      value={selected.rooftop?.amperajeCompresor}
                      onChange={(v: number) => updateNestedRooftop(selected.id, { amperajeCompresor: v })}
                      step={0.1}
                    />
                    <FieldNumber
                      admin={admin}
                      label="Presión alta (psi)"
                      value={selected.rooftop?.presionAlta}
                      onChange={(v: number) => updateNestedRooftop(selected.id, { presionAlta: v })}
                      step={1}
                    />
                    <FieldNumber
                      admin={admin}
                      label="Presión baja (psi)"
                      value={selected.rooftop?.presionBaja}
                      onChange={(v: number) => updateNestedRooftop(selected.id, { presionBaja: v })}
                      step={1}
                    />
                  </div>
                </section>
              )}

              {/* Notas */}
              <section className="grid gap-2">
                <label className="block text-[11px] text-neutral-500">Notas</label>
                {!admin ? (
                  <div className="text-sm whitespace-pre-wrap min-h-[2rem] rounded-xl bg-neutral-50 dark:bg-neutral-900 p-3 border dark:border-neutral-800">
                    {selected.notas || "-"}
                  </div>
                ) : (
                  <textarea
                    value={selected.notas || ""}
                    onChange={(e) => updateEquipo(selected.id, { notas: e.target.value })}
                    className="w-full h-24 p-3 rounded-xl border dark:bg-neutral-950 dark:border-neutral-700"
                  />
                )}
              </section>

              {/* Acciones inferior */}
              <div className="h-16" />
            </div>

            <div className="sticky bottom-0 p-3 bg-white/90 dark:bg-neutral-950/90 backdrop-blur border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowQR((s) => !s)}
                  className="h-11 px-4 rounded-xl border flex-1 dark:border-neutral-700 hover:shadow-sm"
                  style={{ borderColor: "var(--brand)" }}
                >
                  {showQR ? "Ocultar QR" : "Mostrar QR"}
                </button>
                <a
                  className="h-11 px-4 rounded-xl border flex items-center justify-center dark:border-neutral-700 hover:shadow-sm"
                  href={`?id=${encodeURIComponent(selected.id)}`}
                  style={{ borderColor: "var(--brand)" }}
                >
                  Link directo
                </a>
                <button onClick={() => setSelected(null)} className="h-11 px-4 rounded-xl text-white" style={{ backgroundColor: "var(--brand)" }}>
                  Cerrar
                </button>
              </div>
              {showQR && (
                <div className="pt-3 grid place-items-center">
                  <QRCodeCanvas value={window.location.origin + window.location.pathname + `?id=${selected.id}`} size={196} includeMargin level="M" />
                  <div className="text-[11px] text-neutral-500 break-all mt-2">{window.location.origin + window.location.pathname + `?id=${selected.id}`}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FAB admin hint en mobile */}
      {!admin && (
        <button
          onClick={() => {
            const el = document.querySelector('input[type="password"]') as HTMLInputElement | null;
            if (el) el.focus();
          }}
          className="fixed bottom-6 right-6 z-10 h-12 w-12 rounded-full shadow-lg text-white grid place-items-center md:hidden"
          style={{ backgroundColor: "var(--brand)" }}
          title="Entrar admin"
        >
          ⚙️
        </button>
      )}

      <footer className="py-10 text-center text-[11px] text-neutral-500 dark:text-neutral-400">BCN HVAC — {new Date().getFullYear()}</footer>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="block text-[11px] text-neutral-500">{label}</span>
      <span className="font-medium">{value ?? "-"}</span>
    </div>
  );
}

function FieldNumber({
  admin,
  label,
  value,
  onChange,
  step = 1,
}: {
  admin: boolean;
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
}) {
  return (
    <div>
      <label className="block text-[11px] text-neutral-500">{label}</label>
      {!admin ? (
        <div className="font-medium">{value ?? "-"}</div>
      ) : (
        <div className="flex items-center gap-2">
          <button
            className="h-10 w-10 rounded-xl border dark:border-neutral-700"
            onClick={() => onChange(Number((Number(value ?? 0) - step).toFixed(2)))}
          >
            -
          </button>
          <input
            type="number"
            step={step}
            value={value ?? 0}
            onChange={(e) => onChange(Number((e.target as HTMLInputElement).value))}
            className="h-10 px-3 rounded-xl border w-full dark:bg-neutral-950 dark:border-neutral-700"
          />
          <button
            className="h-10 w-10 rounded-xl border dark:border-neutral-700"
            onClick={() => onChange(Number((Number(value ?? 0) + step).toFixed(2)))}
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}

// Helper: convierte HEX a rgba con alpha
function hexToRgba(hex: string, alpha = 1) {
  try {
    let h = hex.replace("#", "");
    if (h.length === 3) {
      h = h
        .split("")
        .map((c) => c + c)
        .join("");
    }
    const bigint = parseInt(h, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  } catch {
    return `rgba(14, 165, 233, ${alpha})`; // fallback al cyan
  }
}
