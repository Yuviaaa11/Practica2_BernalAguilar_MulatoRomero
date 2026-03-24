/*
   rutas a acciones correspondientes a los
   métodos HTTP POST y GET según correspondan
   para las peticiones al servidor.
 
   En estas rutas se invocan a los controladores
   que son los encargados de procesar las
   peticiones.
*/
 
import express from "express";
import { mostrarFormulario, mostrarFormularioRegistro, registrarUsuario } from "../controllers/formControllers.js";
 
const router = express.Router();
 
// http://localhost:3000/registro
router.get("/", mostrarFormulario);
router.get("/registro", mostrarFormularioRegistro);
router.post("/registro", registrarUsuario);

 
export default router;
 