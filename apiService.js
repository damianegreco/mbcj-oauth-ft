import axios from 'axios';

/**
 * Intercambia un código de autorización por un token de acceso.
 * @param {string} urlBase - URL base de la API.
 * @param {string} codigo - El código de autorización.
 * @returns {Promise<string>} Promesa que resuelve con el token de acceso.
 */
export const obtenerToken = async (urlBase, codigo) => {
  const response = await axios.post(`${urlBase}/token`, { codigo });
  if (response.data.status === "ok") {
    return response.data.token;
  }
  // Lanza un error que será capturado por el bloque catch en el componente.
  throw new Error(response.data.error || 'Error al obtener el token.');
};

/**
 * Obtiene los datos personales del usuario desde la API.
 * @param {string} urlBase - URL base de la API.
 * @param {string} token - El token de acceso.
 * @returns {Promise<object>} Promesa que resuelve con los datos del usuario.
 */
export const obtenerDatosPersonales = async (urlBase, token) => {
  const config = { headers: { authorization: token } };
  const response = await axios.get(`${urlBase}/datos/1`, config);
  if (response.data.status === "ok") {
    return response.data;
  }
  throw new Error(response.data.error || 'Error al obtener los datos del usuario.');
};

/**
 * Obtiene un nuevo token de acceso a partir de uno existente.
 * @param {string} urlBase - URL base de la API.
 * @param {string} token - El token de acceso actual.
 * @returns {Promise<string>} Promesa que resuelve con el nuevo token.
 */
export const obtenerNuevoToken = async (urlBase, token) => {
  const config = { headers: { authorization: token } };
  const response = await axios.get(`${urlBase}/nuevo-token`, config);
  if (response.data.status === "ok") {
    return response.data.nuevoToken;
  }
  throw new Error(response.data.error || 'Error al renovar el token.');
};
