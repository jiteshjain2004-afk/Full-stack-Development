import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { signToken } from "../utils/token.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: "User already exists." });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashed
  });

  return res.status(201).json({
    token: signToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  return res.status(200).json({
    token: signToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
});

export const getProfile = asyncHandler(async (req, res) => {
  return res.status(200).json({
    user: req.user
  });
});
