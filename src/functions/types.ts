import { InferSchemaType } from "mongoose"
import { commitSchema } from "./db"

export type Bindings = {
    STREAMING_STORAGE_URL: string,
    MONGODB_URL: string
}

type filesType = {
    filename: string,
    status: string,
    patch: string
}

export type Variables = {
    log: {
        commit_id: string,
        author_name: string
        author_email: string,
        commit_message: string,
        commit_date: Date,
        repository: string,
        stats: {
            total: number;
            additions: number;
            deletions: number;
        },
        patch: filesType[],
        containerName: string
    }
}

export type CommitType = {
    sha: string;
    commit: {
        author: {
            name: string;
            email: string,
            date: Date
        },
        message: string
    },
    stats: {
        total: number;
        additions: number,
        deletions: number
    },
    files: filesType[]
}

export type DatabaseSchema = InferSchemaType<typeof commitSchema>;