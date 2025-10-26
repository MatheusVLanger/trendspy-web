import { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  const [termo, setTermo] = useState("");
  const [resultados, setResultados] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [tema, setTema] = useState(
    localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  );

  // Atualiza o tema quando o usuário muda manualmente
 useEffect(() => {
  document.documentElement.classList.remove("dark", "light");
  document.documentElement.classList.add(tema);
  localStorage.setItem("theme", tema);
}, [tema]);


  const alternarTema = () => {
    setTema(tema === "dark" ? "light" : "dark");
  };

  const buscar = async () => {
    setCarregando(true);
    try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/buscar`, { termo });

      setResultados(res.data.resultados);
    } catch {
      alert("❌ Erro ao buscar dados. Verifique se a API está rodando.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50 transition">
        <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
          <h1 className="text-2xl font-extrabold text-red-500 dark:text-red-400">
            TrendSpy 🔍
          </h1>

          <div className="flex items-center gap-4">
            <button
              onClick={alternarTema}
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              title="Alternar tema"
            >
              {tema === "dark" ? "🌞" : "🌙"}
            </button>
            <span className="text-sm text-gray-500 dark:text-gray-400">by Matheus</span>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Descubra o que está sendo anunciado agora
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Busque por nichos como{" "}
            <span className="font-medium text-gray-700 dark:text-gray-300">
              emagrecimento, skincare, finanças...
            </span>
          </p>
        </div>

        {/* Barra de busca */}
        <div className="flex gap-3 mb-10">
          <input
            className="flex-1 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400"
            placeholder="Digite um nicho (ex: emagrecimento)"
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
          />
          <button
            onClick={buscar}
            disabled={carregando}
            className={`px-6 py-3 rounded-lg text-white font-medium transition ${
              carregando
                ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                : "bg-black hover:bg-red-600 dark:bg-red-500 dark:hover:bg-red-400"
            }`}
          >
            {carregando ? "Buscando..." : "Buscar"}
          </button>
        </div>

        {/* Resultados */}
        {resultados.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resultados.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition border border-gray-100 dark:border-gray-700 overflow-hidden"
              >
                <img
                  src={item.imagem}
                  alt={item.produto}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{item.produto}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {item.plataforma} • {item.anunciosAtivos} anúncios
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {item.textoAnuncio}
                  </p>

                  <div className="mt-4 flex justify-between items-center">
                    <a
                      href={item.linkOrigem}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Ver origem ↗
                    </a>
                    <button
                      onClick={async () => {
                        try {
                         const res = await axios.post(`${import.meta.env.VITE_API_URL}/analise`, {
  textos: [item.textoAnuncio],
});

                          alert("📊 Análise IA:\n\n" + res.data.resumo);
                        } catch {
                          alert("Erro ao gerar análise IA.");
                        }
                      }}
                      className="px-3 py-2 text-xs bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                    >
                      Ver análise IA
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 text-sm">
            Nenhum resultado ainda. Faça uma busca para começar!
          </p>
        )}
      </main>
    </div>
  );
}
