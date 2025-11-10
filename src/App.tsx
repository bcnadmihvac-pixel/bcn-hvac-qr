
import React, { useEffect, useMemo, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

/**
 * BCN HVAC — QR Equipos
 * - Admin PIN: 13579
 * - Edición por teclado (y +/-) con botón "Guardar cambios"
 * - Modo kiosco (solo lectura) cuando se entra con ?id=
 * - CAPEX con 38 equipos (nombres actualizados)
 */

// ===================== Constantes =====================
const EMPRESAS = [
  { key: "capex", label: "capex" },
  { key: "terrazas", label: "terrazas" },
];

const LS_KEY = "qr-equipos-data-v1";
const LS_ADMIN = "qr-equipos-admin";

// ===================== Helpers =====================
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

// ===================== Datos CAPEX (38) =====================
function makeCapex38() {
  return [
    { id: "capex-1",  empresa: "capex", nombre: "Trane 4500 FG R-410", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-2",  empresa: "capex", nombre: "BGH 4500 R-22", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-3",  empresa: "capex", nombre: "TOSHIBA 2250 R-22", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-4",  empresa: "capex", nombre: "LG 3000 FG R-410", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-5",  empresa: "capex", nombre: "ELECTROLUX 4500 FG R-22", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-6",  empresa: "capex", nombre: "WHITE WESTINGHOUSE 3000 FG", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-7",  empresa: "capex", nombre: "BGH 6000 FG R-22", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-8",  empresa: "capex", nombre: "TOSHIBA 2250 R-22", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-9",  empresa: "capex", nombre: "TOSHIBA 2250 R-22", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-10", empresa: "capex", nombre: "SANYO 3000 FG R-410", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-11", empresa: "capex", nombre: "ELECTROLUX 4500 FG R-22", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-12", empresa: "capex", nombre: "BGH 4500 R-410", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-13", empresa: "capex", nombre: "BGH 4500 R-410", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-14", empresa: "capex", nombre: "SURREY 2250 R-22", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-15", empresa: "capex", nombre: "TOSHIBA 4500 R-22", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-16", empresa: "capex", nombre: "TOSHIBA 4500 R-22", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-17", empresa: "capex", nombre: "TRANE 4500 R-410", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-18", empresa: "capex", nombre: "LG 4500 R-410", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-19", empresa: "capex", nombre: "BGH 3000 R-410", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-20", empresa: "capex", nombre: "BGH 3000 R-410", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-21", empresa: "capex", nombre: "LG 3000 R-22", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-22", empresa: "capex", nombre: "LG 3000 R-22", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-23", empresa: "capex", nombre: "BGH 3000 R-410", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-24", empresa: "capex", nombre: "SURREY 3000 R-410", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-25", empresa: "capex", nombre: "BGH 4500 R-22", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-26", empresa: "capex", nombre: "BGH 4500 R-22", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-27", empresa: "capex", nombre: "PISO TECHO", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-28", empresa: "capex", nombre: "TRANE INVERTER 2250 R-410", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-29", empresa: "capex", nombre: "TRANE INVERTER 2250 R-410", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-30", empresa: "capex", nombre: "TRANE 6000 R-410", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-31", empresa: "capex", nombre: "TRANE 6000 R-410", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-32", empresa: "capex", nombre: "TELEFUNKEN 6000 R-410", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-33", empresa: "capex", nombre: "TRANE 6000 R-410", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-34", empresa: "capex", nombre: "TRANE 2250 R410", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-35", empresa: "capex", nombre: "TRANE 2250 R410", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-36", empresa: "capex", nombre: "TRANE 2250 R410", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-37", empresa: "capex", nombre: "TRANE 2250 R410", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
    { id: "capex-38", empresa: "capex", nombre: "LG 4500 R410", tipo: "split", estado: "OK", ultimoServicio: hoyISO(), split: {}, rooftop: null, notas: "" },
  ];
}

// ===================== Datos iniciales =====================
const EXAMPLE_DATA = [
  ...makeCapex38(),
];

// ===================== Persistencia =====================
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

// ===================== Query (?id=) =====================
function useQueryId() {
  const [id, setId] = useState<string | null>(null);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setId(params.get("id"));
  }, []);
  return id;
}

