import type { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
}

export function TaskList({ tasks, isLoading }: TaskListProps) {
  if (isLoading) {
    return <article aria-busy="true">Loading tasks...</article>;
  }

  if (tasks.length === 0) {
    return <p>No tasks found.</p>;
  }

  return (
    <section>
      {tasks.map((task) => (
        <article key={task.id}>
          <header><strong>{task.title}</strong></header>
          <p>{task.description}</p>
          <footer>
            <small>
              <strong>Priority:</strong> {task.aiPriority} | <strong>Justification:</strong> {task.aiJustification}
            </small>
          </footer>
        </article>
      ))}
    </section>
  );
}