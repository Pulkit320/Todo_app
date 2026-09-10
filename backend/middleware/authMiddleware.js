import 'dotenv/config';
import jwt from 'jsonwebtoken'

const authMiddleware = (req,res,next)=>{
    try{
    const jwt_secret = process.env.JWT_SECRET;
    const header = req.headers.authorization;
    if(!header)
            return res.status(401).json({
                error: "Authorization header required"
            })
    const words = header.split(" ");
    if(words[0] !== "Bearer")
        return res.status(401).json({
            error: "Authorization needs bearer"
        })
    const token = words[1];
    if(!token){
        return res.status(401).json({
            error: "Authorization needs token"
        })
    }
    const verify = jwt.verify(token,jwt_secret);
    req.user = verify.userId;

    next();

    }catch(error){
        console.error(error);
        return res.status(401).json({
            error: "Internal server error"
        })
    }
};

export default authMiddleware;