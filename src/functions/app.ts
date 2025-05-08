import { Hono } from 'hono'
import { logger } from 'hono/logger'
import githubRouter from "./routes/github";

const app = new Hono();

export const customLogger = (message: string, ...rest: string[]) => {
    console.log(message, ...rest)
}

app.use(logger(customLogger))

app.route("/api/git", githubRouter)

app.onError((err, c) => {
    console.log("Error: " + err.message)
    return c.text('Internal Server Error', 500)
})

export default app;