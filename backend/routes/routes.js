import express from "express";
import pool from "../db.js";
import { getTodo,getById,createTodo , deleteById, updatebyId} from "../controller/todoController.js";

const router = express.Router()

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