/*
   rutas a acciones correspondientes a los
   métodos HTTP POST y GET según correspondan
   para las peticiones al servidor.
 
   En estas rutas se invocan a los controladores
   que son los encargados de procesar las
   peticiones.
*/
 
import express from "express";
import { mostrarFormulario, registrarUsuario, recuperarPassword } from "../controllers/formControllers.js";

const router = express.Router();


router.get("/", mostrarFormulario);
router.post("/registro", registrarUsuario);
router.post("/recuperar", recuperarPassword); // Ruta para recuperar contraseña

export default router;