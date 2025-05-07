import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../shared/services/todo.service';
import { Todo, TodoResponse } from '../../shared/models/todo.model';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid mt-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Todo List</h2>
        <button class="btn btn-primary" (click)="openAddTodoModal()">
          <i class="fas fa-plus"></i> Add New Todo
        </button>
      </div>

      <!-- Filter Buttons -->
      <div class="btn-group mb-3">
        <button class="btn btn-outline-primary" [class.active]="currentFilter === 'all'" (click)="loadTodos('all')">All</button>
        <button class="btn btn-outline-primary" [class.active]="currentFilter === 'pending'" (click)="loadTodos('pending')">Pending</button>
        <button class="btn btn-outline-primary" [class.active]="currentFilter === 'completed'" (click)="loadTodos('completed')">Completed</button>
      </div>

      <!-- Responsive Table -->
      <div class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Created Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let todo of todos">
              <td>{{ todo.title }}</td>
              <td>{{ todo.description }}</td>
              <td>
                <span class="badge" [ngClass]="todo.isCompleted ? 'bg-success' : 'bg-warning'">
                  {{ todo.isCompleted ? 'Completed' : 'Pending' }}
                </span>
              </td>
              <td>{{ todo.createdOnUtc | date:'medium' }}</td>
              <td>
                <div class="btn-group">
                  <button class="btn btn-sm btn-success" *ngIf="!todo.isCompleted" (click)="completeTodo(todo.id)">
                    <i class="fas fa-check"></i>
                  </button>
                  <button class="btn btn-sm btn-danger" (click)="deleteTodo(todo.id)">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <nav *ngIf="todoResponse" class="mt-3">
        <ul class="pagination justify-content-center">
          <li class="page-item" [class.disabled]="!todoResponse.hasPreviousPage">
            <a class="page-link" (click)="changePage(todoResponse.currentPage - 1)">Previous</a>
          </li>
          <li class="page-item" [class.disabled]="!todoResponse.hasNextPage">
            <a class="page-link" (click)="changePage(todoResponse.currentPage + 1)">Next</a>
          </li>
        </ul>
      </nav>

      <!-- Add Todo Modal -->
      <div class="modal" [class.show]="showModal" [style.display]="showModal ? 'block' : 'none'">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Add New Todo</h5>
              <button type="button" class="btn-close" (click)="closeModal()"></button>
            </div>
            <div class="modal-body">
              <form (ngSubmit)="addTodo()">
                <div class="mb-3">
                  <label for="title" class="form-label">Title</label>
                  <input type="text" class="form-control" id="title" [(ngModel)]="newTodo.title" name="title" required>
                </div>
                <div class="mb-3">
                  <label for="description" class="form-label">Description</label>
                  <textarea class="form-control" id="description" [(ngModel)]="newTodo.description" name="description" rows="3" required></textarea>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancel</button>
                  <button type="submit" class="btn btn-primary">Add Todo</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Backdrop -->
      <div class="modal-backdrop" [class.show]="showModal" [style.display]="showModal ? 'block' : 'none'" (click)="closeModal()"></div>
    </div>
  `,
  styles: [`
    .table-responsive {
      margin-bottom: 1rem;
      border-radius: 0.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .table {
      margin-bottom: 0;
    }

    .table th {
      background-color: #f8f9fa;
      border-bottom: 2px solid #dee2e6;
    }

    .btn-group {
      gap: 0.5rem;
    }

    .badge {
      padding: 0.5em 0.75em;
    }

    .modal {
      background-color: rgba(0, 0, 0, 0.5);
    }

    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1040;
    }

    .modal-dialog {
      z-index: 1050;
    }

    @media (max-width: 768px) {
      .table-responsive {
        font-size: 0.875rem;
      }

      .btn-group .btn {
        padding: 0.25rem 0.5rem;
      }

      .badge {
        font-size: 0.75rem;
      }
    }

    @media (max-width: 576px) {
      .container-fluid {
        padding: 0.5rem;
      }

      .table th, .table td {
        padding: 0.5rem;
      }

      .modal-dialog {
        margin: 0.5rem;
      }
    }
  `]
})
export class TodoComponent implements OnInit {
  todos: Todo[] = [];
  todoResponse: TodoResponse | null = null;
  currentFilter: 'all' | 'pending' | 'completed' = 'all';
  currentPage = 1;
  pageSize = 20;
  showModal = false;

  newTodo = {
    title: '',
    description: ''
  };

  constructor(private todoService: TodoService) {}

  ngOnInit() {
    this.loadTodos('all');
  }

  openAddTodoModal() {
    this.showModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.showModal = false;
    document.body.style.overflow = 'auto';
    this.newTodo = { title: '', description: '' };
  }

  loadTodos(filter: 'all' | 'pending' | 'completed') {
    this.currentFilter = filter;
    this.currentPage = 1;
    this.fetchTodos();
  }

  fetchTodos() {
    let request$;
    switch (this.currentFilter) {
      case 'pending':
        request$ = this.todoService.getPendingTodos(this.currentPage, this.pageSize);
        break;
      case 'completed':
        request$ = this.todoService.getCompletedTodos(this.currentPage, this.pageSize);
        break;
      default:
        request$ = this.todoService.getAllTodos(this.currentPage, this.pageSize);
    }

    request$.subscribe({
      next: (response) => {
        this.todoResponse = response;
        this.todos = response.value;
      },
      error: (error) => {
        console.error('Error fetching todos:', error);
      }
    });
  }

  addTodo() {
    if (!this.newTodo.title || !this.newTodo.description) return;

    this.todoService.addTodo(this.newTodo).subscribe({
      next: () => {
        this.closeModal();
        this.fetchTodos();
      },
      error: (error) => {
        console.error('Error adding todo:', error);
      }
    });
  }

  completeTodo(id: number) {
    this.todoService.completeTodo(id).subscribe({
      next: () => {
        this.fetchTodos();
      },
      error: (error) => {
        console.error('Error completing todo:', error);
      }
    });
  }

  deleteTodo(id: number) {
    if (confirm('Are you sure you want to delete this todo?')) {
      this.todoService.deleteTodo(id).subscribe({
        next: () => {
          this.fetchTodos();
        },
        error: (error) => {
          console.error('Error deleting todo:', error);
        }
      });
    }
  }

  changePage(page: number) {
    if (page < 1 || (this.todoResponse && page > this.todoResponse.totalPages)) return;
    this.currentPage = page;
    this.fetchTodos();
  }
} 