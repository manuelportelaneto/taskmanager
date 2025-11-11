import { create } from "zustand";
import type { Task } from "../types"; 
import * as tasksApi from "../lib/tasks.api";

interface TasksState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  createTaskByMessage: (text: string) => Promise<void>;
  searchTasks: (query: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTask: (id: string, data: { title?: string; description?: string }) => Promise<void>;
}

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,
  fetchTasks: async () => { 
    set({ isLoading: true, error: null });
    try {
      const tasks = await tasksApi.getTasks();
      set({ tasks, isLoading: false });
    } catch {
      set({ isLoading: false, error: "Failed to fetch tasks" });
    }
  },
  
  // CORREÇÃO FINAL:
  createTaskByMessage: async (text: string) => {
    set({ isLoading: true, error: null }); // Inicia o loading
    try {
      await tasksApi.createTaskFromMessage(text);
      await get().fetchTasks(); // Recarrega a lista e desliga o loading ao final
    } catch (err: unknown) {
      console.error("Failed to create task", err);
      let errorMessage = "Failed to create task via message";
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const response = (err as { response?: { data?: { message?: string } } }).response;
        if (response?.data?.message) {
          errorMessage = response.data.message;
        }
      }
      set({ isLoading: false, error: errorMessage }); // Mostra o erro na UI
    }
  },

  searchTasks: async (query: string) => {
    if (!query.trim()) {
      await get().fetchTasks();
      return;
    }
    set({ isLoading: true, error: null });
    try {
      const searchedTasks = await tasksApi.searchTasks(query);
      set({ tasks: searchedTasks, isLoading: false });
    } catch {
      set({ isLoading: false, error: "Failed to search tasks" });
    }
  },

  deleteTask: async (id: string) => {
    // Optimistic UI: Remove task immediately
    // const originalTasks = get().tasks;
    // set({ tasks: originalTasks.filter(t => t.id !== id) });
    try {
      await tasksApi.deleteTask(id);
      // Fetch tasks again to ensure consistency
      await get().fetchTasks();
    } catch {
      set({ isLoading: false, error: "Failed to delete task" });
      // Rollback if optimistic UI was used
      // set({ tasks: originalTasks });
    }
  },

  updateTask: async (id: string, data: { title?: string; description?: string }) => {
    set({ isLoading: true, error: null });
    try {
      await tasksApi.updateTask(id, data);
      await get().fetchTasks(); // Recarrega a lista para refletir a atualização
    } catch {
      set({ isLoading: false, error: "Failed to update task" });
    }
  },
}));