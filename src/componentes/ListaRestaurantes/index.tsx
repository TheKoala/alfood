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
    carregaDados('http://localhost:8000/api/v1/restaurantes/');
  }, []);

  function carregaDados(url: string) {
    axios.get<IPaginacao<IRestaurante>>(url)
      .then(resposta => {
        setRestaurantes(resposta.data.results);
        setProximaPagina(resposta.data.next);
        setPaginaAnterior(resposta.data.previous);
      })
      .catch(erro => {
        console.log(erro);
      })
  }

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

  return (
    <section className={style.ListaRestaurantes}>

      <h1>Os restaurantes mais <em>bacanas</em>!</h1>
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