import { useMemo, useState } from 'react';
import TaskList from './components/TaskList';
import Weather from './components/Weather';
import ErrorBoundary from './components/ErrorBoundary';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Task, TaskFilter } from './types';
import './index.css';

export default function App() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [text, setText] = useState('');
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [city, setCity] = useLocalStorage<string>('city', 'New York');

  function addTask() {
    const trimmed = text.trim();
    if (!trimmed) return;
    const t: Task = { id: crypto.randomUUID(), text: trimmed, completed: false, createdAt: Date.now() };
    setTasks(prev => [t, ...prev]);
    setText('');
  }

  function toggleTask(id: string) {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }

  function deleteTask(id: string) {
    setTasks(prev => prev.filter(t => t.id !== id));
  }

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const active = total - completed;
    return { total, completed, active };
  }, [tasks]);

  return (
    <ErrorBoundary>
      <main className="container">
        <h1>To‑Do with Live Weather & ML Forecast</h1>

        {/* Task input */}
        <section className="card">
          <div className="row gap">
            <input
              placeholder="Add a task…"
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTask()}
            />
            <button onClick={addTask} disabled={!text.trim()}>Add</button>
          </div>
          <p className="muted small">{stats.active} active / {stats.completed} completed / {stats.total} total</p>
        </section>

        {/* Grid layout: Task list, city selector, weather */}
        <div className="grid">
          {/* Tasks */}
          <TaskList
            tasks={tasks}
            onToggle={toggleTask}
            onDelete={deleteTask}
            filter={filter}
            setFilter={setFilter}
          />

          {/* City input */}
          <section className="card">
            <header className="row space-between">
              <h2>City</h2>
            </header>
            <div className="row gap">
              <input
                placeholder="Enter city (e.g., London)"
                value={city}
                onChange={e => setCity(e.target.value)}
              />
            </div>
            <p className="muted small">City saved in browser storage.</p>
          </section>

          {/* Weather section */}
          <Weather city={city} />
        </div>
      </main>
    </ErrorBoundary>
  );
}
