## 🔗 Endpoint
POST https://{functionapp_name}.azurewebsites.net/api/git/commit/{repoName}?branch=main

Replace `{repoName}` with the name of your GitHub repository.

## 🧾 Headers

| Header Name        | Required | Description                     |
|--------------------|----------|---------------------------------|
| `owner`            | ✅       | GitHub username or organization |
| `x-functions-key`  | ✅       | Azure Function access key       | 
| `githubPatToken`   | ✅       | GitHub Personal Access Token    | 