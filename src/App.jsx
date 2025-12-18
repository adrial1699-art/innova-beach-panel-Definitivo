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
    <div style={{
  background: "#e6e6e6",
  minHeight: "100vh",
  fontFamily: "Arial",
  borderLeft: "10px solid #2563eb",   // azul
  borderRight: "10px solid #22c55e"   // verde
}}>

     <header style={{
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: 20,
  background: "#cfcfcf",        // gris más oscuro
  border: "8px solid #1e40af",   // azul
  outline: "8px solid #2563eb",  // segundo azul
  outlineOffset: "-8px"
}}>

        <img src="/logos/innova.png" height="80" />
        <h2>Panel de Progreso de Obra</h2>
        <img src="/logos/winplast.png" height="100" />
      </header>

      <div style={{ padding:20 }}>
        <select value={obra} onChange={e=>setObra(e.target.value)}>
          <option value="">Selecciona obra</option>
          {Object.keys(OBRAS).map(o => <option key={o}>{o}</option>)}
        </select>

        {obra && (
          <select value={bloque} onChange={e=>setBloque(e.target.value)}>
            <option value="">Selecciona bloque</option>
            {bloques.map(b => <option key={b}>{b}</option>)}
          </select>
        )}

        {bloque && (
          <select value={vivienda} onChange={e=>setVivienda(e.target.value)}>
            <option value="">Selecciona vivienda</option>
            {viviendas.map(v => <option key={v}>V{v}</option>)}
          </select>
        )}

        {vivienda && (
          <div style={{ marginTop:20, padding:15, background:"#fff", border:"3px double blue" }}>
            <strong>{obra} · {bloque} · V{vivienda}</strong>
            <div style={{ background:"#ccc", height:18, marginTop:8 }}>
              <div style={{ width: progreso+"%", height:"100%", background:"green" }} />
            </div>
            <p>{progreso}%</p>
          </div>
        )}
      </div>
    </div>
  );
}
