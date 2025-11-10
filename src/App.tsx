import React, { useEffect, useMemo, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

const EMPRESAS = [
  { key: "capex", label: "capex" },
  { key: "terrazas", label: "terrazas" },
];

const LS_KEY = "qr-equipos-data-v1";
const LS_ADMIN = "qr-equipos-admin";
const LS_BRAND = "qr-equipos-brand";

function hoyISO() { const d = new Date(); return d.toISOString().slice(0,10); }
function formatDate(iso?: string) {
  try { if (!iso) return "-"; const d = new Date(iso); return d.toLocaleDateString(); }
  catch { return iso || "-"; }
}
function estadoStyles(estado: string) {
  const ok = estado === "OK";
  return ok ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
            : "bg-rose-50 text-rose-700 ring-1 ring-rose-200";
}

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

const EXAMPLE_DATA = [...makeCapex38()];

function loadData() {
  const s = localStorage.getItem(LS_KEY);
  if (!s) return EXAMPLE_DATA;
  try { const arr = JSON.parse(s); return Array.isArray(arr) ? arr : EXAMPLE_DATA; } catch { return EXAMPLE_DATA; }
}
function saveData(arr:any[]) { localStorage.setItem(LS_KEY, JSON.stringify(arr)); }

function useQueryId() {
  const [id, setId] = useState<string | null>(null);
  useEffect(() => { const params = new URLSearchParams(window.location.search); setId(params.get("id")); }, []);
  return id;
}

export default function App() {
  const [items, setItems] = useState<any[]>(() => loadData());
  const [admin, setAdmin] = useState<boolean>(() => localStorage.getItem(LS_ADMIN) === "1");
  const [pinTry, setPinTry] = useState("");
  const [selected, setSelected] = useState<any | null>(null);
  const [showQR, setShowQR] = useState(false);

  // Draft
  const [draft, setDraft] = useState<any | null>(null);
  useEffect(() => { if (selected) setDraft(JSON.parse(JSON.stringify(selected))); else setDraft(null); }, [selected]);

  const [openSec, setOpenSec] = useState<Record<string, boolean>>(() => ({ capex: true, terrazas: false }));

  const queryId = useQueryId();
  const isKiosk = !!queryId;

  const porEmpresa = useMemo(() => {
    const map: Record<string, any[]> = { capex: [], terrazas: [] };
    for (const it of items) if (map[it.empresa]) map[it.empresa].push(it);
    return map;
  }, [items]);

  useEffect(() => {
    if (queryId && !selected) {
      const eq = items.find((e) => e.id === queryId);
      if (eq) { setOpenSec((s) => ({ ...s, [eq.empresa]: true })); setSelected(eq); }
    }
  }, [queryId, items, selected]);

  function tryLoginAdmin() {
    if (pinTry === "13579") { localStorage.setItem(LS_ADMIN, "1"); setAdmin(true); setPinTry(""); }
    else alert("PIN incorrecto");
  }
  function logoutAdmin() { localStorage.removeItem(LS_ADMIN); setAdmin(false); }

  const styleVars = {
    "--brand": "#0ea5e9",
    "--brand-faint": "rgba(14,165,233,0.08)",
  } as React.CSSProperties & Record<string, string>;

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900" style={styleVars}>
      {/* Header (hidden in kiosk) */}
      {!isKiosk && (
        <header className="sticky top-0 z-20 border-b border-neutral-200 backdrop-blur supports-[backdrop-filter]:bg-white/75" style={{ background: `linear-gradient(90deg, var(--brand-faint), transparent)` }}>
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
            <h1 className="text-xl font-semibold tracking-tight">BCN HVAC · Equipos</h1>
            <div className="ml-auto flex items-center gap-2">
              {!admin ? (
                <div className="flex items-center gap-2">
                  <input type="password" value={pinTry} onChange={(e) => setPinTry(e.target.value)} placeholder="PIN" className="h-9 px-3 rounded-lg border border-neutral-300 text-sm w-24" />
                  <button onClick={tryLoginAdmin} className="h-9 px-3 rounded-lg text-sm text-white" style={{ backgroundColor: "var(--brand)" }}>Admin</button>
                </div>
              ) : (
                <button onClick={logoutAdmin} className="h-9 px-3 rounded-lg border text-sm">Salir</button>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Empresas (hidden in kiosk) */}
      {!isKiosk and (
        <main className="max-w-3xl mx-auto px-4 pb-24">
          <ul className="grid gap-4">
            {EMPRESAS.map((emp) => {
              const lista = porEmpresa[emp.key] || [];
              const abierto = !!openSec[emp.key];
              return (
                <li key={emp.key} className="rounded-2xl border bg-white shadow-sm overflow-hidden">
                  <button onClick={() => setOpenSec((s) => ({ ...s, [emp.key]: !s[emp.key] }))} className="w-full flex items-center justify-between p-4 active:scale-[0.99] transition text-left">
                    <div className="flex items-center gap-3">
                      <div className="h-7 px-3 rounded-full text-xs grid place-items-center font-semibold bg-neutral-200 text-neutral-700">{emp.label.toUpperCase()}</div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                      <span className="px-2 py-0.5 rounded-full text-xs bg-neutral-100">{lista.length} equipos</span>
                      <span className="text-neutral-400">{abierto ? "▴" : "▾"}</span>
                    </div>
                  </button>
                  <div className={`${abierto ? "block" : "hidden"} border-t border-neutral-200 bg-neutral-50/60`}>
                    <ul className="grid gap-3 p-3">
                      {lista.map((it, idx) => (
                        <li key={it.id}>
                          <button onClick={() => { setSelected(it); }} className="w-full text-left rounded-xl border bg-white p-4 shadow-sm active:scale-[0.99] transition border-neutral-200 hover:shadow-md">
                            <div className="flex items-center">
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col">
                                  <h3 className="font-semibold truncate text-base">Equipo {idx + 1}</h3>
                                  <div className="text-sm text-neutral-700 truncate">{it.nombre}</div>
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
      )}

      {/* Ficha */}
      {selected && (
        isKiosk ? (
          <div className="fixed inset-0 z-30 bg-white overflow-y-auto">
            {Ficha({ admin:false, draft:selected, setDraft:()=>{}, onChange:()=>{}, isKiosk:true })}
          </div>
        ) : (
          <div className="fixed inset-0 z-30">
            <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
            <div className="absolute inset-x-0 bottom-0 md:inset-y-0 md:right-0 md:left-auto md:w-[520px] bg-white rounded-t-3xl md:rounded-l-3xl shadow-2xl overflow-y-auto max-h-[92vh] md:max-h-none">
              <div className="p-4 sticky top-0 bg-white border-b border-neutral-200">
                <div className="flex items-center gap-2">
                  <button onClick={() => setSelected(null)} className="h-9 w-9 grid place-items-center rounded-xl border md:hidden">←</button>
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
                {Ficha({ admin, draft, setDraft, onChange: (next:any)=>setDraft(next), isKiosk:false })}

                {admin && (
                  <div className="pt-3 grid gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (!draft) return;
                          setItems(prev => {
                            const next = prev.map(e => e.id === draft.id ? draft : e);
                            saveData(next); return next;
                          });
                        }}
                        className="h-11 px-4 rounded-xl text-white"
                        style={{ backgroundColor: "var(--brand)" }}
                      >
                        Guardar cambios
                      </button>
                      <button
                        onClick={() => setDraft(JSON.parse(JSON.stringify(selected)))}
                        className="h-11 px-4 rounded-xl border hover:shadow-sm"
                      >
                        Descartar
                      </button>
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      Los cambios no se guardan hasta tocar <b>Guardar cambios</b>.
                    </div>
                  </div>
                )}
              </div>

              <div className="sticky bottom-0 p-3 bg-white/90 backdrop-blur border-t border-neutral-200">
                <div className="flex items-center gap-2">
                  <a className="h-11 px-4 rounded-xl border flex items-center justify-center hover:shadow-sm" href={`?id=${encodeURIComponent(selected.id)}`}>
                    Link directo
                  </a>
                  <button onClick={() => setSelected(null)} className="h-11 px-4 rounded-xl text-white" style={{ backgroundColor: "var(--brand)" }}>
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      )}

      {!admin && !isKiosk && (
        <button
          onClick={() => { const el = document.querySelector('input[type="password"]') as HTMLInputElement | null; if (el) el.focus(); }}
          className="fixed bottom-6 right-6 z-10 h-12 w-12 rounded-full shadow-lg text-white grid place-items-center md:hidden"
          style={{ backgroundColor: "var(--brand)" }}
          title="Entrar admin"
        >
          ⚙️
        </button>
      )}
    </div>
  );
}

function Ficha({ admin, draft, setDraft, onChange, isKiosk }:{ admin:boolean; draft:any; setDraft:any; onChange:(next:any)=>void; isKiosk:boolean }) {
  return (
    <div className="grid gap-5">
      {/* Generales */}
      <section className="grid gap-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Info label="Empresa" value={draft.empresa?.toUpperCase?.() || "-"} />
          <Info label="Tipo" value={draft.tipo || "-"} />
          <div>
            <label className="block text-[11px] text-neutral-500">Último servicio</label>
            {!admin ? (
              <div className="font-medium">{formatDate(draft.ultimoServicio)}</div>
            ) : (
              <input type="date" value={draft.ultimoServicio || hoyISO()} onChange={(e) => onChange({ ...draft, ultimoServicio: e.target.value })} className="mt-1 w-full h-10 px-3 rounded-xl border" />
            )}
          </div>
          <div>
            <label className="block text-[11px] text-neutral-500">Estado</label>
            {!admin ? (
              <div className="font-medium">{draft.estado}</div>
            ) : (
              <select value={draft.estado} onChange={(e) => onChange({ ...draft, estado: e.target.value })} className="mt-1 w-full h-10 px-3 rounded-xl border">
                <option>OK</option>
                <option>NO OK</option>
              </select>
            )}
          </div>
        </div>
      </section>

      {draft.tipo === "split" && (
        <section className="grid gap-3">
          <h3 className="text-base font-semibold">Consumos</h3>
          <div className="grid grid-cols-2 gap-3">
            <FieldNumber admin={admin} label="Consumo fan (A)" value={draft?.split?.consumoFan} onChange={(v:number) => onChange({ ...draft, split: { ...(draft?.split||{}), consumoFan: v } })} step={0.1} />
            <FieldNumber admin={admin} label="Consumo compresor (A)" value={draft?.split?.consumoCompresor} onChange={(v:number) => onChange({ ...draft, split: { ...(draft?.split||{}), consumoCompresor: v } })} step={0.1} />
          </div>
          <h3 className="text-base font-semibold">Presiones</h3>
          <div className="grid grid-cols-2 gap-3">
            <FieldNumber admin={admin} label="Presión alta (psi)" value={draft?.split?.presionAlta} onChange={(v:number) => onChange({ ...draft, split: { ...(draft?.split||{}), presionAlta: v } })} step={1} />
            <FieldNumber admin={admin} label="Presión baja (psi)" value={draft?.split?.presionBaja} onChange={(v:number) => onChange({ ...draft, split: { ...(draft?.split||{}), presionBaja: v } })} step={1} />
          </div>
        </section>
      )}

      {draft.tipo === "rooftop" and (
        <section className="grid gap-3">
          <h3 className="text-base font-semibold">Parámetros Rooftop</h3>
          <div className="grid grid-cols-2 gap-3">
            <FieldNumber admin={admin} label="Temperatura impulsión (°C)" value={draft?.rooftop?.temperaturaImpulsion} onChange={(v:number) => onChange({ ...draft, rooftop: { ...(draft?.rooftop||{}), temperaturaImpulsion: v } })} step={0.1} />
            <FieldNumber admin={admin} label="Amperaje compresor (A)" value={draft?.rooftop?.amperajeCompresor} onChange={(v:number) => onChange({ ...draft, rooftop: { ...(draft?.rooftop||{}), amperajeCompresor: v } })} step={0.1} />
            <FieldNumber admin={admin} label="Presión alta (psi)" value={draft?.rooftop?.presionAlta} onChange={(v:number) => onChange({ ...draft, rooftop: { ...(draft?.rooftop||{}), presionAlta: v } })} step={1} />
            <FieldNumber admin={admin} label="Presión baja (psi)" value={draft?.rooftop?.presionBaja} onChange={(v:number) => onChange({ ...draft, rooftop: { ...(draft?.rooftop||{}), presionBaja: v } })} step={1} />
          </div>
        </section>
      )}

      <section className="grid gap-2">
        <label className="block text-[11px] text-neutral-500">Notas</label>
        {!admin ? (
          <div className="text-sm whitespace-pre-wrap min-h-[2rem] rounded-xl bg-neutral-50 p-3 border">
            {draft.notas || "-"}
          </div>
        ) : (
          <textarea value={draft?.notas || ""} onChange={(e) => onChange({ ...draft, notas: e.target.value })} className="w-full h-24 p-3 rounded-xl border" />
        )}
      </section>
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

function FieldNumber({ admin, label, value, onChange, step = 1, }: { admin: boolean; label: string; value: number; onChange: (v: number) => void; step?: number; }) {
  return (
    <div>
      <label className="block text-[11px] text-neutral-500">{label}</label>
      {!admin ? (
        <div className="font-medium">{value ?? "-"}</div>
      ) : (
        <div className="flex items-center gap-2">
          <button className="h-10 w-10 rounded-xl border" onClick={() => onChange(Number((Number(value ?? 0) - step).toFixed(2)))}>-</button>
          <input type="number" step={step} value={value ?? 0} onChange={(e) => onChange(Number((e.target as HTMLInputElement).value))} className="h-10 px-3 rounded-xl border w-full" />
          <button className="h-10 w-10 rounded-xl border" onClick={() => onChange(Number((Number(value ?? 0) + step).toFixed(2)))}>+</button>
        </div>
      )}
    </div>
  );
}