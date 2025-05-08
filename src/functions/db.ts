import { Schema, model, connect } from "mongoose";

export const commitSchema = new Schema({
    commitId: { type: String, unique: true, required: true },
    repository: { type: String, unique: true, required: true },
    author: { type: String, required: true },
    commitMessage: { type: String, required: true },
})

const Commit = model("Commits", commitSchema);

export default Commit;