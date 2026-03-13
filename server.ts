import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();
const PORT = 3001;
const TASKS_FILE = path.join(__dirname, 'tasks.json');

interface Task {
  id: string;
  name: string;
  description: string;
  assignee: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  stage?: string;
}

interface Tasks {
  [key: string]: Task[];
}

app.use(cors());
app.use(express.json());

// Initialize tasks file if it doesn't exist
if (!fs.existsSync(TASKS_FILE)) {
  const initialTasks: Tasks = {
    backlog: [],
    researching: [],
    coding: [],
    testing: [],
    done: []
  };
  fs.writeFileSync(TASKS_FILE, JSON.stringify(initialTasks, null, 2));
}

// Helper to read tasks
const readTasks = (): Tasks => {
  const data = fs.readFileSync(TASKS_FILE, 'utf-8');
  return JSON.parse(data);
};

// Helper to write tasks
const writeTasks = (tasks: Tasks): void => {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
};

// GET /tasks - Get all tasks
app.get('/tasks', (_req: Request, res: Response) => {
  const tasks = readTasks();
  res.json(tasks);
});

// POST /tasks - Add a new task
app.post('/tasks', (req: Request, res: Response) => {
  const { stage, name, description, assignee } = req.body;
  const tasks = readTasks();
  
  const newTask: Task = {
    id: Date.now().toString(),
    name,
    description: description || '',
    assignee: assignee || 'unassigned',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  if (tasks[stage]) {
    tasks[stage].push(newTask);
    writeTasks(tasks);
    res.json(newTask);
  } else {
    res.status(400).json({ error: 'Invalid stage' });
  }
});

// PUT /tasks/:taskId - Update a task
app.put('/tasks/:taskId', (req: Request, res: Response) => {
  const { taskId } = req.params;
  const { stage, name, description, status, assignee } = req.body;
  const tasks = readTasks();
  
  for (const s of Object.keys(tasks)) {
    const taskIndex = tasks[s].findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      // If moving to different stage
      if (stage && stage !== s) {
        tasks[s].splice(taskIndex, 1);
        const newTask: Task = {
          ...tasks[s][taskIndex],
          ...(name && { name }),
          ...(description && { description }),
          ...(status && { status }),
          ...(assignee && { assignee }),
          stage,
          updatedAt: new Date().toISOString()
        };
        tasks[stage].push(newTask);
      } else {
        // Update in place
        tasks[s][taskIndex] = {
          ...tasks[s][taskIndex],
          ...(name && { name }),
          ...(description && { description }),
          ...(status && { status }),
          ...(assignee && { assignee }),
          updatedAt: new Date().toISOString()
        };
      }
      writeTasks(tasks);
      res.json(tasks[s].find(t => t.id === taskId));
      return;
    }
  }
  
  res.status(404).json({ error: 'Task not found' });
});

// PUT /tasks/move/:taskId - Move task between stages
app.put('/tasks/move/:taskId', (req: Request, res: Response) => {
  const { taskId } = req.params;
  const { toStage } = req.body;
  const tasks = readTasks();
  
  for (const s of Object.keys(tasks)) {
    const taskIndex = tasks[s].findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      const [task] = tasks[s].splice(taskIndex, 1);
      task.stage = toStage;
      task.updatedAt = new Date().toISOString();
      tasks[toStage].push(task);
      writeTasks(tasks);
      res.json(task);
      return;
    }
  }
  
  res.status(404).json({ error: 'Task not found' });
});

// DELETE /tasks/:taskId - Delete a task
app.delete('/tasks/:taskId', (req: Request, res: Response) => {
  const { taskId } = req.params;
  const tasks = readTasks();
  
  for (const s of Object.keys(tasks)) {
    const taskIndex = tasks[s].findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      tasks[s].splice(taskIndex, 1);
      writeTasks(tasks);
      res.json({ success: true });
      return;
    }
  }
  
  res.status(404).json({ error: 'Task not found' });
});

app.listen(PORT, () => {
  console.log(`Kanban API running on http://localhost:${PORT}`);
});
