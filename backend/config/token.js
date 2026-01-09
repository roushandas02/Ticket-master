import jwt from "jsonwebtoken";

export const GenerateAccessToken=(payload)=>{
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, 
        { expiresIn: "15m"}
    );
};
export const GenerateRefreshToken=(payload)=>{
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, 
        { expiresIn: "7d"}
    );
};
export const VerifyAccessToken=(token)=>{
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};
export const VerifyRefreshToken=(token)=>{
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
};
