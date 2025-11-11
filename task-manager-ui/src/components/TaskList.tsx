import { useTasksStore } from "../store/tasks.store";
import type { Task } from "../types";

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
}

export function TaskList({ tasks, isLoading }: TaskListProps) {
  const { deleteTask } = useTasksStore();

  if (isLoading) {
    return <article aria-busy="true">Carregando tarefas...</article>;
  }

  if (tasks.length === 0) {
    return <article>Nenhuma tarefa encontrada</article>;
  }

  return (
    <div className="grid-tasks">
      {tasks.map((task) => (
        <article key={task.id}>
          <header>
            <strong>{task.title}</strong>
            <br />
            {/* Badge simples para a prioridade */}
            <small data-tooltip="Prioridade sugerida pela IA">
              Priority: 
              <mark style={{ 
                marginLeft: '5px',
                backgroundColor: task.aiPriority === 'Alta' ? '#d93526' : 
                               task.aiPriority === 'Média' ? '#dcb827' : '#2f8a3c',
                color: 'white'
              }}>
                {task.aiPriority || 'N/A'}
              </mark>
            </small>
          </header>
          <p>{task.description}</p>
          <footer>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <small>
                <strong>IA Justification:</strong> {task.aiJustification || "Sem justificativa."}
              </small>
              <button 
                className="contrast outline"
                onClick={() => deleteTask(task.id)}
              >
                Deletar
              </button>
            </div>
          </footer>
        </article>
      ))}
      
      {/* Adicione este estilo temporário se não quiser criar um arquivo CSS separado */}
      <style>{`
        .grid-tasks {
          display: grid;
          gap: 1rem;
          /* Cards responsivos */
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        }
        article { margin-bottom: 0 !important; } 
      `}</style>
    </div>
  );
}