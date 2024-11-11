import { Issue, SystemField } from "@prisma/client";

export type TIssue = Issue;
export type TSystemField = SystemField;

export const SystemFieldRecord: Record<TSystemFieldName, TSystemFieldId> = {
  POSITION: 0,
  POINTS_ESTIMATE: 1,
  DONE_PERCENTAGE: 2,
};

// TODO substituir record por enum, criar esses tipos a partir do enum
export type TSystemFieldId = 0 | 1 | 2;
export type TSystemFieldName =
  | "POSITION"
  | "POINTS_ESTIMATE"
  | "DONE_PERCENTAGE";
