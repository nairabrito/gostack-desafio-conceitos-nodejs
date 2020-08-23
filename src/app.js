const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const project = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };
  
  repositories.push(project);

  return response.json(project);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const indexRepository = repositories.findIndex
  (project => 
    project.id == id
  );

  if(indexRepository == -1){

    return response.status(400).json({ error: 'Project does not exists.'});

  }
  const project = {
    id,
    title,
    url,
    techs,
    likes: repositories[indexRepository].likes,
  };
  repositories[indexRepository] = project;
  return response.json(project);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const indexRepository = repositories.findIndex 
  (project => 
    project.id == id
  );

  if(indexRepository >= 0){
    repositories.splice(indexRepository, 1);

  }else {
    return response.status(400).json({ error: 'Project does not exists.'});

  }
  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const indexRepository = repositories.findIndex
    (project =>
      project.id == id
    );
    if(indexRepository == -1){

      return response.status(400).json({ error: 'Project does not exists.'}); 
    }
    repositories[indexRepository].likes += 1;

    return response.json(repositories[indexRepository]);
});

module.exports = app;
