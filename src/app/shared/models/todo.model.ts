export interface Todo {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  createdOnUtc: string;
  modifiedOnUtc: string | null;
}

export interface TodoResponse {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  value: Todo[];
  isSuccess: boolean;
  isFailure: boolean;
  error: {
    code: string;
    type: string;
    description: string;
  };
}

export interface AddTodoRequest {
  title: string;
  description: string;
}

export interface ApiResponse {
  isSuccess: boolean;
  isFailure: boolean;
  error: {
    code: string;
    type: string;
    description: string;
  };
} 