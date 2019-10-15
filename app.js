const express = require('express');

const app = express();

app.use(express.json());

let requestsCount = 0;

app.use((req, res, next) => {
    requestsCount++;
    console.log(`${requestsCount} requisições feitas`);
  return next();
});

function checkProjectExists(req, res, next){
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if(!project) {
    return res.status(400).json({ error: 'Project not found!' })
  }
  return next();
};

const projects = [];

app.get('/projects', (req, res) => {
  return res.json(projects);
});

app.post('/projects', (req, res) => {
  const { id, title } = req.body;
  const project = {
    id,
    title,
    tasks: []
  };
  projects.push(project);

  return res.json(projects)
})

app.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});

app.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

app.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  
  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.send();
});

app.listen(3000, console.log('Server is running...'));