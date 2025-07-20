import React, { useState } from "react";
import "./FormularioFolga.css";

function FormularioFolga({ apiClient, onFolgaSolicitada }) {
  const [nome, setNome] = useState("");
  const [diaSemana, setDiaSemana] = useState("segunda");
  const [turno, setTurno] = useState("manha");
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("success");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome) {
      setMensagem("Por favor, preencha seu nome místico.");
      setTipoMensagem("error");
      return;
    }
    setMensagem("");

    try {
      await apiClient.post("/solicitacoes/", {
        cartomante_nome: nome,
        dia_semana: diaSemana,
        turno: turno,
      });
      setMensagem("Solicitação de folga enviada!");
      setTipoMensagem("success");
      setNome("");
    } catch (error) {
      setMensagem("Erro ao enviar solicitação.");
      setTipoMensagem("error");
      console.error("Erro ao solicitar folga:", error);
    }
  };

  return (
    <div className="form-container">
      <h2>Solicitar Folga</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="nome">Nome Místico:</label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="dia">Dia da Semana:</label>
          <select
            id="dia"
            value={diaSemana}
            onChange={(e) => setDiaSemana(e.target.value)}
          >
            <option value="segunda">Segunda-feira</option>
            <option value="terca">Terça-feira</option>
            <option value="quarta">Quarta-feira</option>
            <option value="quinta">Quinta-feira</option>
            <option value="sexta">Sexta-feira</option>
            <option value="sabado">Sábado</option>
            <option value="domingo">Domingo</option>
          </select>
        </div>
        <div className="input-group">
          <label htmlFor="turno">Turno:</label>
          <select
            id="turno"
            value={turno}
            onChange={(e) => setTurno(e.target.value)}
          >
            <option value="manha">Manhã</option>
            <option value="tarde">Tarde</option>
            <option value="noite">Noite</option>
          </select>
        </div>
        <button type="submit">Enviar</button>
        {mensagem && (
          <div className={`message ${tipoMensagem}`}>{mensagem}</div>
        )}
      </form>
    </div>
  );
}

export default FormularioFolga;
