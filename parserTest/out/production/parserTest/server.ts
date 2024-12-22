import fastify from "fastify";
import execRoute from "./routes/exec";
import dotenv from "dotenv";
import cors from "@fastify/cors";
dotenv.config();

const server = fastify();
server.register(cors, { origin: true, methods: ["GET", "POST"] });
server.register(execRoute);

const start = async () => {
  const port = Number(process.env.PORT) || 3001;
  try {
    await server.listen({ port });
    console.log(`Server running at http://localhost:${port}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
