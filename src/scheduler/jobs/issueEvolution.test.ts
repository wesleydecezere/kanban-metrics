import { TSystemFieldName } from "../../../prisma/client/types.js";
import { IssueEvolutionOperations } from "../../../prisma/operations/IssueEvolutionOperations.js";
import { IssueOperations } from "../../../prisma/operations/IssueOperations.js";
import { SystemFieldOperations } from "../../../prisma/operations/SystemFieldOperations.js";
import * as ProjectsV2ItemCommand from "../../github-gql/command/projectV2Item.js";
import { trackIssueEvolucoesBySprint } from "./jobs.js";

// TODO atualizar impl para usar SystemFieldId ao invés do SystemFieldName
describe("trackIssueEvolutionBySprint", () => {
  const sprintId = 1;
  const firstIssue = { id: "1", number: 1, title: "Issue 1" };
  const secondIssue = { id: "2", number: 1, title: "Issue 2" };
  const boardFieldNameBySystemField: Record<TSystemFieldName, string> = {
    POSITION: "Status",
    POINTS_ESTIMATE: "Tamanho Real",
    DONE_PERCENTAGE: "% Feito",
  };
  const fieldValuesByIssueId: Record<
    string,
    Record<TSystemFieldName, string | number>
  > = {
    [firstIssue.id]: {
      POSITION: "Done",
      POINTS_ESTIMATE: 5,
      DONE_PERCENTAGE: 100,
    },
    [secondIssue.id]: {
      POSITION: "Started",
      POINTS_ESTIMATE: 6,
      DONE_PERCENTAGE: 10,
    },
  };

  const spyFindAllSystemField = jest
    .spyOn(SystemFieldOperations, "findAll")
    .mockResolvedValue([
      {
        name: "POSITION",
        boardField: { name: boardFieldNameBySystemField.POSITION },
      },
      {
        name: "POINTS_ESTIMATE",
        boardField: { name: boardFieldNameBySystemField.POINTS_ESTIMATE },
      },
      {
        name: "DONE_PERCENTAGE",
        boardField: { name: boardFieldNameBySystemField.DONE_PERCENTAGE },
      },
    ]);

  const spyGetFieldValueBy = jest
    .spyOn(ProjectsV2ItemCommand, "getFieldValueBy")
    .mockImplementation(({ itemNodeId, fieldName }) => {
      let result = {};

      if (fieldName === boardFieldNameBySystemField.POSITION)
        result = fieldValuesByIssueId[itemNodeId].POSITION;

      if (fieldName === boardFieldNameBySystemField.POINTS_ESTIMATE)
        result = fieldValuesByIssueId[itemNodeId].POINTS_ESTIMATE;

      if (fieldName === boardFieldNameBySystemField.DONE_PERCENTAGE)
        result = fieldValuesByIssueId[itemNodeId].DONE_PERCENTAGE;

      return Promise.resolve(result);
    });

  const spyCreateIssueEvolution = jest.spyOn(
    IssueEvolutionOperations,
    "create"
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should do nothing when there are no issues", async () => {
    const spyFindIssueBySprintId = jest
      .spyOn(IssueOperations, "findBySprintId")
      .mockResolvedValue([]);

    await trackIssueEvolucoesBySprint(sprintId);

    expect(spyFindIssueBySprintId).toHaveBeenCalledWith(sprintId);
    expect(spyFindAllSystemField).not.toHaveBeenCalled();
    expect(spyGetFieldValueBy).not.toHaveBeenCalled();
    expect(spyCreateIssueEvolution).not.toHaveBeenCalled();
  });

  it("should save issue evolution by sprint when there are issues", async () => {
    const spyFindIssueBySprintId = jest
      .spyOn(IssueOperations, "findBySprintId")
      .mockResolvedValue([firstIssue, secondIssue]);

    await trackIssueEvolucoesBySprint(sprintId);

    expect(spyFindIssueBySprintId).toHaveBeenCalledWith(sprintId);
    expect(spyFindAllSystemField).toHaveBeenCalled();
    expect(spyGetFieldValueBy).toHaveBeenCalledTimes(6);
    expect(spyCreateIssueEvolution).toHaveBeenCalledWith({
      issueId: firstIssue.id,
      date: expect.any(Date),
      position: fieldValuesByIssueId[firstIssue.id].POSITION,
      pointsEstimate: fieldValuesByIssueId[firstIssue.id].POINTS_ESTIMATE,
      donePercentage: fieldValuesByIssueId[firstIssue.id].DONE_PERCENTAGE,
    });
    expect(spyCreateIssueEvolution).toHaveBeenCalledWith({
      issueId: secondIssue.id,
      date: expect.any(Date),
      position: fieldValuesByIssueId[secondIssue.id].POSITION,
      pointsEstimate: fieldValuesByIssueId[secondIssue.id].POINTS_ESTIMATE,
      donePercentage: fieldValuesByIssueId[secondIssue.id].DONE_PERCENTAGE,
    });
  });
});
