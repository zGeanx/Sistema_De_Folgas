import React, { useState } from "react";

import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Stack,
  Alert,
} from "@mui/material";

function FormularioFolga({ apiClient, onFolgaSolicitada }) {
  const [nome, setNome] = useState("");
  const [diaSemana, setDiaSemana] = useState("segunda");
  const [turno, setTurno] = useState("manha");
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("success");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");

    try {
      await apiClient.post("/solicitacoes/", {
        cartomante_nome: nome,
        dia_semana: diaSemana,
        turno: turno,
      });
      setMensagem("Sua solicitação de folga foi enviada com sucesso!");
      setTipoMensagem("success");
      setNome("");

      if (onFolgaSolicitada) {
        onFolgaSolicitada();
      }
    } catch (error) {
      setMensagem("Ocorreu um erro ao enviar sua solicitação.");
      setTipoMensagem("error");
      console.error("Erro ao solicitar folga:", error);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        padding: "24px",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        margin: "20px auto",
        maxWidth: "500px",
        backgroundColor: "white",
      }}
    >
      <Stack spacing={2}>
        {" "}
        {}
        <Typography
          variant="h5"
          component="h2"
          sx={{ textAlign: "center", mb: 2 }}
        >
          Solicitar Folga
        </Typography>
        {}
        <TextField
          label="Seu Nome Místico"
          variant="outlined"
          fullWidth
          required
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        {}
        <FormControl fullWidth variant="outlined">
          <InputLabel id="dia-semana-label">Dia da Semana</InputLabel>
          <Select
            labelId="dia-semana-label"
            value={diaSemana}
            onChange={(e) => setDiaSemana(e.target.value)}
            label="Dia da Semana"
          >
            <MenuItem value="segunda">Segunda-feira</MenuItem>
            <MenuItem value="terca">Terça-feira</MenuItem>
            <MenuItem value="quarta">Quarta-feira</MenuItem>
            <MenuItem value="quinta">Quinta-feira</MenuItem>
            <MenuItem value="sexta">Sexta-feira</MenuItem>
            <MenuItem value="sabado">Sábado</MenuItem>
            <MenuItem value="domingo">Domingo</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth variant="outlined">
          <InputLabel id="turno-label">Turno</InputLabel>
          <Select
            labelId="turno-label"
            value={turno}
            onChange={(e) => setTurno(e.target.value)}
            label="Turno"
          >
            <MenuItem value="manha">Manhã</MenuItem>
            <MenuItem value="tarde">Tarde</MenuItem>
            <MenuItem value="noite">Noite</MenuItem>
          </Select>
        </FormControl>
        {}
        <Button type="submit" variant="contained" size="large" fullWidth>
          Enviar Solicitação
        </Button>
        {}
        {mensagem && (
          <Alert severity={tipoMensagem} sx={{ mt: 2 }}>
            {mensagem}
          </Alert>
        )}
      </Stack>
    </Box>
  );
}

export default FormularioFolga;
