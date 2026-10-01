// IMPORTANDO
import {Router} from "express";
import * as planController from "../controllers/PlanController";

//CRINDO AS ROTAS DA API - VAMOS USAR O EXPRESS
const router = Router() 

// UTILIZANDO METODOS - DADOS VINDO DE REPOSITORY(ROTAS REPRESENTANDO O CRUD)
router.get("/",planController.getAll);
router.get("/:id", planController.getById);
router.post("/",planController.create);
router.put('/:id',planController.update);
router.delete('/:id',planController.remove);

export default router;