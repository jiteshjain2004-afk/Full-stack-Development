import { asyncHandler } from "../middleware/asyncHandler.js";
import { env } from "../config/env.js";

export const getDashboard = asyncHandler(async (req, res) => {
  res.status(200).json({
    appName: env.appName,
    status: "healthy",
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email
    },
    uptimeSeconds: process.uptime(),
    timestamp: new Date().toISOString()
  });
});
