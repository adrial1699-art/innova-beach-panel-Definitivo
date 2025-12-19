import { useEffect, useState } from "react";
import { OBRAS, SHEET_ID } from "./config/obras";

export default function App() {
  const [obra, setObra] = useState("");
  const [bloque, setBloque] = useState("");
  const [vivienda, setVivienda] = useState("");
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (!obra) return;

    setBloque("");
    setVivienda("");

    const sheet = OBRAS[obra].sheetName;
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheet)}`;

    fetch(url)
      .then(r => r.text())
      .then(t => {
        const json = JSON.parse(t.substring(47).slice(0, -2));
        const data = json.table.rows.map(r => ({
          bloque: r.c[1]?.v || "",
          vivienda: String(r.c[2]?.v || ""),
          tarea: r.c[3]?.v || ""
        }));
        setRows(data);
      });
  }, [obra]);

  const bloques = obra ? Object.keys(OBRAS[obra].bloques) : [];
  const viviendas = obra && bloque ? OBRAS[obra].bloques[bloque] : [];

  const registros = rows.filter(
    r => r.bloque === bloque && r.vivienda === String(vivienda)
  );

  const tareasHechas = [...new Set(registros.map(r => r.tarea))];
  const progreso = Math.min(100, tareasHechas.length * 10);

  return (
    <div
      style={{
        background: "#e6e6e6",
        minHeight: "100vh",
        fontFamily: "Arial",
        overflowX: "hidden"
      }}
    >
      {/* HEADER */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 24,
          background: "#cfcfcf",
          border: "8px solid #004694",
          outline: "8px solid #2563eb",
          outlineOffset: "-8px"
        }}
      >
        <img src="/logos/innova.png" height="90" />
        <h1 style={{ fontSize: 32 }}>Panel de Progreso de Obra</h1>
        <img src="/logos/winplast.png" height="110" />
      </header>

      {/* CUERPO */}
      <div style={{ display: "flex", minHeight: "calc(100vh - 160px)" }}>
        
        {/* PANEL LATERAL SLIDE */}
        <aside
          style={{
            position: "fixed",
            top: 160,
            left: vivienda ? 0 : -360,
            width: 360,
            height: "calc(100vh - 160px)",
            padding: 24,
            background: "#cfcfcf",
            borderRight: "10px solid #004694",
            outline: "10px solid #91b338",
            outlineOffset: "-20px",
            transition: "left 0.35s ease",
            zIndex: 10
          }}
        >
          <h2 style={{ fontSize: 26, marginBottom: 12 }}>
            Resumen vivienda
          </h2>

          {vivienda && (
            <>
              <p style={{ fontSize: 18 }}><strong>Obra:</strong> {obra}</p>
              <p style={{ fontSize: 18 }}><strong>Bloque:</strong> {bloque}</p>
              <p style={{ fontSize: 18 }}><strong>Vivienda:</strong> V{vivienda}</p>
              <p style={{ fontSize: 18 }}><strong>Progreso:</strong> {progreso}%</p>

              <h3 style={{ marginTop: 16, fontSize: 22 }}>
                Tareas completadas
              </h3>

              {tareasHechas.length === 0 && (
                <p style={{ fontSize: 16 }}>No hay tareas registradas</p>
              )}

              <ul style={{ paddingLeft: 20, fontSize: 17 }}>
                {tareasHechas.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </>
          )}
        </aside>

        {/* CONTENIDO CENTRAL */}
        <main
          style={{
            flex: 1,
            padding: 30,
            marginLeft: vivienda ? 360 : 0,
            transition: "margin-left 0.35s ease"
          }}
        >
          {/* SELECTORES GRANDES */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <select
              value={obra}
              onChange={e => setObra(e.target.value)}
              style={{ fontSize: 20, padding: 10 }}
            >
              <option value="">Selecciona obra</option>
              {Object.keys(OBRAS).map(o => (
                <option key={o}>{o}</option>
              ))}
            </select>

            {obra && (
              <select
                value={bloque}
                onChange={e => setBloque(e.target.value)}
                style={{ fontSize: 20, padding: 10 }}
              >
                <option value="">Selecciona bloque</option>
                {bloques.map(b => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            )}

            {bloque && (
              <select
                value={vivienda}
                onChange={e => setVivienda(e.target.value)}
                style={{ fontSize: 20, padding: 10 }}
              >
                <option value="">Selecciona vivienda</option>
                {viviendas.map(v => (
                  <option key={v}>V{v}</option>
                ))}
              </select>
            )}
          </div>

          {/* TARJETA PROGRESO */}
          {vivienda && (
            <div
              style={{
                marginTop: 40,
                padding: 24,
                background: "#bdbdbd",
                border: "3px double blue",
                fontSize: 20
              }}
            >
              <strong>{obra} · {bloque} · V{vivienda}</strong>

              <div style={{ background: "#999", height: 22, marginTop: 14 }}>
                <div
                  style={{
                    width: progreso + "%",
                    height: "100%",
                    background: "green"
                  }}
                />
              </div>

              <p style={{ marginTop: 10 }}>{progreso}%</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
