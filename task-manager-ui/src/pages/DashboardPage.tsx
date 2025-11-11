import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import { useTasksStore } from "../store/tasks.store";
import { TaskList } from "../components/TaskList";

const DashboardPage = () => {
  const { logout, token } = useAuthStore();
  const { tasks, isLoading, error, fetchTasks, createTaskByMessage, searchTasks } = useTasksStore();
  const navigate = useNavigate();

  const [quickCreateText, setQuickCreateText] = useState("");
  const [searchText, setSearchText] = useState("");

  // Usar useCallback para memorizar a função e evitar re-criações
  const stableFetchTasks = useCallback(() => {
    if (token) {
      fetchTasks();
    }
  }, [token, fetchTasks]);

  useEffect(() => {
    stableFetchTasks();
  }, [stableFetchTasks]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleQuickCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quickCreateText.trim()) {
      await createTaskByMessage(quickCreateText);
      setQuickCreateText(""); // Clear input after successful creation
      fetchTasks(); // Refresh tasks
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchText.trim()) {
      await searchTasks(searchText);
      setSearchText(""); // Clear input after successful search
      fetchTasks(); // Refresh tasks
    }
  };

  return (
    <main className="container">
      <nav>
        <ul>
          <li><h1>Painel de Controle</h1></li>
        </ul>
        <ul>
          <li><button onClick={handleLogout} className="secondary">Logout</button></li>
        </ul>
      </nav>
      <article>
        <div className="grid">
          <form onSubmit={handleSearch}>
            <label htmlFor="search">Buscar Tarefas</label>
            <input
              type="search"
              id="search"
              name="search"
              placeholder="Search tasks..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>

          <form onSubmit={handleQuickCreate}>
            <label htmlFor="quick-create">Quick Create Task</label>
            <input
              type="text"
              id="quick-create"
              name="quick-create"
              placeholder="e.g., 'Call mom tomorrow at 5pm'"
              value={quickCreateText}
              onChange={(e) => setQuickCreateText(e.target.value)}
            />
            <button type="submit">Create</button>
          </form>
        </div>

        <h2>Suas Tarefas</h2>
        {error && <p style={{ color: 'var(--pico-color-red-500)' }}>{error}</p>}
        <TaskList tasks={tasks} isLoading={isLoading} />
      </article>
    </main>
  );
};

export default DashboardPage;