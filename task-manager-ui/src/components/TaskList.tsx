import { useState, useRef, FormEvent } from "react";
import { useTasksStore } from "../store/tasks.store";
import type { Task } from "../types";

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
}

export function TaskList({ tasks, isLoading }: TaskListProps) {
  const { deleteTask, updateTask } = useTasksStore();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleEditClick = (task: Task) => {
    setSelectedTask(task);
    dialogRef.current?.showModal();
  };

  const handleUpdateTask = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedTask) return;

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    updateTask(selectedTask.id, { title, description });
    dialogRef.current?.close();
    setSelectedTask(null);
  };

  if (isLoading) {
    return <article aria-busy="true">Carregando tarefas...</article>;
  }

  if (tasks.length === 0) {
    return <article>Nenhuma tarefa encontrada</article>;
  }

  return (
    <>
      <div className="grid-tasks">
        {tasks.map((task) => (
          <article key={task.id}>
            <header>
              <strong>{task.title}</strong>
              <br />
              <small data-tooltip="Prioridade sugerida pela IA">
                Priority:
                <mark
                  style={{
                    marginLeft: "5px",
                    backgroundColor:
                      task.aiPriority === "Alta"
                        ? "#d93526"
                        : task.aiPriority === "Média"
                        ? "#dcb827"
                        : "#2f8a3c",
                    color: "white",
                  }}
                >
                  {task.aiPriority || "N/A"}
                </mark>
              </small>
            </header>
            <p>{task.description}</p>
            <footer>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <small>
                  <strong>IA Justification:</strong>{" "}
                  {task.aiJustification || "Sem justificativa."}
                </small>
                <div className="grid" style={{ gridAutoColumns: '1fr', gap: '0.5rem' }}>
                  <button
                    className="secondary outline"
                    onClick={() => handleEditClick(task)}
                  >
                    Editar
                  </button>
                  <button
                    className="contrast outline"
                    onClick={() => deleteTask(task.id)}
                  >
                    Deletar
                  </button>
                </div>
              </div>
            </footer>
          </article>
        ))}
      </div>

      {/* Modal de Edição */}
      <dialog ref={dialogRef}>
        <article>
          <header>
            <a
              href="#close"
              aria-label="Close"
              className="close"
              onClick={(e) => {
                e.preventDefault();
                dialogRef.current?.close();
              }}
            ></a>
            Editar Tarefa
          </header>
          <form onSubmit={handleUpdateTask}>
            <label htmlFor="title">
              Título
              <input
                type="text"
                id="title"
                name="title"
                defaultValue={selectedTask?.title}
                required
              />
            </label>
            <label htmlFor="description">
              Descrição
              <textarea
                id="description"
                name="description"
                defaultValue={selectedTask?.description}
                rows={4}
              ></textarea>
            </label>
            <footer>
              <button
                type="button"
                className="secondary"
                onClick={() => dialogRef.current?.close()}
              >
                Cancelar
              </button>
              <button type="submit">Salvar</button>
            </footer>
          </form>
        </article>
      </dialog>

      <style>{`
        .grid-tasks {
          display: grid;
          gap: 1rem;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        }
        article { margin-bottom: 0 !important; }
        dialog {
          width: 80%;
          max-width: 500px;
        }
      `}</style>
    </>
  );
}