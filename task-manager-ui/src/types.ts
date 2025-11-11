export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  aiPriority: string | null;
  aiJustification: string | null;
  createdAt: string;
  updatedAt: string;
}