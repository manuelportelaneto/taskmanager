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
    } catch (err) {
      set({ isLoading: false, error: "Failed to fetch tasks" });
    }
  },
  createTaskByMessage: async (text: string) => {
    try {
      await tasksApi.createTaskFromMessage(text);
      await get().fetchTasks(); // Recarrega a lista
    } catch (err) {
      // O store de autenticação vai lidar com o 401
      console.error(err);
    }
  },
  searchTasks: async (query: string) => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await tasksApi.searchTasks(query);
      set({ tasks, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: "Failed to search tasks" });
    }
  },
}));