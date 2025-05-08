import { Context, Hono } from "hono";
import { Bindings, CommitType, Variables } from "../types";
import axios from "axios";
import { createContainer, getBlobClient, writeJsonLineToBlob } from "../utils";
import { BlobServiceClient } from "@azure/storage-blob";
import { customLogger } from "../app";

const githubRouter = new Hono<{
    Bindings: Bindings;
    Variables: Variables;
}>();

githubRouter.use("/commit/:repo", async (context, next) => {
    const repository: string = context.req.param("repo") || "";
    const branch: string = context.req.query("branch") || "main"
    const owner: string = context.req.header("owner") || ""
    const githubPatToken: string = context.req.header("githubPatToken")
    try {
        const response = await axios.get(`https://api.github.com/repos/${owner}/${repository}/commits/${branch}`, {
            headers: {
                "Authorization": `Bearer ${githubPatToken}`
            }
        })
        const result: CommitType = response.data;
        const files = result.files.map(file => {
            return { filename: file.filename, status: file.status, patch: file.patch }
        })
        const log = {
            commit_id: result.sha,
            author_name: result.commit.author.name,
            author_email: result.commit.author.email,
            commit_message: result.commit.message,
            commit_date: new Date(result.commit.author.date),
            repository,
            stats: result.stats,
            patch: files,
            containerName: ""
        };
        context.set("log", log);
        await next();
    } catch (e) {
        context.status(400);
        return context.json({
            status: "Invalid Inputs",
            message: "'repo' or 'owner' is missing or incorrect"
        })
    }
})

githubRouter.use("/commit/:repo", async (context, next) => {
    const blobClient: BlobServiceClient = getBlobClient(context.env.STREAMING_STORAGE_URL);
    const repository = context.get("log").repository;
    customLogger("REPOSITORY: ", repository)
    const containerName = repository.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/^-+|-+$/g, '').slice(0, 63);
    const log = { ...context.get("log"), containerName: containerName }
    context.set("log", log)
    let doesContainerExists: boolean = false;
    try {
        doesContainerExists = await createContainer(blobClient, containerName)
    } catch (e) {
        customLogger("Container creation failed")
        context.status(500);
        return context.json({
            success: false
        })
    }

    if (!doesContainerExists) {
        customLogger(`Container ${containerName} created`)
        await next();
    } else {
        customLogger(`Container ${containerName} already exists`)
        await next();
    }
})

githubRouter.use("/commit/:repo", async (context, next) => {
    const date = new Date().toLocaleDateString().split("/").join("-");
    const blobName: string = `commits-${date}.jsonl`
    const blobClient: BlobServiceClient = getBlobClient(context.env.STREAMING_STORAGE_URL);
    const { containerName, ...data } = context.get("log")
    const response = await writeJsonLineToBlob(blobClient, containerName, blobName, data)
    if (response) {
        customLogger(`Commit Log appended on ${containerName}/${blobName}`)
        await next();
    } else {
        customLogger("Commit Log append failed")
        context.status(500);
        return context.json({
            success: false
        })
    }
})

githubRouter.post("/commit/:repo", async (context) => {
    context.status(201)
    return context.json({
        success: true
    })
})

export default githubRouter;