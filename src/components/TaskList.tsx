import { useMemo } from 'react';
import type { Task, TaskFilter } from '../types';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  filter: TaskFilter;
  setFilter: (f: TaskFilter) => void;
}

export default function TaskList({ tasks, onToggle, onDelete, filter, setFilter }: TaskListProps) {
  const filtered = useMemo(() => {
    const base = [...tasks].sort((a, b) => Number(a.completed) - Number(b.completed) || a.createdAt - b.createdAt);
    switch (filter) {
      case 'active':
        return base.filter(t => !t.completed);
      case 'completed':
        return base.filter(t => t.completed);
      default:
        return base;
    }
  }, [tasks, filter]);

  return (
    <section className="card">
      <header className="row space-between">
        <h2>Tasks</h2>
        <div className="filters">
          <button aria-pressed={filter==='all'} onClick={() => setFilter('all')}>All</button>
          <button aria-pressed={filter==='active'} onClick={() => setFilter('active')}>Active</button>
          <button aria-pressed={filter==='completed'} onClick={() => setFilter('completed')}>Completed</button>
        </div>
      </header>
      {filtered.length === 0 ? (
        <p className="muted">No tasks to show.</p>
      ) : (
        <ul className="task-list">
          {filtered.map(task => (
            <li key={task.id} className={task.completed ? 'done' : ''}>
              <label>
                <input type="checkbox" checked={task.completed} onChange={() => onToggle(task.id)} />
                <span>{task.text}</span>
              </label>
              <button className="danger" onClick={() => onDelete(task.id)}>✕</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}