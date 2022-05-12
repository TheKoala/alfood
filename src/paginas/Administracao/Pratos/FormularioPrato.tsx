import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import http from "../../../http";
import IPrato from "../../../interfaces/IPrato";
import IRestaurante from "../../../interfaces/IRestaurante";
import ITag from "../../../interfaces/ITag";

export default function FormularioPrato() {

    const params = useParams();

    const [nomePrato, setNomePrato] = useState('')
    const [descricao, setDescricao] = useState('')
    const [tag, setTag] = useState('');
    const [restaurante, setRestaurante] = useState('');
    const [imagem, setImagem] = useState<File | null>(null)

    const [tags, setTags] = useState<ITag[]>([])
    const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);

    //const [prato, setPrato] = useState<IPrato>();

    function selecionarArquivo(evento: React.ChangeEvent<HTMLInputElement>) {
        if (evento.target.files?.length) {
            setImagem(evento.target.files[0])
        } else {
            setImagem(null)
        }
    }

    useEffect(() => {
        http.get<{ tags: ITag[] }>('tags/')
            .then(resposta => setTags(resposta.data.tags))

        http.get<IRestaurante[]>('restaurantes/')
            .then(resposta => setRestaurantes(resposta.data))

        if (params.id) {
            http.get<IPrato>(`pratos/${params.id}/ `)
                .then(resposta => {
                    setNomePrato(resposta.data.nome);
                    setDescricao(resposta.data.descricao);
                    setTag(resposta.data.tag);
                    setRestaurante(String(resposta.data.restaurante));
                })
        }
    }, [params])

    function submeterForm(evento: React.FormEvent<HTMLFormElement>) {
        evento.preventDefault();

        const formData = new FormData();

        formData.append('nome', nomePrato)
        formData.append('descricao', descricao)
        formData.append('tag', tag)
        formData.append('restaurante', restaurante)

        if (imagem) {
            formData.append('imagem', imagem)
        }

        if (params.id) {
            atualizarPrato(formData)
        }else {
            salvarPrato(formData)
        }

    }

    function salvarPrato(formData: FormData) {
        http.request({
            url: 'pratos/',
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: formData
        })
            .then(() => {
                setNomePrato('')
                setDescricao('')
                setTag('')
                setRestaurante('')
                alert('prato cadastrado com sucesso')
            })
            .catch(erro => console.log(erro))
    }

    function atualizarPrato(formData: FormData) {
        http.request({
            url: `pratos/${params.id}/`,
            method: 'PUT',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: formData
        })
            .then(() => {
                setNomePrato('')
                setDescricao('')
                setTag('')
                setRestaurante('')
                alert('prato atualizado com sucesso')
            })
            .catch(erro => console.log(erro))
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: "column", alignItems: "center", flexGrow: 1 }}>
            <Typography component="h1" variant="h6">Formulário de Pratos</Typography>
            <Box component="form" sx={{ width: "50%" }} onSubmit={submeterForm}>
                <TextField
                    value={nomePrato}
                    onChange={evento => setNomePrato(evento.target.value)}
                    fullWidth
                    required
                    margin="dense"
                    label="Novo Prato" variant="standard"
                />

                <TextField
                    value={descricao}
                    onChange={evento => setDescricao(evento.target.value)}
                    fullWidth
                    required
                    margin="dense"
                    label="Descrição" variant="standard"
                />

                <FormControl margin="dense" fullWidth>
                    <InputLabel id="tags-label">Tag</InputLabel>
                    <Select
                        labelId="tags-label"
                        value={tag}
                        label="Tag"
                        onChange={evento => setTag(evento.target.value)}
                    >
                        {tags.map(t => (
                            <MenuItem key={t.id} value={t.value}> {t.value} </MenuItem>
                        ))}

                    </Select>
                </FormControl>

                <FormControl margin="dense" fullWidth>
                    <InputLabel id="restarantes-label">Restaurante</InputLabel>
                    <Select
                        labelId="restaurantes-label"
                        value={restaurante}
                        label="Restaurante"
                        onChange={evento => setRestaurante(evento.target.value)}
                    >
                        {restaurantes.map(r => (
                            <MenuItem key={r.id} value={r.id}> {r.nome} </MenuItem>
                        ))}

                    </Select>
                </FormControl>

                {params.id &&
                    <p>Para atualizar a imagem, basta apenas selecionar o arquivo, caso não seja selecionado, manterá a mesma imagem</p>
                }

                <input type="file" onChange={evento => selecionarArquivo(evento)} />

                <Button sx={{ marginTop: 1 }}
                    type="submit" fullWidth variant="outlined">Salvar</Button>
            </Box>
        </Box>
    );
}