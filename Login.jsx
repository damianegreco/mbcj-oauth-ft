import { useEffect } from 'react';
import './styles.css';
/* 
  ESTRUCTURA DE URL PARA OAUTH
    - url 
    - client_id 
    - redirect_url
    - scope 
      - array {"id": INT,"obligatorio": BOOL}
*/

export default function Login({cargado, cliente_id, url_redirect, url_oauth, scope}){

  const getFullURL = () => {
    let url = `${url_oauth}?client_id=${cliente_id}&redirect_url=${url_redirect}&scope=${JSON.stringify(scope)}`;
    url = encodeURI(url);
    return url;
  }

  useEffect(() => {
    if (!cargado) return;
    const newTimer = setTimeout(() => { window.open(getFullURL()) }, 3000);
    return () => clearTimeout(newTimer);
  }, [cargado])

  return(
    <div className='Login LoginContainer'>
      <div style={{display:'flex', flexDirection:'column', justifyContent:'center',alignItems:'center'}}>
        <h3>Redireccionamiento</h3>
        <h4>Será redirigido automaticamente para iniciar sesión</h4>
        <p>
          En caso de no ser redirigido, &nbsp;
          <a href={getFullURL()}>INGRESE AQUÍ</a>
        </p>
      </div>
    </div>
  )
}