import bcrypt from "bcryptjs";
import { GenerateAccessToken, GenerateRefreshToken, VerifyRefreshToken } from "../config/token.js";
import User from "../models/userModel.js";

export const Signup=async (req,res)=>{
    const data=req.body;
    const {name,email,password}=req.body;

    const exists = await User.findOne({ email });
    if (exists) 
        return res.status(400).json({ message: "Email already exists" });

    const hash = await bcrypt.hash(password, 12);
    let user={};
    if(data.college){  
        const {college}=req.body;
        user = await User.create({ name, email,college, passwordHash: hash, iiestian: false, role: "member" });   
    }else{
        const {roll}=req.body;
        user = await User.create({ name, email,roll, passwordHash: hash, iiestian: true, role: "member" });
    }
    res.status(201).json(user);
};

export const Login=async (req,res)=>{
    const data=req.body;
    let user;
    const {password}=req.body;
    if(data.email){
        const {email}=req.body;
        user = await User.findOne({ email });
    }else{
        const {roll}=req.body;
        user = await User.findOne({ roll });
    }
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = { userId: user._id, role: user.role };
    const accessToken = GenerateAccessToken(payload);
    const refreshToken = GenerateRefreshToken(payload);

    res.cookie("token",refreshToken,{
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 7
    });

    res.status(200).json({accessToken, user});
};


export const Refresh=(req,res)=>{
    const token=req.cookies.token;
    if (!token) 
        return res.status(401).json({ message: "No refresh token" });

    let payload;
    try {
        payload = VerifyRefreshToken(token);
    } catch {
        return res.status(401).json({ message: "Invalid refresh token" });
    }

    const { exp, iat, ...cleanPayload } = payload;
    const accessToken=GenerateAccessToken(cleanPayload);
    const refreshToken=GenerateRefreshToken(cleanPayload);

    res.cookie("token",refreshToken,{
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 7
    });

    res.status(200).json({accessToken});

};



export const Logout=(req,res)=>{
    res.clearCookie("token",{
        httpOnly: true,
        sameSite: "strict"
    })
    return res.status(200).json({ message: "Logged out successfully" });
};