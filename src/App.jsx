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
          vivienda: String(r.c[2]?.v || "")
        }));
        setRows(data);
      });
  }, [obra]);

  const bloques = obra ? Object.keys(OBRAS[obra].bloques) : [];
  const viviendas = obra && bloque ? OBRAS[obra].bloques[bloque] : [];

  const registros = rows.filter(
    r => r.bloque === bloque && r.vivienda === String(vivienda)
  );

  const progreso = Math.min(100, registros.length * 10);

  return (
    <div
      style={{
        background: "#e6e6e6",
        minHeight: "100vh",
        fontFamily: "Arial",
        borderLeft: "10px solid #91b338",
        borderRight: "10px solid #91b338"
      }}
    >
      {/* HEADER */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 20,
          background: "#cfcfcf",
          border: "8px solid #004694",
          outline: "8px solid #2563eb",
          outlineOffset: "-8px"
        }}
      >
        <img src="/logos/innova.png" height="80" />
        <h2>Panel de Progreso de Obra</h2>
        <img src="/logos/winplast.png" height="100" />
      </header>

      {/* CUERPO */}
      <div style={{ display: "flex", minHeight: "calc(100vh - 140px)" }}>
        {/* PANEL LATERAL */}
        <aside
          style={{
            width: 320,
            padding: 20,
            background: "#cfcfcf",
            borderRight: "10px solid #004694",
            outline: "10px solid #91b338",
            outlineOffset: "-20px"
          }}
        >
          <h3>Resumen vivienda</h3>

          {!vivienda && <p>Selecciona una vivienda</p>}

          {vivienda && (
            <>
              <p><strong>Obra:</strong> {obra}</p>
              <p><strong>Bloque:</strong> {bloque}</p>
              <p><strong>Vivienda:</strong> V{vivienda}</p>
              <p><strong>Registros:</strong> {registros.length}</p>
              <p><strong>Progreso:</strong> {progreso}%</p>
            </>
          )}
        </aside>

        {/* CONTENIDO CENTRAL */}
        <main style={{ flex: 1, padding: 20 }}>
          <select value={obra} onChange={e => setObra(e.target.value)}>
            <option value="">Selecciona obra</option>
            {Object.keys(OBRAS).map(o => (
              <option key={o}>{o}</option>
            ))}
          </select>

          {obra && (
            <select value={bloque} onChange={e => setBloque(e.target.value)}>
              <option value="">Selecciona bloque</option>
              {bloques.map(b => (
                <option key={b}>{b}</option>
              ))}
            </select>
          )}

          {bloque && (
            <select value={vivienda} onChange={e => setVivienda(e.target.value)}>
              <option value="">Selecciona vivienda</option>
              {viviendas.map(v => (
                <option key={v}>V{v}</option>
              ))}
            </select>
          )}

          {vivienda && (
            <div
              style={{
                marginTop: 30,
                padding: 20,
                background: "#bdbdbd",
                border: "3px double blue"
              }}
            >
              <strong>{obra} · {bloque} · V{vivienda}</strong>

              <div style={{ background: "#999", height: 18, marginTop: 10 }}>
                <div
                  style={{
                    width: progreso + "%",
                    height: "100%",
                    background: "green"
                  }}
                />
              </div>

              <p>{progreso}%</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
