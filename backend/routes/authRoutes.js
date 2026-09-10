import express from "express";
import { newRegister ,login} from "../controller/authController.js";

const router = express.Router();

router.post('/register',newRegister);
router.post('/login',login)


export default router;