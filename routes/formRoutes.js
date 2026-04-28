import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { 
    mostrarFormulario, mostrarFormularioRegistro, mostrarInicio,
    registrarUsuario, loginUsuario, recuperarPassword 
} from "../controllers/formControllers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

// GET
router.get("/", mostrarFormulario);
router.get("/registro", mostrarFormularioRegistro);
router.get("/inicio", mostrarInicio);
router.get("/recuperar", (req, res) => res.sendFile(path.join(__dirname, "../public/html/Conform.html")));

// POST (Aquí está la magia)
router.post("/login", loginUsuario); // Cambiamos la ruta a /login para que no choque
router.post("/registro", registrarUsuario);
router.post("/recuperar", recuperarPassword);

export default router;