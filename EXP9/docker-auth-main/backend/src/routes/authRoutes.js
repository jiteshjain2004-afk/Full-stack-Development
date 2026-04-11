import { Router } from "express";
import { body } from "express-validator";
import { getProfile, loginUser, registerUser } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validate.js";

const router = Router();

router.post(
  "/signup",
  [
    body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters."),
    body("email").isEmail().withMessage("Valid email is required."),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters.")
  ],
  validateRequest,
  registerUser
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required."),
    body("password").notEmpty().withMessage("Password is required.")
  ],
  validateRequest,
  loginUser
);

router.get("/me", protect, getProfile);

export default router;
