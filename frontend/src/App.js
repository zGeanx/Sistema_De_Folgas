import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import LoginPage from "./LoginPage";

const API_URL = ProcessingInstruction.env.REACT_APP_URL;

const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
        console.error("Erro ao buscar dados!", error);
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
  const cartomantes = [...new Set(folgasAprovadas.map((f) => f.cartomante))];

  const escalaMap = new Map();
  folgasAprovadas.forEach((f) => {
    const key = `${f.cartomante}-${f.dia_semana}-${f.turno}`;
    escalaMap.set(key, "FOLGA");
  });

  if (loading) return <p>Carregando escala...</p>;

  return (
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
  );
}

function App() {
  const [token, setToken] = useState(localStorage.getItem("accessToken"));

  const handleLoginSuccess = () => {
    setToken(localStorage.getItem("accessToken"));
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setToken(null);
  };

  if (!token) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Sistema de Escalas</h1>
        <button
          onClick={handleLogout}
          style={{ position: "absolute", top: "20px", right: "20px" }}
        >
          Logout
        </button>
      </header>
      <main>
        <TabelaEscala />
        {/* Aqui você adicionaria o formulário de solicitação e a lista de aprovação do admin */}
      </main>
    </div>
  );
}

export default App;
