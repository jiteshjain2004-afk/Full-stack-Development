import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function signToken(userId) {
  return jwt.sign({ id: userId }, env.jwtSecret, {
    expiresIn: env.jwtExpiry
  });
}
