import { PrismaClient } from "@prisma/client";
import { Router } from "express";

export const sprintRoutes = Router();
const prisma = new PrismaClient();

sprintRoutes.get("/", (req, res) => {
  const sprints = prisma.sprint.findMany();
  console.log("Return all the sprints...");
  res.json(sprints);
});

sprintRoutes.get("/:id", (req, res) => {
  const sprintId = Number(req.params.id);
  const sprint = prisma.sprint.findUnique({ where: { id: sprintId } });
  console.log(`Return sprint of id = ${sprintId}`);
  res.json(sprint);
});
