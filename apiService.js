import axios from 'axios';

/**
 * Intercambia un código de autorización por un token de acceso.
 * @param {string} urlBase - URL base de la API.
 * @param {string} codigo - El código de autorización.
 * @returns {Promise<string>} Promesa que resuelve con el token de acceso.
 */
export const obtenerToken = async (urlBase, codigo) => {
  try {
    const response = await axios.post(`${urlBase}/token`, { codigo });
    if (response.data.status === "ok") {
      return response.data.token;
    }
    // Si el status no es "ok", se construye un error a partir de la respuesta.
    throw new Error(response.data.error || 'Error al obtener el token.');
  } catch (error) {
    // Relanza el error original de Axios para conservar toda la información (status, data, etc.).
    throw error;
  }
};

/**
 * Obtiene los datos personales del usuario desde la API.
 * @param {string} urlBase - URL base de la API.
 * @param {string} token - El token de acceso.
 * @returns {Promise<object>} Promesa que resuelve con los datos del usuario.
 */
export const obtenerDatosPersonales = async (urlBase, token) => {
  try {
    const config = { headers: { authorization: token } };
    const response = await axios.get(`${urlBase}/datos/1`, config);
    if (response.data.status === "ok") {
      return response.data;
    }
    throw new Error(response.data.error || 'Error al obtener los datos del usuario.');
  } catch (error) {
    // Relanza el error original de Axios.
    throw error;
  }
};

/**
 * Obtiene un nuevo token de acceso a partir de uno existente.
 * @param {string} urlBase - URL base de la API.
 * @param {string} token - El token de acceso actual.
 * @returns {Promise<string>} Promesa que resuelve con el nuevo token.
 */
export const obtenerNuevoToken = async (urlBase, token) => {
  try {
    const config = { headers: { authorization: token } };
    const response = await axios.get(`${urlBase}/nuevo-token`, config);
    if (response.data.status === "ok") {
      return response.data.nuevoToken;
    }
    throw new Error(response.data.error || 'Error al renovar el token.');
  } catch (error) {
    // Relanza el error original de Axios.
    throw error;
  }
};