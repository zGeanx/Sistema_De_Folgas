import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import FormularioFolga from "./FormularioFolga";

const API_URL = process.env.REACT_APP_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
});

function TabelaEscala() {
  const [folgasAprovadas, setFolgasAprovadas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/solicitacoes/")
      .then((response) => {
        const aprovadas = response.data.filter((s) => s.status === "aprovada");
        setFolgasAprovadas(aprovadas);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar dados da escala!", error);
        setLoading(false);
      });
  }, []);

  const dias = [
    "segunda",
    "terca",
    "quarta",
    "quinta",
    "sexta",
    "sabado",
    "domingo",
  ];
  const turnos = ["manha", "tarde", "noite"];
  const cartomantes = [
    ...new Set(folgasAprovadas.map((f) => f.cartomante_nome)),
  ];

  const escalaMap = new Map();
  folgasAprovadas.forEach((f) => {
    const key = `${f.cartomante_nome}-${f.dia_semana}-${f.turno}`;
    escalaMap.set(key, "FOLGA");
  });

  if (loading) return <p>Carregando escala...</p>;
  if (cartomantes.length === 0)
    return <p>Nenhuma folga aprovada para exibir na escala.</p>;

  return (
    <div className="tabela-wrapper">
      <table>
        <thead>
          <tr>
            <th>Cartomante / Turno</th>
            {dias.map((dia) => (
              <th key={dia}>{dia.charAt(0).toUpperCase() + dia.slice(1)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cartomantes.map((cartomante) =>
            turnos.map((turno) => (
              <tr key={`${cartomante}-${turno}`}>
                <td>
                  <strong>{cartomante}</strong> - {turno}
                </td>
                {dias.map((dia) => {
                  const key = `${cartomante}-${dia}-${turno}`;
                  return (
                    <td
                      key={key}
                      className={escalaMap.get(key) ? "folga" : "trabalho"}
                    >
                      {escalaMap.get(key) || "Trabalhando"}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Sistema de Escalas de Folga</h1>
      </header>
      <main>
        <FormularioFolga apiClient={apiClient} />
        <hr style={{ margin: "40px auto", width: "80%" }} />
        <h2>Escala da Semana (Folgas Aprovadas)</h2>
        <TabelaEscala />
      </main>
    </div>
  );
}

export default App;
