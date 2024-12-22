import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { executeJava } from "../utils/executeJava";

interface ExecuteRequestBody {
  expression: string;
}

export default async function execRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/exec",
    async (
      request: FastifyRequest<{ Body: ExecuteRequestBody }>,
      reply: FastifyReply
    ) => {
      const { expression } = request.body;

      if (!expression) {
        return reply.status(400).send({ error: "Expression is required" });
      }

      try {
        const result = await executeJava("Parser", expression);
        reply.send({ result });
      } catch (err) {
        console.error(err);
        reply
          .status(500)
          .send({ error: "Error executing Java code", details: err });
      }
    }
  );
}
