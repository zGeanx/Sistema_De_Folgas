import React, { useState } from "react";

function FormularioFolga({ apiClient, onFolgaSolicitada }) {
  const [diaSemana, setDiaSemana] = useState("segunda");
  const [turno, setTurno] = useState("manha");
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");

    try {
      await apiClient.post("/solicitacoes/", {
        dia_semana: diaSemana,
        turno: turno,
      });
      setMensagem("Sua solicitação de folga foi enviada com sucesso!");

      if (onFolgaSolicitada) {
        onFolgaSolicitada();
      }
    } catch (error) {
      setMensagem(
        "Ocorreu um erro ao enviar sua solicitação. Tente novamente."
      );
      console.error("Erro ao solicitar folga:", error);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        margin: "20px auto",
        maxWidth: "500px",
      }}
    >
      <h3>Solicitar Folga</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Dia da Semana:</label>
          <select
            value={diaSemana}
            onChange={(e) => setDiaSemana(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
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
        <div style={{ marginBottom: "15px" }}>
          <label>Turno:</label>
          <select
            value={turno}
            onChange={(e) => setTurno(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="manha">Manhã</option>
            <option value="tarde">Tarde</option>
            <option value="noite">Noite</option>
          </select>
        </div>
        <button type="submit" style={{ padding: "10px 20px" }}>
          Enviar Solicitação
        </button>
      </form>
      {mensagem && (
        <p
          style={{
            marginTop: "15px",
            color: mensagem.includes("sucesso") ? "green" : "red",
          }}
        >
          {mensagem}
        </p>
      )}
    </div>
  );
}

export default FormularioFolga;
