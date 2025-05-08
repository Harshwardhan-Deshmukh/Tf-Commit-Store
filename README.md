## 🔗 Endpoint
POST https://{functionapp_name}.azurewebsites.net/api/git/commit/{repoName}?branch=main

Replace `{repoName}` with the name of your GitHub repository.

## 🧾 Headers

| Header Name        | Required | Description                     |
|--------------------|----------|---------------------------------|
| `owner`            | ✅       | GitHub username or organization |
| `x-functions-key`  | ✅       | Azure Function access key       | 
| `githubPatToken`   | ✅       | GitHub Personal Access Token    | 

## Application Flow

- Middleware 1: Fetches commit data from GitHub using the provided repository, branch, owner, and GitHub PAT. It processes the response to extract commit details and sets a log object in the context.
- Middleware 2: Connects to MongoDB and manages commit data. It checks if the repository exists in the database, creates a new entry if it doesn’t, updates the commit if the commit ID differs, or rejects the request if the commit ID is a duplicate.
- Middleware 3: Initializes an Azure Blob Service client and creates a container for the repository if it doesn’t exist. The container name is derived from the repository name.
- Middleware 4: Writes the commit log as a JSON line to a blob in the container, named based on the current date.
- Route Handler: Responds with a success status (201) and a JSON payload.