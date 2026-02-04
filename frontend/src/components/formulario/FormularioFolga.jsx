import React, { useState } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { useFolgas } from '../../hooks/useFolgas';
import { DIAS_SEMANA, TURNOS } from '../../utils/constants';
import styles from './FormularioFolga.module.css';

Modal.setAppElement('#root');

export function FormularioFolga() {
    const { solicitarFolga } = useFolgas();

    const [nome, setNome] = useState('');
    const [diaSemana, setDiaSemana] = useState('segunda');
    const [turno, setTurno] = useState('manha');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!nome.trim()) {
            toast.warn('Por favor, preencha o seu nome místico.');
            return;
        }

        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleConfirmSubmit = async () => {
        setIsSubmitting(true);

        try {
            await solicitarFolga({
                cartomante_nome: nome,
                dia_semana: diaSemana,
                turno: turno,
            });

            setNome('');
            setIsModalOpen(false);

            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            setIsModalOpen(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className={styles.container}>
                <h2>Solicitar Folga</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="nome">Nome Místico:</label>
                        <input
                            type="text"
                            id="nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                            placeholder="Digite seu nome místico"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="dia">Dia da Semana:</label>
                        <select
                            id="dia"
                            value={diaSemana}
                            onChange={(e) => setDiaSemana(e.target.value)}
                        >
                            {Object.entries(DIAS_SEMANA).map(([key, value]) => (
                                <option key={key} value={key}>
                                    {value}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="turno">Turno:</label>
                        <select
                            id="turno"
                            value={turno}
                            onChange={(e) => setTurno(e.target.value)}
                        >
                            {Object.entries(TURNOS).map(([key, value]) => (
                                <option key={key} value={key}>
                                    {value}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className={styles.submitButton}>
                        Enviar Solicitação
                    </button>
                </form>
            </div>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={handleCloseModal}
                className={styles.modal}
                overlayClassName={styles.overlay}
                contentLabel="Confirmar Solicitação de Folga"
            >
                <h3>Confirmar Solicitação</h3>
                <p>
                    Deseja enviar uma solicitação de folga para{' '}
                    <strong>{DIAS_SEMANA[diaSemana]}</strong> no turno da{' '}
                    <strong>{TURNOS[turno]}</strong>?
                </p>
                <div className={styles.modalButtons}>
                    <button
                        onClick={handleCloseModal}
                        className={styles.buttonCancel}
                        disabled={isSubmitting}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleConfirmSubmit}
                        className={styles.buttonConfirm}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Enviando...' : 'Confirmar'}
                    </button>
                </div>
            </Modal>
        </>
    );
}

export default FormularioFolga;
