import { prisma } from "../client/client.js";

type IssueProps = {
    id: string,
    number: number,
    title: string,
}

export class IssueOperations {
    static async create(props: IssueProps) {
        return prisma.issue.create({
            data: props
        })
    }

    static async updateTitleById(title: IssueProps['title'], id: IssueProps['id']) {
        return prisma.issue.update({
            data: {
                title
            },
            where: {
                id
            }
        })
    }
}