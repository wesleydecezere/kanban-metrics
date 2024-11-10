import { prisma } from "../../client/client.js";
import { TSystemFieldName } from "../../client/types.js";
import { SystemFieldName } from "@prisma/client";

// TODO dev env vars
const BoardFieldIdBySystemFieldName: Record<SystemFieldName, string> = {
  POSITION: "PVTSSF_lADOCuv1Ac4ApFNDzggjDrg",
  POINTS_ESTIMATE: "PVTF_lADOCuv1Ac4ApFNDzggjDvw",
  DONE_PERCENTAGE: "PVTF_lADOCuv1Ac4ApFNDzggjMEQ",
};

export function seedSystemField() {
  return prisma.systemField.createMany({
    data: Object.keys(SystemFieldName).map((systemFieldName) => ({
      name: systemFieldName as TSystemFieldName,
      boardFieldId: BoardFieldIdBySystemFieldName[systemFieldName],
    })),
  });
}
