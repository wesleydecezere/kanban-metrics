import { prisma } from "../../client/client.js";
import { TSystemFieldName } from "../../client/types.js";

// TODO dev env vars
export const FieldIdsBySystemFieldName: Record<
  TSystemFieldName,
  { systemFieldId: number; boardFieldId: string }
> = {
  POSITION: {
    systemFieldId: 1,
    boardFieldId: "PVTSSF_lADOCuv1Ac4ApFNDzggjDrg",
  },
  POINTS_ESTIMATE: {
    systemFieldId: 2,
    boardFieldId: "PVTF_lADOCuv1Ac4ApFNDzggjDvw",
  },
  DONE_PERCENTAGE: {
    systemFieldId: 3,
    boardFieldId: "PVTF_lADOCuv1Ac4ApFNDzggjMEQ",
  },
};

const systemFieldNames = Object.keys(
  FieldIdsBySystemFieldName
) as TSystemFieldName[];

export type SeedSystemFieldResult = ReturnType<typeof seedSystemField>;

// TODO log info
export function seedSystemField() {
  return prisma.systemField.createManyAndReturn({
    data: systemFieldNames.map((systemFieldName) => ({
      name: systemFieldName,
      id: FieldIdsBySystemFieldName[systemFieldName].systemFieldId,
      boardFieldId: FieldIdsBySystemFieldName[systemFieldName].boardFieldId,
    })),
    select: {
      boardField: true,
    },
  });
}
