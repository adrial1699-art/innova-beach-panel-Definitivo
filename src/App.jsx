import { useEffect, useState } from "react";
import { OBRAS, SHEET_ID } from "./config/obras";

export default function App() {
  const [obra, setObra] = useState("");
  const [bloque, setBloque] = useState("");
  const [vivienda, setVivienda] = useState("");
  const [rows, setRows] = useState([]);
  const [panelAbierto, setPanelAbierto] = useState(false);
  const [bajoEscalera, setBajoEscalera] = useState(false);

  /* =========================
     LÓGICA BAJO ESCALERA
  ========================= */
  const mostrarBajoEscalera = () => {
    if (!obra || !bloque || !vivienda) return false;

    const v = Number(vivienda);
    if (Number.isNaN(v)) return false;

    // INNOVA BEACH III → impares
    if (obra === "INNOVA BEACH III") {
      return v % 2 !== 0;
    }

    // INNOVA THIAR → impares
    if (obra === "INNOVA THIAR") {
      return v % 2 !== 0;
    }

    // INNOVA BEACH IV
    if (obra === "INNOVA BEACH IV") {
      // Bloque 1 → 2 plantas
      if (bloque === "Bloque 1") {
        return v % 2 !== 0;
      }

      // Bloque 2 → 3 plantas (planta baja real)
      const plantasBajasBloque2 = [11, 14, 17, 20];
      return plantasBajasBloque2.includes(v);
    }

    return false;
  };

  /* =========================
     CARGA DATOS SHEETS
  ========================= */
  useEffect(() => {
    if (!obra) return;

    setBloque("");
    setVivienda("");
    setPanelAbierto(false);
    setBajoEscalera(false);

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

  useEffect(() => {
    if (vivienda) setPanelAbierto(true);
  }, [vivienda]);

  /* =========================
     DERIVADOS
  ========================= */
  const bloques = obra ? Object.keys(OBRAS[obra].bloques) : [];
  const viviendas = obra && bloque ? OBRAS[obra].bloques[bloque] : [];

  const registros = rows.filter(
    r => r.bloque === bloque && r.vivienda === String(vivienda)
  );

  const tareasHechas = [...new Set(registros.map(r => r.tarea))];
  const progreso = Math.min(100, tareasHechas.length * 10);

  /* =========================
     RENDER
  ========================= */
  return (
    <div style={{ background: "#e6e6e6", minHeight: "100vh", fontFamily: "Arial" }}>

      {/* HEADER */}
      <header style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        background: "#cfcfcf",
        border: "8px solid #004694",
        outline: "8px solid #2563eb",
        outlineOffset: "-8px"
      }}>
        <img src="/logos/innova.png" height="90" />
        <h2 style={{ fontSize: 28 }}>Panel de Progreso de Obra</h2>
        <img src="/logos/winplast.png" height="110" />
      </header>

      {/* PANEL LATERAL */}
      <aside style={{
        position: "fixed",
        top: 140,
        left: panelAbierto ? 0 : -360,
        width: 340,
        padding: 20,
        background: "#cfcfcf",
        borderRight: "10px solid #004694",
        outline: "10px solid #91b338",
        outlineOffset: "-20px",
        transition: "left 0.3s ease",
        maxHeight: "80vh",
        overflowY: "auto",
        zIndex: 10
      }}>
        <h3 style={{ fontSize: 22 }}>Resumen vivienda</h3>

        {vivienda && (
          <>
            <p><strong>Obra:</strong> {obra}</p>
            <p><strong>Bloque:</strong> {bloque}</p>
            <p><strong>Vivienda:</strong> V{vivienda}</p>
            <p><strong>Progreso:</strong> {progreso}%</p>

            <h4 style={{ marginTop: 15 }}>Tareas completadas</h4>

            {tareasHechas.length === 0 && <p>No hay tareas</p>}

            <ul>
              {tareasHechas.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>

            {/* BAJO ESCALERA */}
            {mostrarBajoEscalera() && (
              <label style={{ fontWeight: "bold", fontSize: 16 }}>
                <input
                  type="checkbox"
                  checked={bajoEscalera}
                  onChange={e => setBajoEscalera(e.target.checked)}
                  style={{ marginRight: 8 }}
                />
                Bajo escalera (extra)
              </label>
            )}

            <button
              onClick={() => setPanelAbierto(false)}
              style={{ marginTop: 20, width: "100%", padding: 10 }}
            >
              Cerrar panel
            </button>
          </>
        )}
      </aside>

      {/* CONTENIDO CENTRAL */}
      <main style={{
        padding: 30,
        marginLeft: panelAbierto ? 360 : 20,
        transition: "margin-left 0.3s ease"
      }}>
        <select value={obra} onChange={e => setObra(e.target.value)} style={{ fontSize: 18, padding: 8 }}>
          <option value="">Selecciona obra</option>
          {Object.keys(OBRAS).map(o => <option key={o}>{o}</option>)}
        </select>

        {obra && (
          <select value={bloque} onChange={e => setBloque(e.target.value)} style={{ fontSize: 18, padding: 8 }}>
            <option value="">Selecciona bloque</option>
            {bloques.map(b => <option key={b}>{b}</option>)}
          </select>
        )}

        {bloque && (
          <select value={vivienda} onChange={e => setVivienda(e.target.value)} style={{ fontSize: 18, padding: 8 }}>
            <option value="">Selecciona vivienda</option>
            {viviendas.map(v => <option key={v}>V{v}</option>)}
          </select>
        )}
      </main>
    </div>
  );
}
