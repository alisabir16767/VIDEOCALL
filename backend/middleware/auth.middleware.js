import httpStatus from "http-status";
import { User } from "../models/user.model.js";

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null)
    return res.sendStatus(httpStatus.UNAUTHORIZED);

  try {
    const user = await User.findOne({ token: token });
    if (!user) {
        return res.sendStatus(httpStatus.FORBIDDEN);
    }
    req.user = user;
    next();
  } catch (err) {
    return res.sendStatus(httpStatus.FORBIDDEN);
  }
};
