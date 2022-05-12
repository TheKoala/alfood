import { Box, Button, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import http from "../../../http";
import IRestaurante from "../../../interfaces/IRestaurante";

export default function FormularioRestaurante() {

    const params = useParams();
    const [nomeRestaurante, setNomeRestaurante] = useState('')

    useEffect(() => {
        if (params.id) {
            http.get<IRestaurante>(`restaurantes/${params.id}/ `)
                .then(resposta => setNomeRestaurante(resposta.data.nome))
        }
    }, [params])

    function submeterForm(evento: React.FormEvent<HTMLFormElement>) {
        evento.preventDefault();

        if (params.id) {
            http.put(`restaurantes/${params.id}/`, { nome: nomeRestaurante })
                .then(() => { alert("Restaurante autalizado com sucesso!") })
        } else {
            http.post("restaurantes/", { nome: nomeRestaurante })
                .then(() => { alert("Restaurante Cadastrado com sucesso!") })
        }
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: "column", alignItems: "center", flexGrow: 1 }}>
            <Typography component="h1" variant="h6">Formulário de Restaurantes</Typography>
            <Box component="form" sx={{ width: "50%" }} onSubmit={submeterForm}>
                <TextField
                    value={nomeRestaurante}
                    onChange={evento => setNomeRestaurante(evento.target.value)}
                    fullWidth
                    required
                    label="Novo Restaurante" variant="standard"
                />
                <Button sx={{ marginTop: 1 }}
                    type="submit" fullWidth variant="outlined">Salvar</Button>
            </Box>
        </Box>
    );
}