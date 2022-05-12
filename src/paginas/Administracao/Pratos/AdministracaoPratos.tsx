import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import http from "../../../http";
import IPrato from "../../../interfaces/IPrato";

export default function AdministracaoPratos() {

    const [pratos, setPratos] = useState<IPrato[]>([]);

    useEffect(() => {
        http.get<IPrato[]>('pratos/')
            .then(resposta => {
                setPratos(resposta.data);
            })
            .catch(erro => {
                console.log(erro);
            })
    }, []);

    function excluir(pratoExcluido: IPrato) {
        http.delete(`pratos/${pratoExcluido.id}/`)
            .then(() => {
                alert('Prato excluído com sucesso!')
                setPratos(pratos.filter(p => p.id !== pratoExcluido.id))
            })
            .catch(erro => {
                console.log(erro);
            })
    }

    return (
        <TableContainer component={Paper} >
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Prato </TableCell>
                        <TableCell>Tag </TableCell>
                        <TableCell>Imagem </TableCell>
                        <TableCell>Editar</TableCell>
                        <TableCell>Remover</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        pratos.map(prato =>
                            <TableRow key={prato.id} >
                                <TableCell>{prato.nome} </TableCell>
                                <TableCell>{prato.tag} </TableCell>
                                <TableCell>
                                    [<a rel="noreferrer" href={prato.imagem} target='_blank'>ver imagem</a>]
                                </TableCell>
                                <TableCell>
                                    [<Link to={`/admin/pratos/${prato.id}`} > editar </Link> ]
                                </TableCell>
                                <TableCell>
                                    <Button variant="outlined" color="error"
                                        onClick={() => excluir(prato)
                                        }
                                    >
                                        Excluir
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}