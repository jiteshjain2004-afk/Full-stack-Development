import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";

async function startServer() {
  await connectDB(env.mongoUri);
  app.listen(env.port, () => {
    console.log(`${env.appName} backend listening on port ${env.port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start backend:", error.message);
  process.exit(1);
});
