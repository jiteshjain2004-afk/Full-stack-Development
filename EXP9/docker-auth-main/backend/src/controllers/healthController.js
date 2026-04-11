import { asyncHandler } from "../middleware/asyncHandler.js";
import { env } from "../config/env.js";

export const getHealth = asyncHandler(async (_req, res) => {
  res.status(200).json({
    status: "ok",
    appName: env.appName,
    uptimeSeconds: process.uptime(),
    timestamp: new Date().toISOString()
  });
});
