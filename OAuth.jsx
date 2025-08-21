import { useEffect, useState } from 'react';
import { useSearch } from 'wouter';
import { obtenerToken, obtenerNuevoToken, obtenerDatosPersonales } from './apiService';

/**
 * Componente que maneja el callback del flujo de autenticación OAuth.
 * @param {{
 * logeo: function(string, object): void,
 * cargado: boolean,
 * urlBase: string,
 * irLogin: function(): void,
 * onError: function(string): void
 * }} props - Propiedades del componente.
 * @returns {JSX.Element}
 */
export default function OAuth({ logeo, cargado, urlBase, irLogin, onError }) {
  const searchString = useSearch();
  // Se añade un estado para mostrar mensajes de carga dinámicos al usuario.
  const [mensaje, setMensaje] = useState('Iniciando verificación...');

  useEffect(() => {
    const procesarAutenticacion = async () => {
      if (!cargado) return; 
      const params = new URLSearchParams(searchString);
      const codigo = params.get('codigo');

      if (!codigo) {
        onError('No se recibió un código de autorización. Será redirigido.');
        setTimeout(irLogin, 3000);
        return;
      }

      try {
        // Se actualiza el mensaje en cada paso del proceso.
        setMensaje('Obteniendo token de acceso...');
        const tokenInicial = await obtenerToken(urlBase, codigo);

        setMensaje('Validando credenciales...');
        const nuevoToken = await obtenerNuevoToken(urlBase, tokenInicial);
        
        setMensaje('Cargando datos del usuario...');
        const usuario = await obtenerDatosPersonales(urlBase, nuevoToken);
        
        logeo(nuevoToken, usuario);
        return;
      } catch (error) {
        console.error('Error en el flujo de OAuth:', error);
        const errorResponse = error.response; 
        
        if (errorResponse?.status === 403) {
          onError('Su código de acceso ha expirado. Será redirigido para iniciar sesión.');
          setTimeout(irLogin, 4000);
        } else {
          const mensajeServidor = errorResponse?.data;
          const mensajeError = typeof mensajeServidor === 'string' 
            ? mensajeServidor 
            : (error.message || 'Ocurrió un error inesperado al verificar su identidad.');
          onError(mensajeError);
        }
      }
    };

    procesarAutenticacion();
  }, [cargado, searchString, urlBase]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center', marginTop: '30px' }}>
      {/* El h3 ahora muestra el mensaje de estado dinámico. */}
      <h3>{mensaje}</h3>
    </div>
  );
}
