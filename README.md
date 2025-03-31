
# OAuth MBCJ frontend

Librería para React.js para utilizar el OAuth del Ministerio de Bienestar Ciduadano y Justicia.

Tiene las rutas para enviar a iniciar sesión y para recibir el código una vez iniciada la sesión.

## Instalación

Instalar la librería con NPM

```bash
  npm install mbcj-oauth-ft
```


## Uso y ejemplo

```javascript
import {Login, OAuth} from 'mbcj-oauth-ft';

//Ruta del frontend donde se redirigirá a iniciar sesión
<Route path="/login">
  <Login 
    cargado={ENV_LOADED}        //Variable para avisar que los datos se encuentran cargados
    cliente_id={CLIENTE_ID}     //ID del cliente del OAuth
    url_redirect={URL_REDIRECT} //URL para recibir el código una vez iniciado
    url_oauth={URL_OAUTH}       //URL del OAuth
    scope={[{id:1,obligatorio:true},{id:2,obligatorio:false}]}  //Permisos a solicitar para iniciar
  />
</Route> 

//Ruta del frontend donde se recibirá el inicio de sesión (debe corresponder con la enviada en el inicio)
<Route path="/oauth"> 
  <OAuth 
    cargado={ENV_LOADED}    //Variable para avisar que los datos se encuentran cargados
    url_token={`${BASE_URL}/usuarios/oauth/token`}  //URL para obtener token del backend del cliente
    logeo={(token, usuario) => setDatosUsuario(token, usuario)}     //Funcion a ejecutiar al comprobar inicio
    url_datos_personales={`${BASE_URL}/usuarios/oauth/datos/1`}     //URL del cliente para obtener datos personales
    irLogin={() => navigate(`${BASENAME}/login`, {replace:true})}   //Función para redirigir al inicio de sesión
    irInicio={() => navigate(`${BASENAME}`, {replace:true})}        //Función para redirigir al inicio
  />
</Route>
```


## Variables de entorno

Para ejecutar el proyecto se necesitan las variables del .env 

`ENV_LOADED` boolean

`CLIENTE_ID` uuid (otorgado por oauth)

`URL_REDIRECT` string

`URL_OAUTH` string

`BASE_URL` string

`BASENAME` string

