import express from 'express';
import pool from './db.js';
import authRouter from './routes/authRoutes.js';
import Todorouter from './routes/routes.js';
import cors from 'cors';

const app = express();

app.use(cors())
app.use(express.json());

app.use("/auth",authRouter);
app.use("/todos",Todorouter);

const port = 3000;
app.listen(port, ()=>{
    console.log(`Backend running at ${port}`);
})