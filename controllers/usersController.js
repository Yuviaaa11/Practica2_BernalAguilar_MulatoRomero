
/**
 * https://www.planttext.com/
 * 
 * Encargado de procesar las peticiones
 * Responsabilidades:
 *   1. Recibir datos del formulario.
 *   2. Procesos de validación adicionales.
 *   3. Llamar a servicios para procesar datos, si es el caso.
 *   4. Devolver respuesta al cliente. 
 */
import path from "path";
import { fileURLToPath } from "url";
import { processForm, validateUser } from "../services/usersService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const showFormLogin = async (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/formInicioS.html"));
};

export const showFormRegister = async (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/formRegistro.html"));
};

export const registerUser = async (req, res) => {
  const datos = req.body;

  try {
    // Llamamos al servicio
    const resultado = await processForm(datos);

    if (!resultado.success) {
      // Si hubo errores, respondemos 400 (Bad Request)
      return res.status(400).json({
         success: false,
         errors: resultado.errors
      });
    }

    console.log(res);

    // Si todo salió bien
    return res.status(200).json({
       success: true,
       errors: null,
       data: resultado.data
    });

  } catch (err) {
    // Captura de errores inesperados
    console.error('Error en registerUser ... ', err.message);
    return res.status(500).json({
       success: false,
       errors: { general: 'Error interno del servidor' }
    });
  }
};

export const loginUser = async (req, res) => {
  const { correo, contrasena } = req.body;
  try {
    // 1. Validación de BD 
    // Supongamos que 'resultado' trae los datos del usuario de la BD
    const resultado = await validateUser(correo, contrasena); 

    if (resultado.success) {
      // 2. GUARDAR EN SESIÓN
      req.session.usuarioLogueado = true;
      req.session.nombreUsuario = resultado.data.nombre; // Nombre que viene de la BD

      // 3. RENDERIZAR VISTA EJS
      // Pasamos el nombre guardado en la sesión a la vista
      return res.render('pages/bienvenida', { 
        nombre: req.session.nombreUsuario 
      });
    } else {
      return res.status(400).json({ success: false, errors: resultado.errors });
    }

  } catch (error) {
    console.error('Error en loginUser:', error.message);
    return res.status(500).json({ success: false, errors: { general: 'Error interno' } });
  }
};

export const showWelcome = (req, res) => {
    // path.resolve construye la ruta al archivo HTML
    const filePath = path.resolve('public', 'html', 'bienvenida.html');
    
    // Enviamos el archivo
    res.sendFile(filePath);
};

export const showRecovery = (req, res) => {

};