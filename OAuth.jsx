import { useEffect, useState } from 'react';
import { useSearch } from 'wouter'
import axios from 'axios';
import './styles.css';

export default function OAuth ({logeo, cargado, url_token, url_datos_personales, irLogin, irInicio}){
  const [errorUsuario,setErrorUsuario] = useState(null);
  const searchString = useSearch();
  
  const obtenerParams = () => {
    let params = searchString.split('&');
    let newParams = {};
    for (let i = 0; i < params.length; i++) {
      const param = params[i].split('=');
      newParams[param[0]] = param[1];
    }
    return newParams;
  }

  const obtenerToken = (codigo) => {
    return new Promise((resolve, reject) => {
      axios.post(url_token, {codigo})
      .then((resp) => {
        if (resp.data.status === "ok") return resolve(resp.data.token);
        reject(resp.data.error);
      })
      .catch((error) => reject(error));
    })
  }

  const obtenerDatosPersonales = (token) => {
    return new Promise((resolve, reject) => {
      const config = { headers: {authorization: token} }
      axios.get(url_datos_personales, config)
      .then((resp) => {
        if (resp.data.status === "ok") return resolve(resp.data);
        reject(resp.data.error);
      })
      .catch((error) => reject(error));
    })
  }

  useEffect(() => {
    if (!cargado) return;
    const {codigo} = obtenerParams();

    if (!codigo){
      return alert("Sin código de acceso");
    }

    obtenerToken(codigo)
    .then((token) => {
      obtenerDatosPersonales(token)
      .then((usuario) => logeo(token, usuario))
      .catch((error) => {
        console.error(error);
        if (typeof error.response.data === 'object') {
          return alert("Ocurrió un error");
        }
        setErrorUsuario(error.response.data);
      })
    })
    .catch((error) => {
      console.error(error);
      if (error.response.status === 403){
        alert("Código vencido, inicie sesión nuevamente")
        irLogin();
      } else {
        alert("Ocurrió un error");
        irInicio();
      }
    })
  }, [cargado])

  return(
    <div className='Login LoginContainer'>
      {errorUsuario === null ? 
        <h3>Verificando inicio de sesión</h3>
      :
        <>
          <h2 style={{marginBottom:20, padding:0}}>{errorUsuario}</h2>
          <h3 style={{marginBottom:20, padding:0}}>Por favor, contactese con el administrador para habilitar su usuario</h3>
          <a href='#' onClick={irInicio}>
            <span style={{fontWeight:'bold', fontSize:20}}>Volver al inicio</span>
          </a>
        </>
      }
    </div>
  )
}