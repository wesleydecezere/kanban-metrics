import express from "express";

const sprintRouters = express.Router();

sprintRouters.get("/sprints", (req, res) => {
  res.send("Return all the sprints");
});

sprintRouters.get("/sprints/:id", (req, res) => {
  const id: string = req.params.id;
  res.send(`Return the sprint with id = ${id}`);
});

export { sprintRouters };
