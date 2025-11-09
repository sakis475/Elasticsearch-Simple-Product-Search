import dotenv from "dotenv";
dotenv.config();

import { app } from "./app";
import { createServer } from "node:http";
import * as elasticLib from "./lib/helpers/elasticLib";
import { redisConnection } from "./lib/redis";

const server = createServer(app);

const PORT = process.env.SERVER_PORT;

async function startServer() {
  const isAlive = await elasticLib.ping();
  await redisConnection();
  if (!isAlive) {
    console.error("Elasticsearch is not available. Shutting down server.");
    server.close();
    return;
  }
  server.listen(PORT, () => {
    console.log(`Application started on port ${PORT}!`);
  });
}

startServer();
