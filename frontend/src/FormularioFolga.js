import React, { useState } from "react";
import "./FormularioFolga.css";
import { toast } from "react-toastify";
import Modal from "react-modal";

const displayNames = {
  dias: {
    segunda: "Segunda-feira",
    terca: "Terça-feira",
    quarta: "Quarta-feira",
    quinta: "Quinta-feira",
    sexta: "Sexta-feira",
    sabado: "Sábado",
    domingo: "Domingo",
  },
  turnos: {
    manha: "Manhã",
    tarde: "Tarde",
    noite: "Noite",
  },
};

function FormularioFolga({ apiClient, onFolgaSolicitada }) {
  const [nome, setNome] = useState("");
  const [diaSemana, setDiaSemana] = useState("segunda");
  const [turno, setTurno] = useState("manha");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nome) {
      toast.warn("Por favor, preencha o seu nome místico.");
      return;
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmSubmit = async () => {
    try {
      await apiClient.post("/solicitacoes/", {
        cartomante_nome: nome,
        dia_semana: diaSemana,
        turno: turno,
      });

      toast.success("Solicitação de folga enviada com sucesso!");
      setNome(""); // Limpa o formulário após o sucesso

      if (onFolgaSolicitada) {
        onFolgaSolicitada();
      }
    } catch (error) {
      toast.error("Ocorreu um erro ao enviar a solicitação.");
      console.error("Erro ao solicitar folga:", error);
    }
    handleCloseModal();
  };

  return (
    <>
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
        </form>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        className="Modal"
        overlayClassName="Overlay"
        contentLabel="Confirmar Solicitação de Folga"
      >
        <h3>Confirmar Solicitação</h3>
        <p>
          Deseja enviar uma solicitação de folga para
          <strong> {displayNames.dias[diaSemana]}</strong> no turno da
          <strong> {displayNames.turnos[turno]}</strong>?
        </p>
        <div className="modal-buttons">
          <button onClick={handleCloseModal} className="button-cancel">
            Cancelar
          </button>
          <button onClick={handleConfirmSubmit} className="button-confirm">
            Confirmar
          </button>
        </div>
      </Modal>
    </>
  );
}

export default FormularioFolga;
