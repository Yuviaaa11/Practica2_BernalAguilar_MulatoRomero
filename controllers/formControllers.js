/**
 * Encargado de procesar las peticiones
 * Responsabilidades:
 *   1. Recibir datos del formulario.
 *   2. Procesos de validación adicionales.
 *   3. Llamar a servicios para procesar datos, si es el caso.
 *   4. Devolver respuesta al cliente.
 */
import path from "path";
import { fileURLToPath } from "url";
import { procesarFormulario } from "../services/services.js";
import { procesarRecuperacion } from "../services/services.js";
 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
 
export const mostrarFormulario = async (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/InForm.html"));
};

// async - await
export const registrarUsuario = async (req, res) => {
    try {
        const resultado = await procesarFormulario(req.body);
        res.status(200).json({
            ok: true,
            mensaje: `¡Bienvenido al sistema, ${resultado.usuario}!`,
            data: resultado
        });

    } catch (error) {
        res.status(400).json({
            ok: false,
            mensaje: error.message 
        });
    }

    
};

export const recuperarPassword = async (req, res) => {
    try {
        const resultado = await procesarRecuperacion(req.body);
        res.status(200).json({
            ok: true,
            mensaje: resultado.mensaje,
            detalles: resultado.instrucciones
        });
    } catch (error) {
        res.status(400).json({
            ok: false,
            mensaje: error.message
        });
    }
};
