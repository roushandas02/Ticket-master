import { VerifyAccessToken } from "../config/token.js";


const isAuth=(req,res,next)=>{
    // Access token is expected in Authorization header as Bearer <token>
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: 'Missing Authorization header' });
   
    const token=authHeader.split(' ')[1];
    try{
        const payload=VerifyAccessToken(token);
        const {userId}=payload;
        req.userId=userId;
    }catch(err){
        return res.status(401).json({ message: 'Invalid or expired access token' });
    }
    next();
}

export default isAuth;