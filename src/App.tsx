import { useState, useEffect } from 'react'

interface Task {
  id: string;
  name: string;
  description: string;
  assignee: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Tasks {
  [key: string]: Task[];
}

const STAGES = ['backlog', 'todo', 'in_progress', 'coding', 'testing', 'review', 'done'] as const;

type Stage = typeof STAGES[number];

const STAGE_LABELS: Record<Stage, string> = {
  backlog: 'Backlog',
  todo: 'To Do',
  in_progress: 'In Progress',
  coding: 'Coding',
  testing: 'QA / Testing',
  review: '🔍 Review',
  done: '✅ Done'
};

const STAGE_COLORS: Record<Stage, string> = {
  backlog: 'from-gray-600 to-gray-700',
  todo: 'from-blue-600 to-blue-700',
  in_progress: 'from-cyan-600 to-cyan-700',
  coding: 'from-purple-600 to-purple-700',
  testing: 'from-yellow-600 to-yellow-700',
  review: 'from-orange-600 to-orange-700',
  done: 'from-green-600 to-green-700'
};

function App() {
  const [tasks, setTasks] = useState<Tasks>({
    backlog: [],
    researching: [],
    coding: [],
    testing: [],
    done: []
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStage, setSelectedStage] = useState<Stage>('backlog');
  const [newTask, setNewTask] = useState({ name: '', description: '', assignee: 'Marco' });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch('http://localhost:3001/tasks');
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  };

  const addTask = async () => {
    if (!newTask.name.trim()) return;
    
    try {
      await fetch('http://localhost:3001/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newTask, stage: selectedStage })
      });
      setNewTask({ name: '', description: '', assignee: 'Marco' });
      setShowAddModal(false);
      fetchTasks();
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  };

  const moveTask = async (taskId: string, toStage: Stage) => {
    try {
      await fetch(`http://localhost:3001/tasks/move/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toStage })
      });
      fetchTasks();
    } catch (err) {
      console.error('Failed to move task:', err);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await fetch(`http://localhost:3001/tasks/${taskId}`, {
        method: 'DELETE'
      });
      fetchTasks();
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">📋 Workspace Kanban</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Add Task
        </button>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {(STAGES as Stage[]).map((stage) => (
          <div key={stage} className="bg-gray-800/50 rounded-xl p-4 min-h-[500px]">
            <div className={`bg-gradient-to-r ${STAGE_COLORS[stage]} rounded-lg px-4 py-2 mb-4`}>
              <h2 className="font-semibold text-white text-center">{STAGE_LABELS[stage]}</h2>
              <p className="text-white/70 text-xs text-center">{tasks[stage]?.length || 0} tasks</p>
            </div>
            
            <div className="space-y-3">
              {tasks[stage]?.map((task) => (
                <div key={task.id} className="bg-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-600 transition-colors group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-white text-sm">{task.name}</span>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-300 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                  {task.description && (
                    <p className="text-gray-400 text-xs mb-2">{task.description}</p>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">👤 {task.assignee}</span>
                    <span className="text-xs text-gray-500">
                      {task.updatedAt ? new Date(task.updatedAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                  
                  {stage !== 'done' && (
                    <div className="mt-2 pt-2 border-t border-gray-600">
                      <select
                        value={stage}
                        onChange={(e) => moveTask(task.id, e.target.value as Stage)}
                        className="w-full bg-gray-800 text-xs text-gray-300 rounded px-2 py-1"
                      >
                        {(STAGES as Stage[]).map((s) => (
                          <option key={s} value={s} disabled={s === stage}>
                            Move to: {STAGE_LABELS[s]}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-96">
            <h3 className="text-xl font-bold text-white mb-4">Add New Task</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">Task Name</label>
                <input
                  type="text"
                  value={newTask.name}
                  onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                  placeholder="Enter task name..."
                />
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm mb-1">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 h-20"
                  placeholder="Enter description..."
                />
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm mb-1">Assignee</label>
                <select
                  value={newTask.assignee}
                  onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                >
                  <option value="Marco">Marco</option>
                  <option value="Jubas">Jubas</option>
                  <option value="unassigned">Unassigned</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm mb-1">Stage</label>
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value as Stage)}
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                >
                  {(STAGES as Stage[]).map((s) => (
                    <option key={s} value={s}>{STAGE_LABELS[s]}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={addTask}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
