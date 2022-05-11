import { Button, TextField } from "@mui/material";
import axios from "axios";
import { useState } from "react";

export default function FormularioRestaurante() {

    const [nomeRestaurante, setNomeRestaurante] = useState('')

    function submeterForm(evento: React.FormEvent<HTMLFormElement>) {
        evento.preventDefault();
        axios.post("http://localhost:8000/api/v2/restaurantes/", {nome: nomeRestaurante})
            .then(() => {alert("Restaurante Cadastrado com sucesso")})
    }

    return(
        <form onSubmit={evento => submeterForm(evento)}>
            <TextField 
                value={nomeRestaurante} 
                onChange={evento => setNomeRestaurante(evento.target.value)}
                id="standard-basic" label="Novo Restaurante" variant="standard" 
            />
            <Button type="submit" variant="outlined">Salvar</Button>
        </form>
    );
}