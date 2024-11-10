import { Router } from "express";
import { getAllProjectV2Fields } from "../../github-gql/command/projectV2FIeld.js";
import { BoardFieldOperations } from "../../../prisma/operations/BoardFieldOperations.js";

export const boardFieldRoutes = Router();

boardFieldRoutes.get("/", async (req, res) => {
  const boardFieldBatch = await getAllProjectV2Fields();

  if (req.query.refresh) {
    const promises = boardFieldBatch.map((boardField) =>
      BoardFieldOperations.upsert(boardField)
    );
    await Promise.all(promises);
  }

  res.send(boardFieldBatch);
});
