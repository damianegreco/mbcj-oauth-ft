import { useEffect, useMemo } from 'react';

/**
 * Componente que gestiona la redirección a una página de inicio de sesión OAuth.
 * Muestra un mensaje al usuario y ejecuta una redirección automática después de un breve período.
 * @param {{
 * cargado: boolean,
 * clienteId: string,
 * urlRedirect: string,
 * urlOAuth: string,
 * scope: object[]
 * }} props - Propiedades del componente.
 * @param {boolean} props.cargado - Si es `true`, activa el temporizador para la redirección.
 * @param {string} props.clienteId - El ID de cliente para el servicio OAuth.
 * @param {string} props.urlRedirect - La URL a la que el servicio OAuth debe redirigir tras la autenticación.
 * @param {string} props.urlOAuth - La URL base del endpoint de autorización de OAuth.
 * @param {object[]} props.scope - Un array de objetos que define los permisos solicitados.
 * @returns {JSX.Element}
 */
export default function Login({ cargado, clienteId, urlRedirect, urlOAuth, scope }) {
  /**
   * URL completa y codificada para la autenticación OAuth.
   * Se memoriza con `useMemo` para evitar recálculos en cada renderizado.
   * @type {string}
   */
  const fullURL = useMemo(() => {
    // URLSearchParams maneja automáticamente la codificación correcta de cada parámetro.
    const params = new URLSearchParams({
      client_id: clienteId,
      redirect_url: urlRedirect,
      scope: JSON.stringify(scope),
    });
    return `${urlOAuth}?${params.toString()}`;
  }, [clienteId, urlRedirect, urlOAuth, scope]);

  useEffect(() => {
    if (!cargado) return;

    // Redirige al usuario en la misma pestaña para una mejor experiencia de usuario.
    const redirectTimer = setTimeout(() => {
      window.location.href = fullURL;
    }, 3000);

    // Limpia el temporizador si el componente se desmonta o `cargado` cambia.
    return () => clearTimeout(redirectTimer);
  }, [cargado, fullURL]);

  return (
    // MEJORA: Se reemplaza la dependencia de un CSS externo por estilos en línea,
    // lo cual es una mejor práctica para componentes de librería reutilizables.
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center', marginTop: '30px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h3>Redireccionando...</h3>
        <h4>Será redirigido automáticamente para iniciar sesión.</h4>
        <p>
          En caso de no ser redirigido, por favor&nbsp;
          <a href={fullURL}>haga clic aquí</a>.
        </p>
      </div>
    </div>
  );
}
