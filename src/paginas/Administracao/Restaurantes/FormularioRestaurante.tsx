import { Button, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import IRestaurante from "../../../interfaces/IRestaurante";

export default function FormularioRestaurante() {

    const params = useParams();
    const [nomeRestaurante, setNomeRestaurante] = useState('')

    useEffect(() => {
        if (params.id) {
            axios.get<IRestaurante>(`http://localhost:8000/api/v2/restaurantes/${params.id}/ `)
                .then(resposta => setNomeRestaurante(resposta.data.nome))
        }
    }, [params])

    function submeterForm(evento: React.FormEvent<HTMLFormElement>) {
        evento.preventDefault();

        if (params.id) {
            axios.put(`http://localhost:8000/api/v2/restaurantes/${params.id}/`, { nome: nomeRestaurante })
                .then(() => { alert("Restaurante autalizado com sucesso!") })
        } else {
            axios.post("http://localhost:8000/api/v2/restaurantes/", { nome: nomeRestaurante })
                .then(() => { alert("Restaurante Cadastrado com sucesso!") })
        }
    }

    return (
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