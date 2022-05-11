import { Button, TextField } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { IPaginacao } from '../../interfaces/IPaginacao';
import IRestaurante from '../../interfaces/IRestaurante';
import style from './ListaRestaurantes.module.scss';
import Restaurante from './Restaurante';

const ListaRestaurantes = () => {

  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);
  const [proximaPagina, setProximaPagina] = useState('');
  const [paginaAnterior, setPaginaAnterior] = useState('');
  const [busca, setBusca] = useState('');

  useEffect(() => {
    carregaDados('http://localhost:8000/api/v1/restaurantes/');
  }, []);


  function buscar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    carregaDados('http://localhost:8000/api/v1/restaurantes/', busca)
  }

  function carregaDados(url: string, busca?:string) {
    axios.get<IPaginacao<IRestaurante>>(
      url, 
      busca ? {params: { search: busca}} : {})
      .then(resposta => {
        setRestaurantes(resposta.data.results);
        setProximaPagina(resposta.data.next);
        setPaginaAnterior(resposta.data.previous);
      })
      .catch(erro => {
        console.log(erro);
      })
  }

  //  'function verMais() {
  //   axios.get<IPaginacao<IRestaurante>>(proximaPagina)
  //     .then(resposta => {
  //       setRestaurantes([...restaurantes, ...resposta.data.results]);
  //       setProximaPagina(resposta.data.next);
  //     })
  //     .catch(erro => {
  //       console.log(erro);
  //     })
  // }'

  return (
    <section className={style.ListaRestaurantes}>

      <h1>Os restaurantes mais <em>bacanas</em>!</h1>

      <form onSubmit={evento => buscar(evento)}>
        <TextField
          value={busca}
          onChange={evento => setBusca(evento.target.value)}
          label="Buscar Restaurante" variant="standard"
        />

        <Button type="submit" variant="outlined">Buscar</Button>
      </form>

      {restaurantes?.map(item => <Restaurante restaurante={item} key={item.id} />)}

      {paginaAnterior &&
        <Button onClick={() => carregaDados(paginaAnterior)} variant="outlined">Anterior</Button>
      }

      {proximaPagina &&
        <Button onClick={() => carregaDados(proximaPagina)} variant="outlined">Próxima</Button>
      }

    </section>)
}

export default ListaRestaurantes