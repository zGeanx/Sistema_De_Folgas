import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { folgasService } from '../../services/folgas.service';
import { DIAS_ARRAY, TURNOS_ARRAY, DIAS_SEMANA } from '../../utils/constants';
import { capitalize } from '../../utils/formatters';
import styles from './TabelaEscala.module.css';

export function TabelaEscala() {
    const [folgasAprovadas, setFolgasAprovadas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        carregarFolgas();
    }, []);

    const carregarFolgas = async () => {
        try {
            setLoading(true);
            const data = await folgasService.getFolgasAprovadas();
            setFolgasAprovadas(Array.isArray(data) ? data : []);
        } catch (error) {
            setError('Erro ao carregar escala');
            toast.error('Erro ao buscar dados da escala!');
            console.error(error);
            setFolgasAprovadas([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className={styles.loading}>Carregando escala...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    const cartomantes = [...new Set(folgasAprovadas.map((f) => f.cartomante_nome))];

    if (cartomantes.length === 0) {
        return (
            <div className={styles.empty}>
                Nenhuma folga aprovada para exibir na escala.
            </div>
        );
    }

    const escalaMap = new Map();
    folgasAprovadas.forEach((folga) => {
        const key = `${folga.cartomante_nome}-${folga.dia_semana}-${folga.turno}`;
        escalaMap.set(key, 'FOLGA');
    });

    return (
        <div className={styles.wrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Cartomante / Turno</th>
                        {DIAS_ARRAY.map((dia) => (
                            <th key={dia}>{capitalize(DIAS_SEMANA[dia])}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {cartomantes.map((cartomante) =>
                        TURNOS_ARRAY.map((turno) => (
                            <tr key={`${cartomante}-${turno}`}>
                                <td className={styles.headerCell}>
                                    <strong>{cartomante}</strong> - {capitalize(turno)}
                                </td>
                                {DIAS_ARRAY.map((dia) => {
                                    const key = `${cartomante}-${dia}-${turno}`;
                                    const temFolga = escalaMap.has(key);
                                    return (
                                        <td
                                            key={key}
                                            className={temFolga ? styles.folga : styles.trabalho}
                                        >
                                            {temFolga ? 'FOLGA' : 'Trabalhando'}
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

export default TabelaEscala;
