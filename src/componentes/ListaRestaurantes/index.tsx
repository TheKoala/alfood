import { Button, TextField } from '@mui/material';
import axios, { AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';
import { IPaginacao } from '../../interfaces/IPaginacao';
import IRestaurante from '../../interfaces/IRestaurante';
import style from './ListaRestaurantes.module.scss';
import Restaurante from './Restaurante';

interface IParametrosBusca {
  ordering?: string
  search?: string
}

const ListaRestaurantes = () => {

  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);
  const [proximaPagina, setProximaPagina] = useState('');
  const [paginaAnterior, setPaginaAnterior] = useState('');
  const [busca, setBusca] = useState('')
  
  useEffect(() => {
    carregaDados('http://localhost:8000/api/v1/restaurantes/');
  }, []);

  function carregaDados(url: string, opcoes?: AxiosRequestConfig) {
    axios.get<IPaginacao<IRestaurante>>(url, opcoes)
      .then(resposta => {
        setRestaurantes(resposta.data.results);
        setProximaPagina(resposta.data.next);
        setPaginaAnterior(resposta.data.previous);
      })
      .catch(erro => {
        console.log(erro);
      })
  }
  
  function buscar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const opcoes = {
      params: { } as IParametrosBusca
    }
    if(busca) {
      opcoes.params.search = busca;
    }
    carregaDados('http://localhost:8000/api/v1/restaurantes/', opcoes)
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