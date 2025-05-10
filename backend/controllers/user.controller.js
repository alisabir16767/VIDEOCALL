import { User } from "../models/user.model.js";
import httpStatus from "http-status";
import asyncWrapper from "../middleware/asyncWrapper.js";
import bcrypt, { hash } from "bcrypt";
import crypto from "crypto";

export const register = asyncWrapper(async (req, res) => {
  const { name, username, password } = req.body;
  const UserExists = await User.findOne({ username });
  if (UserExists) {
    return res.status(httpStatus.CONFLICT).json({
      message: "User already exists",
    });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = new User({
    name: name,
    username: username,
    password: hashedPassword,
  });
  await user.save();
  return res.status(httpStatus.CREATED).json({
    message: "User created successfully",
  });
});

export const login = asyncWrapper(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      message: "Invalid credentials",
    });
  }
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      message: "Invalid credentials",
    });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    let token = crypto.randomBytes(64).toString("hex");
    user.token = token;
    await user.save();
    res.status(httpStatus.OK).json({ token: token });
    res.cookie("token", token, { httpOnly: true });
  } else if (!isMatch) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      message: "Invalid credentials",
    });
  }
  return res.status(httpStatus.OK).json({
    message: "User logged in successfully",
    user: {
      username: user.username,
      email: user.email,
    },
  });
});
