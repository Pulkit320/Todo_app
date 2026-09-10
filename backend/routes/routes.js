import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getTodo,getById,createTodo , deleteById, updatebyId} from "../controller/todoController.js";

const router = express.Router()
router.use(authMiddleware)
//GET

router.get('/',getTodo);

// search by ID

router.get('/:id', getById);


// POST


router.post('/',createTodo);


//DELETE

router.delete('/:id',deleteById);

//PATCH

router.patch("/:id", updatebyId);

export default router;