import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Todo, TodoResponse, AddTodoRequest, ApiResponse } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private baseUrl = 'https://localhost:7072/api/v1/todo';

  constructor(private http: HttpClient) { }

  getAllTodos(pageIndex: number = 1, pageSize: number = 20): Observable<TodoResponse> {
    const params = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<TodoResponse>(`${this.baseUrl}/get-all-items`, { params });
  }

  getPendingTodos(pageIndex: number = 1, pageSize: number = 20): Observable<TodoResponse> {
    const params = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<TodoResponse>(`${this.baseUrl}/get-pending-items`, { params });
  }

  getCompletedTodos(pageIndex: number = 1, pageSize: number = 20): Observable<TodoResponse> {
    const params = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<TodoResponse>(`${this.baseUrl}/get-completed-items`, { params });
  }

  addTodo(todo: AddTodoRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.baseUrl}/add-item`, todo);
  }

  completeTodo(id: number): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.baseUrl}/complete-item?id=${id}`, {});
  }

  deleteTodo(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/delete-item?id=${id}`);
  }
} 