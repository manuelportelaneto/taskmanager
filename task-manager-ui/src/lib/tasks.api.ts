import api from "./api";

export const getTasks = async () => {
  const response = await api.get("/tasks");
  return response.data;
};

export const createTaskFromMessage = async (text: string) => {
  const response = await api.post("/messages", { text });
  return response.data;
};

export const searchTasks = async (query: string) => {
  const response = await api.get(`/tasks/search?query=${query}`);
  return response.data;
};

export const deleteTask = async (id: string) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};
