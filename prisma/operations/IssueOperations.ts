import { prisma } from "../client/client.js";

export class IssueOperations {
    static async create(props: {
        number: number,
        title: string,
    }) {
        return prisma.issue.create({
            data: {
                ...props
            }
        })
    }
}