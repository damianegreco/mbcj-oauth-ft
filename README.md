# OAuth MBCJ Frontend

`mbcj-oauth-ft` es una librería para React.js diseñada para simplificar la integración con el servicio de autenticación OAuth del Ministerio de Bienestar Ciudadano y Justicia. Proporciona componentes para gestionar el flujo completo de inicio de sesión, desde la redirección del usuario hasta la obtención de tokens y datos del usuario.

## Características

- **Componente `<Login />`**: Redirige de forma segura al usuario a la página de inicio de sesión del proveedor de OAuth.
- **Componente `<OAuth />`**: Gestiona el callback del proveedor de OAuth, intercambia el código de autorización por un token de acceso y obtiene los datos del usuario.
- **Flujo Simplificado**: Abstrae la complejidad del flujo de OAuth 2.0, permitiendo una integración rápida.
- **Manejo de Tokens**: Incluye funciones para obtener y renovar tokens de acceso.
- **Configurable**: Permite una fácil configuración a través de props y variables de entorno.

## Estructura del Proyecto

El proyecto está compuesto por los siguientes archivos principales:

-   `Login.jsx`: Componente de React encargado de construir la URL de autorización y redirigir al usuario al servicio de OAuth.
-   `OAuth.jsx`: Componente que maneja la respuesta del servicio de OAuth, procesa el código de autorización y gestiona la obtención de tokens y datos del usuario.
-   `apiService.js`: Módulo que contiene la lógica para comunicarse con la API del servicio de OAuth (obtener token, renovar token, obtener datos personales).
-   `index.js`: Punto de entrada de la librería que exporta los componentes principales para su uso en otras aplicaciones.

## Tecnologías y Dependencias

Este proyecto utiliza las siguientes tecnologías y librerías:

-   **React.js**: Biblioteca principal para la construcción de la interfaz de usuario.
-   **axios**: Cliente HTTP para realizar las solicitudes a la API de OAuth.
-   **wouter**: Un enrutador minimalista para aplicaciones de React.

## Instalación

Para instalar la librería en tu proyecto, ejecuta el siguiente comando en tu terminal:

```bash
npm install mbcj-oauth-ft
```

## Uso

A continuación, se muestra un ejemplo de cómo integrar los componentes en una aplicación de React utilizando un enrutador como `react-router-dom` o `wouter`.

### Ejemplo de Implementación

```javascript
import React from 'react';
import { Route, useNavigate } from 'react-router-dom'; // o el enrutador de tu elección
import { Login, OAuth } from 'mbcj-oauth-ft';

function App() {
  // Hook para la navegación
  const navigate = useNavigate();

  // Estado para verificar si las variables de entorno están cargadas
  const ENV_LOADED = true; // Reemplazar con la lógica de carga de tu app

  // Variables de entorno (reemplazar con tus valores)
  const CLIENTE_ID = 'tu-client-id';
  const URL_REDIRECT = 'http://localhost:3000/oauth';
  const URL_OAUTH = 'https://url-del-proveedor-oauth.com/auth';
  const BASE_URL = 'https://api-de-tu-backend.com';
  const BASENAME = ''; // El base path de tu aplicación si es necesario

  // Función para manejar los datos del usuario una vez autenticado
  const setDatosUsuario = (token, usuario) => {
    console.log('Token de acceso:', token);
    console.log('Datos del usuario:', usuario);
    // Aquí puedes guardar el token y los datos en el estado global o en el local storage
  };

  // Permisos que la aplicación solicitará
  const scope = [
    { id: 1, obligatorio: true },
    { id: 2, obligatorio: false }
  ];

  return (
    <>
      {/* Ruta para iniciar el proceso de login */}
      <Route path="/login">
        <Login
          cargado={ENV_LOADED}
          cliente_id={CLIENTE_ID}
          url_redirect={URL_REDIRECT}
          url_oauth={URL_OAUTH}
          scope={scope}
        />
      </Route>

      {/* Ruta de callback donde se recibe la respuesta del servidor OAuth */}
      <Route path="/oauth">
        <OAuth
          cargado={ENV_LOADED}
          logeo={setDatosUsuario}
          url_base={`${BASE_URL}/usuarios/oauth`}
          irLogin={() => navigate(`${BASENAME}/login`, { replace: true })}
          irInicio={() => navigate(`${BASENAME}/`, { replace: true })}
          onError={(mensaje) => console.error(mensaje)} // Opcional: para manejar errores
        />
      </Route>
    </>
  );
}

export default App;
```

### Props de los Componentes

#### `<Login />`

| Prop | Tipo | Obligatorio | Descripción |
| :--- | :--- | :--- | :--- |
| `cargado` | `boolean` | Sí | Indica si las variables de entorno están listas para iniciar el proceso. |
| `clienteId` | `string` | Sí | El ID de cliente proporcionado por el servicio de OAuth. |
| `urlRedirect` | `string` | Sí | La URL de callback a la que se redirigirá tras la autenticación. |
| `urlOAuth` | `string` | Sí | La URL del endpoint de autorización del servicio de OAuth. |
| `scope` | `object[]`| Sí | Un array de objetos que define los permisos solicitados. |

#### `<OAuth />`

| Prop | Tipo | Obligatorio | Descripción |
| :--- | :--- | :--- | :--- |
| `cargado` | `boolean` | Sí | Indica si las variables de entorno están listas para procesar el callback. |
| `logeo` | `function` | Sí | Función que se ejecuta al obtener el token y los datos del usuario. |
| `urlBase` | `string` | Sí | URL base del backend para intercambiar el código por un token. |
| `irLogin` | `function` | Sí | Función para redirigir al usuario a la página de login en caso de error. |
| `irInicio` | `function` | Sí | Función para redirigir al usuario a la página de inicio tras el éxito. |
| `onError` | `function` | No | Función para gestionar y mostrar mensajes de error durante el proceso. |

### Variables de Entorno

Para que el proyecto funcione correctamente, es necesario configurar las siguientes variables en un archivo `.env` en la raíz de tu aplicación:

-   `ENV_LOADED`: (boolean) Un flag para asegurar que las variables de entorno se han cargado.
-   `CLIENTE_ID`: (uuid) El ID de cliente otorgado por el proveedor de OAuth.
-   `URL_REDIRECT`: (string) La URL de callback configurada en tu aplicación cliente de OAuth.
-   `URL_OAUTH`: (string) La URL del servidor de OAuth.
-   `BASE_URL`: (string) La URL base de tu servidor backend.
-   `BASENAME`: (string) El nombre base de la ruta de tu aplicación (ej: `/mi-app`).

## Contacto

Desarrollado por **damian greco**.