// ===================== App =====================
export default function App() {
  const [items, setItems] = useState<any[]>(() => loadData());
  const [admin, setAdmin] = useState<boolean>(() => localStorage.getItem(LS_ADMIN) === "1");
  const [pinTry, setPinTry] = useState("");
  const [selected, setSelected] = useState<any | null>(null);
  const [draft, setDraft] = useState<any | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [openSec, setOpenSec] = useState<Record<string, boolean>>({ capex: true, terrazas: false });

  const queryId = useQueryId();
  const isKiosk = !!queryId;

  useEffect(() => {
    if (selected) setDraft(JSON.parse(JSON.stringify(selected)));
    else setDraft(null);
  }, [selected]);

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

  const makeLink = (id: string) => window.location.origin + window.location.pathname + `?id=${id}`;

  const porEmpresa = useMemo(() => {
    const map: Record<string, any[]> = { capex: [], terrazas: [] };
    for (const it of items) if (map[it.empresa]) map[it.empresa].push(it);
    return map;
  }, [items]);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">

      {!isKiosk && (
        <header className="p-3 border-b border-neutral-200 flex items-center gap-2">
          <strong>BCN HVAC · Equipos</strong>
          <div className="ml-auto flex items-center gap-2">
            {!admin ? (
              <>
                <input
                  type="password"
                  value={pinTry}
                  onChange={(e) => setPinTry(e.target.value)}
                  placeholder="PIN"
                  className="h-9 px-3 rounded border w-24"
                />
                <button onClick={tryLoginAdmin} className="h-9 px-3 rounded text-white" style={{ background: "#0ea5e9" }}>
                  Admin
                </button>
              </>
            ) : (
              <button onClick={logoutAdmin} className="h-9 px-3 rounded border">Salir</button>
            )}
          </div>
        </header>
      )}

      {!isKiosk && (
        <main className="max-w-3xl mx-auto p-4 grid gap-4">
          {EMPRESAS.map((emp) => {
            const lista = porEmpresa[emp.key] || [];
            const abierto = !!openSec[emp.key];
            return (
              <section key={emp.key} className="rounded-2xl border bg-white shadow-sm overflow-hidden">
                <button
                  onClick={() => setOpenSec((s) => ({ ...s, [emp.key]: !s[emp.key] }))}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <div className="font-semibold">{emp.label.toUpperCase()}</div>
                  <div className="text-sm text-neutral-500">{lista.length} equipos {abierto ? "▴" : "▾"}</div>
                </button>

                {abierto && (
                  <div className="border-t bg-neutral-50/50">
                    <ul className="grid gap-3 p-3">
                      {lista.map((it, idx) => (
                        <li key={it.id}>
                          <button
                            onClick={() => { setSelected(it); setShowQR(false); }}
                            className="w-full text-left rounded-xl border bg-white p-4 hover:shadow-sm"
                          >
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
                )}
              </section>
            );
          })}
        </main>
      )}

      {selected && (
        <div className="fixed inset-0 bg-white overflow-y-auto">
          <div className="p-4 border-b flex items-center gap-2">
            {!isKiosk && (
              <button onClick={() => setSelected(null)} className="h-9 w-9 rounded border">←</button>
            )}
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate">{selected.nombre}</div>
              <div className="text-xs mt-1">
                Estado general:{" "}
                <span className={`text-xs px-2 py-0.5 rounded-full ${estadoStyles((draft || selected).estado)}`}>
                  {(draft || selected).estado}
                </span>
              </div>
            </div>
            {!isKiosk && (
              <a className="px-3 h-9 rounded border grid place-items-center" href={`?id=${encodeURIComponent(selected.id)}`}>
                Link directo
              </a>
            )}
          </div>

          <div className="p-4 grid gap-5">

            <section className="grid gap-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <Info label="Empresa" value={selected.empresa.toUpperCase()} />
                <Info label="Tipo" value={selected.tipo} />

                <div className="col-span-2">
                  <label className="block text-[11px] text-neutral-500">Nombre</label>
                  {!admin ? (
                    <div className="font-medium">{(draft || selected).nombre}</div>
                  ) : (
                    <input
                      type="text"
                      value={(draft || selected).nombre || ""}
                      onChange={(e) => setDraft({ ...(draft || selected), id: selected.id, nombre: e.target.value })}
                      className="mt-1 w-full h-10 px-3 rounded border"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-500">Último servicio</label>
                  {!admin ? (
                    <div className="font-medium">{formatDate((draft || selected).ultimoServicio)}</div>
                  ) : (
                    <input
                      type="date"
                      value={(draft || selected).ultimoServicio || hoyISO()}
                      onChange={(e) => setDraft({ ...(draft || selected), id: selected.id, ultimoServicio: e.target.value })}
                      className="mt-1 w-full h-10 px-3 rounded border"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-500">Estado</label>
                  {!admin ? (
                    <div className="font-medium">{(draft || selected).estado}</div>
                  ) : (
                    <select
                      value={(draft || selected).estado}
                      onChange={(e) => setDraft({ ...(draft || selected), id: selected.id, estado: e.target.value })}
                      className="mt-1 w-full h-10 px-3 rounded border"
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
                    value={(draft?.split || selected.split)?.consumoFan}
                    onChange={(v: number) =>
                      setDraft({ ...(draft || selected), id: selected.id, split: { ...(draft?.split || selected.split || {}), consumoFan: v } })
                    }
                    step={0.1}
                  />
                  <FieldNumber
                    admin={admin}
                    label="Consumo compresor (A)"
                    value={(draft?.split || selected.split)?.consumoCompresor}
                    onChange={(v: number) =>
                      setDraft({ ...(draft || selected), id: selected.id, split: { ...(draft?.split || selected.split || {}), consumoCompresor: v } })
                    }
                    step={0.1}
                  />
                </div>

                <h3 className="text-base font-semibold">Presiones</h3>
                <div className="grid grid-cols-2 gap-3">
                  <FieldNumber
                    admin={admin}
                    label="Presión alta (psi)"
                    value={(draft?.split || selected.split)?.presionAlta}
                    onChange={(v: number) =>
                      setDraft({ ...(draft || selected), id: selected.id, split: { ...(draft?.split || selected.split || {}), presionAlta: v } })
                    }
                    step={1}
                  />
                  <FieldNumber
                    admin={admin}
                    label="Presión baja (psi)"
                    value={(draft?.split || selected.split)?.presionBaja}
                    onChange={(v: number) =>
                      setDraft({ ...(draft || selected), id: selected.id, split: { ...(draft?.split || selected.split || {}), presionBaja: v } })
                    }
                    step={1}
                  />
                </div>
              </section>
            )}

            <section className="grid gap-2">
              <label className="block text-[11px] text-neutral-500">Notas</label>
              {!admin ? (
                <div className="text-sm whitespace-pre-wrap min-h-[2rem] rounded bg-neutral-50 p-3 border">
                  {(draft || selected).notas || "-"}
                </div>
              ) : (
                <textarea
                  value={(draft || selected).notas || ""}
                  onChange={(e) => setDraft({ ...(draft || selected), id: selected.id, notas: e.target.value })}
                  className="w-full h-24 p-3 rounded border"
                />
              )}
            </section>

            <div className="h-16" />

            <div className="sticky bottom-0 p-3 bg-white/90 border-t">
              <div className="flex items-center gap-2">
                <button onClick={() => setShowQR((s) => !s)} className="h-11 px-4 rounded border flex-1">
                  {showQR ? "Ocultar QR" : "Mostrar QR"}
                </button>

                {!isKiosk && admin && (
                  <>
                    <button
                      onClick={() => {
                        if (!draft) return;
                        const next = items.map((e) =>
                          e.id === selected.id ? { ...selected, ...draft } : e
                        );
                        saveData(next);
                        setItems(next);
                        setSelected({ ...selected, ...draft });
                      }}
                      className="h-11 px-4 rounded text-white"
                      style={{ background: "#0ea5e9" }}
                    >
                      Guardar cambios
                    </button>

                    <button
                      onClick={() =>
                        setDraft(JSON.parse(JSON.stringify(selected)))
                      }
                      className="h-11 px-4 rounded border"
                    >
                      Descartar
                    </button>
                  </>
                )}

                {!isKiosk && (
                  <a
                    className="h-11 px-4 rounded border grid place-items-center"
                    href={`?id=${encodeURIComponent(selected.id)}`}
                  >
                    Link directo
                  </a>
                )}
              </div>

              {showQR && (
                <div className="pt-3 grid place-items-center">
                  <QRCodeCanvas value={makeLink(selected.id)} size={196} includeMargin level="M" />
                  <div className="text-[11px] text-neutral-500 break-all mt-2">{makeLink(selected.id)}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ===================== Auxiliares UI =====================
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="block text-[11px] text-neutral-500">{label}</span>
      <span className="font-medium">{value ?? "-"}</span>
    </div>
  );
}

// Campo numérico editable por teclado y con +/- (live update)
function FieldNumber({
  admin,
  label,
  value,
  onChange,
  step = 1,
}: {
  admin: boolean;
  label: string;
  value: number | null | undefined;
  onChange: (v: number) => void;
  step?: number;
}) {
  const [txt, setTxt] = React.useState<string>("");

  React.useEffect(() => {
    setTxt(value == null ? "" : String(value));
  }, [value]);

  const updateFromText = (s: string) => {
    setTxt(s);
    const nrm = s.replace(",", ".");
    // Permitimos escribir en vivo: no forzamos número hasta que sea válido
    if (nrm === "" || nrm === "-" || nrm.endsWith(".")) return;
    const n = Number(nrm);
    if (!Number.isNaN(n)) onChange(n);
  };

  const bump = (d: number) => {
    const cur = Number(String(txt).replace(",", "."));
    const base = Number.isNaN(cur) ? 0 : cur;
    const next = Number((base + d).toFixed(2));
    setTxt(String(next));
    onChange(next);
  };

  if (!admin) {
    return (
      <div>
        <label className="block text-[11px] text-neutral-500">{label}</label>
        <div className="font-medium">{value ?? "-"}</div>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-[11px] text-neutral-500">{label}</label>
      <div className="flex items-center gap-2">
        <button className="h-10 w-10 rounded border" onClick={() => bump(-step)} type="button">-</button>
        <input
          type="text"
          inputMode="decimal"
          pattern="[0-9]*[.,]?[0-9]*"
          value={txt}
          onChange={(e) => updateFromText(e.target.value)}
          onWheel={(e) => (e.target as HTMLInputElement).blur()}
          className="h-10 px-3 rounded border w-full"
        />
        <button className="h-10 w-10 rounded border" onClick={() => bump(step)} type="button">
                  <>
     
