import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckSquare, Plus, Trash, Zap } from 'lucide-react';

interface TaskItem {
  id: string;
  text: string;
  completed: boolean;
}

const AIPlanner: React.FC = () => {
  // Pomodoro states
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [focusMode, setFocusMode] = useState(false);

  // Todo States
  const [todos, setTodos] = useState<TaskItem[]>([
    { id: '1', text: 'Solve Two Sum matching sub-arrays', completed: false },
    { id: '2', text: 'Review Binary search loop bounds', completed: true }
  ]);
  const [todoInput, setTodoInput] = useState('');

  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsRunning(false);
      alert('Pomodoro focus session completed! Take a 5-minute break.');
      setSecondsLeft(25 * 60);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(25 * 60);
  };

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!todoInput.trim()) return;

    const newTodo: TaskItem = {
      id: Date.now().toString(),
      text: todoInput,
      completed: false
    };
    setTodos([...todos, newTodo]);
    setTodoInput('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  return (
    <div className={`space-y-6 transition-all duration-500 ${focusMode ? 'fixed inset-0 bg-[#070913] z-50 p-12 overflow-y-auto flex flex-col justify-center items-center' : ''}`}>
      {/* Title */}
      {!focusMode && (
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">AI Pomodoro & Planner</h1>
          <p className="mt-2 text-sm text-gray-400">Pace your learning hours, checklist coding objectives, and trigger distraction-free Focus Mode.</p>
        </div>
      )}

      {/* Focus mode controls */}
      {focusMode && (
        <button
          onClick={() => setFocusMode(false)}
          className="absolute top-6 right-6 px-4 py-2 border border-brand-border hover:border-white text-xs font-bold text-gray-400 hover:text-white rounded-xl transition-all"
        >
          Exit Focus Mode
        </button>
      )}

      <div className={`grid grid-cols-1 ${focusMode ? 'max-w-md w-full' : 'md:grid-cols-2'} gap-6`}>
        {/* Pomodoro Timer widget */}
        <div className="p-8 rounded-2xl bg-brand-card border border-brand-border shadow-glow flex flex-col items-center justify-center space-y-6 text-center">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-bold text-indigo-400">Pomodoro Focus Timer</span>
            <div className="text-6xl font-black text-white font-mono mt-3 animate-pulse">
              {formatTime(secondsLeft)}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`p-3.5 rounded-full text-white shadow-glow transition-all ${isRunning ? 'bg-amber-600 hover:bg-amber-500' : 'bg-indigo-600 hover:bg-indigo-500'}`}
            >
              {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <button
              onClick={resetTimer}
              className="p-3.5 rounded-full bg-[#111A2C] border border-brand-border text-gray-400 hover:text-white transition-all"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          {!focusMode && (
            <button
              onClick={() => setFocusMode(true)}
              className="w-full py-3 bg-[#111A2C] hover:bg-brand-border border border-brand-border rounded-xl text-xs font-bold text-indigo-400 hover:text-white transition-all flex items-center justify-center gap-1.5"
            >
              <Zap className="w-4 h-4" /> Trigger Fullscreen Focus Mode
            </button>
          )}
        </div>

        {/* Task checklist widget */}
        {!focusMode && (
          <div className="p-6 rounded-2xl bg-brand-card border border-brand-border shadow-glow flex flex-col justify-between h-[300px]">
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4" /> Coding Goals
              </h3>

              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {todos.map((todo) => (
                  <div key={todo.id} className="flex justify-between items-center p-2 bg-brand-dark/40 border border-brand-border/40 rounded-lg text-xs">
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className={`text-left ${todo.completed ? 'line-through text-gray-500' : 'text-gray-300'}`}
                    >
                      {todo.text}
                    </button>
                    <button onClick={() => deleteTodo(todo.id)} className="text-red-400 hover:text-red-300">
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={addTodo} className="flex gap-2 border-t border-brand-border/40 pt-4 mt-2">
              <input
                type="text"
                required
                placeholder="E.g. Code DFS traversals..."
                className="flex-1 px-4 py-2 bg-[#111A2C] border border-brand-border rounded-lg text-xs text-white focus:outline-none"
                value={todoInput}
                onChange={(e) => setTodoInput(e.target.value)}
              />
              <button type="submit" className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg">
                <Plus className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIPlanner;
