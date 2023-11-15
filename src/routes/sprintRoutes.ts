import { PrismaClient } from "@prisma/client";
import express from "express";

const sprintRouters = express.Router();
const prisma = new PrismaClient();

sprintRouters.get("/sprints", (req, res) => {
  const sprints = prisma.sprint.findMany();
  console.log("Return all the sprints...");
  res.json(sprints);
});

sprintRouters.get("/sprints:id", (req, res) => {
  const sprintId = Number(req.params.id);
  const sprint = prisma.sprint.findUnique({ where: { id: sprintId } });
  console.log(`Return sprint of id = ${sprintId}`);
  res.json(sprint);
});

export { sprintRouters };
