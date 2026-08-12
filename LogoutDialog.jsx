import { createPortal } from 'react-dom';
import { Boton } from 'mbcj-ui-styles';
import './styles.css';

/**
 * Diálogo de confirmación de cierre de sesión.
 *
 * Los sistemas del ministerio comparten la sesión del proveedor OAuth sobre un mismo
 * dominio, así que cerrar sesión admite dos alcances distintos y el usuario tiene que
 * poder elegir cuál quiere. Este componente sólo pregunta: quien ejecuta la salida es
 * el sistema, a través de `onConfirmar`.
 *
 * El alcance elegido se corresponde con el parámetro `todos` de `logout()` en
 * `mbcj-hooks`, de modo que el consumidor puede reenviarlo tal cual.
 *
 * @param {{
 *   abierto: boolean,
 *   onCerrar: function(): void,
 *   onConfirmar: function(boolean): void,
 *   titulo?: string,
 *   mensaje?: string
 * }} props
 * @param {boolean}  props.abierto     - Controla la visibilidad del diálogo.
 * @param {Function} props.onCerrar    - Se ejecuta al cancelar o al hacer clic fuera del diálogo.
 * @param {Function} props.onConfirmar - Recibe `true` si el usuario eligió salir de todos
 *                                       los sistemas, o `false` si eligió salir sólo del actual.
 * @param {string}   [props.titulo]    - Encabezado del diálogo.
 * @param {string}   [props.mensaje]   - Texto explicativo bajo el encabezado.
 * @returns {JSX.Element|null}
 *
 * @example
 * const [salida, setSalida] = useState(false);
 *
 * <LogoutDialog
 *   abierto={salida}
 *   onCerrar={() => setSalida(false)}
 *   onConfirmar={(todos) => {
 *     setSalida(false);
 *     logout({ todos });
 *   }}
 * />
 */
export default function LogoutDialog({
  abierto,
  onCerrar,
  onConfirmar,
  titulo = 'Cerrar sesión',
  mensaje = 'Su sesión es compartida con los demás sistemas del ministerio. ¿De dónde desea salir?'
}) {
  if (!abierto) return null;

  const dialogo = (
    <div className="LogoutDialogOverlay" onClick={onCerrar}>
      <div
        className="LogoutDialogCaja"
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="LogoutDialogTitulo">{titulo}</h3>
        <p className="LogoutDialogMensaje">{mensaje}</p>

        <div className="LogoutDialogOpciones">
          <Boton variante="azul" onClick={() => onConfirmar(false)}>
            Salir sólo de este sistema
          </Boton>
          <Boton variante="rojo" onClick={() => onConfirmar(true)}>
            Salir de todos los sistemas
          </Boton>
        </div>

        {/* <p className="LogoutDialogAclaracion">
          Si sale de todos, deberá volver a ingresar sus credenciales la próxima vez.
        </p> */}

        <div className="LogoutDialogCancelar">
          <Boton variante="negro" onClick={onCerrar}>
            Cancelar
          </Boton>
        </div>
      </div>
    </div>
  );

  // Se monta en el body para escapar de cualquier stacking context creado por
  // ancestros del sistema consumidor (headers sticky, contenedores con transform).
  if (typeof document === 'undefined') return dialogo;
  return createPortal(dialogo, document.body);
}
