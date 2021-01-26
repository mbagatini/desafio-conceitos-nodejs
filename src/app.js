const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepoId(request, response, next) {
    const { id } = request.params;

    if (!isUuid(id)) {
        return response.status(400).json({ error: "Invalid repo ID" });
    }

    return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const newRepo = {
		id: uuid(),
		title,
		url,
		likes: 0,
		techs
  }

  repositories.push(newRepo);

  return response.json(newRepo);
});

app.put("/repositories/:id", validateRepoId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

	const index = repositories.findIndex(repo => repo.id === id);

	if (index < 0) {
		return response.status(400).json({ error: "Repository not found" });
	}

	const repo = { 
		id,
		title,
		url,
		techs,
		likes: repositories[index].likes
	 };
	repositories[index] = repo;
	
	return response.json(repositories[index]);
});

app.delete("/repositories/:id", validateRepoId, (request, response) => {
	const { id } = request.params;

	const index = repositories.findIndex(repo => repo.id === id);

	if (index < 0) {
		return response.status(400).json({ error: "Repository not found" });
	}

	repositories.splice(index, 1);

	return response.status(204).send();
});

app.post("/repositories/:id/like", validateRepoId, (request, response) => {
	const { id } = request.params;
	
	const index = repositories.findIndex(repo => repo.id === id);

	if (index < 0) {
		return response.status(400).json({ error: "Repository not found" });
	}

	repositories[index].likes++;

	return response.json(repositories[index]);
});

module.exports = app;
