import { VerifyAccessToken } from "../config/token.js";

const isAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid Authorization header" });
  }

  const token = authHeader.split(" ")[1]?.trim();
  if (!token) {
    return res.status(401).json({ message: "Missing access token" });
  }

  try {
    const payload = VerifyAccessToken(token);
    const { userId, role } = payload;
    req.userId = userId;
    req.userRole = role;
  } catch (err) {
    return res
      .status(401)
      .json({ message: " Invalid or expired access token" });
  }

  next();
};

export default isAuth;
