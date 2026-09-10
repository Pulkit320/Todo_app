import pool from "../db.js";
import bcrypt from "bcrypt";
import 'dotenv/config';
import jwt from 'jsonwebtoken';

const newRegister = async(req, res)=>{
    try{
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        if (!username || !email || !password) {
        return res.status(400).json({
            error: "Username, email and password are required"
            });
        }
        const text = `SELECT * FROM users WHERE email = $1`;
        const values = [email];
        const validation = await pool.query(text,values);

        if(validation.rows.length !== 0){
            return res.status(400).json({
                error: "email is already used"
            })
        }

        const password_hash = await bcrypt.hash(password,10);
        const query = `INSERT INTO users (username,email,password_hash) VALUES ($1,$2,$3) RETURNING id,username,email,created_at;`
        const value = [username,email,password_hash];
        const result = await pool.query(query,value);

        return res.status(200).json({
            message: "User registered",
            user: result.rows[0]
        });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            error: "Internal server error"
        })
    }
}

const login = async(req,res)=>{
    const jwt_secret = process.env.JWT_SECRET;
    try{
        const email = req.body.email;
        const password = req.body.password;

        if(!email||!password){
            return res.status(400).json({
                error: "Email and password are required"
            })
        }


        const text = 'SELECT id, password_hash from users where email = $1';
        const values = [email];
        const result = await pool.query(text,values);
        if(result.rows.length===0){
            return res.status(401).json({
                error:"Invalid email or password"
            });
        }
        const user = result.rows[0];
        const password_hash = user.password_hash;
        const match = await bcrypt.compare(password,password_hash);

        if(!match){
            return res.status(401).json({
                error: "Invalid email or passwor"
            })
        }
        else{
            const token = jwt.sign(
                {userId: user.id},
                jwt_secret,
                {expiresIn: "1h"}
            )

            return res.status(200).json({
                token: token
            })
        }

    }catch(error){
        console.error(error)
        return res.status(500).json({
            error: "Internal server error"
        })
    }

}

export {newRegister, login};