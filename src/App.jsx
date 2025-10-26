import { useState } from "react";
import axios from "axios";

export default function App() {
  const [termo, setTermo] = useState("");
  const [resultados, setResultados] = useState([]);
  const [carregando, setCarregando] = useState(false);

  const buscar = async () => {
    setCarregando(true);
    try {
      const res = await axios.post("http://localhost:3001/buscar", { termo });
      setResultados(res.data.resultados);
    } catch (err) {
      alert("Erro ao buscar dados. Verifique se a API está rodando na porta 3001.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 16, fontFamily: "Inter, system-ui" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>TrendSpy 🔎</h1>
      <p style={{ opacity: 0.8 }}>Descubra o que está sendo anunciado agora.</p>

      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <input
          placeholder="Digite um nicho (ex: emagrecimento)"
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          style={{ flex: 1, padding: 12, border: "1px solid #ddd", borderRadius: 8 }}
        />
        <button
          onClick={buscar}
          style={{
            padding: "12px 16px",
            borderRadius: 8,
            background: "black",
            color: "white",
            cursor: "pointer",
          }}
        >
          {carregando ? "Buscando..." : "Buscar"}
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 16,
          marginTop: 24,
        }}
      >
        {resultados.map((item) => (
          <div key={item.id} style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
            <img src={item.imagem} alt={item.produto} style={{ width: "100%", borderRadius: 8 }} />
            <h3 style={{ margin: "12px 0 4px", fontSize: 18, fontWeight: 700 }}>{item.produto}</h3>
            <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 8 }}>
              {item.plataforma} • anúncios ativos: <b>{item.anunciosAtivos}</b>
            </div>
            <div style={{ fontSize: 13, opacity: 0.8 }}>
              Última atividade: {item.ultimaAparicao}
            </div>
            <p style={{ fontSize: 14, marginTop: 8 }}>{item.textoAnuncio}</p>
            <a
              href={item.linkOrigem}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: 14, color: "#007bff" }}
            >
              Ver origem ↗
            </a>
            <button
  onClick={async () => {
    try {
      const res = await axios.post("http://localhost:3001/analise", {
        textos: [item.textoAnuncio],
      });
      alert("📊 Análise IA:\n\n" + res.data.resumo);
    } catch {
      alert("Erro ao gerar análise IA.");
    }
  }}
  style={{
    marginTop: 10,
    padding: "10px 12px",
    borderRadius: 8,
    background: "#f1f1f1",
    border: "1px solid #ddd",
    cursor: "pointer",
  }}
>
  Ver análise IA
</button>

          </div>
        ))}
      </div>
    </div>
  );
}
