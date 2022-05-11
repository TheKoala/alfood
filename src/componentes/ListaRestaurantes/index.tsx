import { Button } from '@mui/material';
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

  useEffect(() => {
    axios.get<IPaginacao<IRestaurante>>('http://localhost:8000/api/v1/restaurantes/')
      .then(resposta => {
        setRestaurantes(resposta.data.results);
        setProximaPagina(resposta.data.next);
        setPaginaAnterior(resposta.data.previous);
      })
      .catch(erro => {
        console.log(erro);
      })
  }, []);

  function verMais() {
    axios.get<IPaginacao<IRestaurante>>(proximaPagina)
      .then(resposta => {
        setRestaurantes([...restaurantes, ...resposta.data.results]);
        setProximaPagina(resposta.data.next);
      })
      .catch(erro => {
        console.log(erro);
      })
  }

  function mudarPagina(direcao: boolean) {
    axios.get<IPaginacao<IRestaurante>>(direcao ? proximaPagina : paginaAnterior)
      .then(resposta => {
        setRestaurantes(resposta.data.results);
        setProximaPagina(resposta.data.next);
        setPaginaAnterior(resposta.data.previous);
      })
      .catch(erro => {
        console.log(erro);
      })
  }

  return (
    <section className={style.ListaRestaurantes}>
      
      <h1>Os restaurantes mais <em>bacanas</em>!</h1>
      {restaurantes?.map(item => <Restaurante restaurante={item} key={item.id} />)}
      
      {paginaAnterior &&
        <Button onClick={() => mudarPagina(false)} variant="outlined">Anterior</Button>
      }
      
      {proximaPagina &&
        <Button  onClick={() => mudarPagina(true)} variant="outlined">Próxima</Button>
      }


    </section>)
}

export default ListaRestaurantes