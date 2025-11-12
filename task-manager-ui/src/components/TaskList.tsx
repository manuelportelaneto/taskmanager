import { useTasksStore } from "../store/tasks.store";
import type { Task } from "../types";
import styles from "./TaskList.module.css";

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
}

export function TaskList({ tasks, isLoading }: TaskListProps) {
  const { deleteTask, updateTask } = useTasksStore();

  const handleEditClick = (task: Task) => {
    const newTitle = prompt("Enter new title:", task.title);
    if (newTitle === null || newTitle.trim() === "") return;

    const newDescription = prompt(
      "Enter new description:",
      task.description || ""
    );
    if (newDescription === null) return;

    updateTask(task.id, { title: newTitle, description: newDescription });
  };

  if (isLoading) {
    return <article aria-busy="true">Carregando tarefas...</article>;
  }

  if (tasks.length === 0) {
    return <article><p>Nenhuma tarefa encontrada. Tente criar uma!</p></article>;
  }

  return (
    <div className="grid">
      {tasks.map((task) => (
        <article key={task.id} className={styles['task-card']}>
          <header>
            <strong>{task.title}</strong>
            <br />
            <small data-tooltip="Prioridade sugerida pela IA">
              Priority: <mark>{task.aiPriority || "N/A"}</mark>
            </small>
          </header>
          <p>{task.description}</p>
          <footer>
            <small>
              <strong>IA Justification:</strong>{" "}
              {task.aiJustification || "Sem justificativa."}
            </small>
            <div className={styles.buttonGroup}>
              <button
                className={styles.editButton}
                onClick={() => handleEditClick(task)}
              >
                Editar
              </button>
              <button
                className={styles.deleteButton}
                onClick={() => deleteTask(task.id)}
              >
                Deletar
              </button>
            </div>
          </footer>
        </article>
      ))}
    </div>
  );
}