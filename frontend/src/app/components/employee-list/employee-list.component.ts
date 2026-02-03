import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService, Employee } from '../../services/employee.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>Employee Management</h2>

      <div class="form-section">
        <h3>Add New Employee</h3>
        <form (ngSubmit)="addEmployee()" class="employee-form">
          <input
            [(ngModel)]="newEmployee.employee_id"
            name="employee_id"
            placeholder="Employee ID"
            required
          />
          <input
            [(ngModel)]="newEmployee.full_name"
            name="full_name"
            placeholder="Full Name"
            required
          />
          <input
            [(ngModel)]="newEmployee.email"
            name="email"
            type="email"
            placeholder="Email"
            required
          />
          <input
            [(ngModel)]="newEmployee.department"
            name="department"
            placeholder="Department"
            required
          />
          <button type="submit" class="btn btn-primary">Add Employee</button>
        </form>
        <p *ngIf="errorMessage" class="error">{{ errorMessage }}</p>
        <p *ngIf="successMessage" class="success">{{ successMessage }}</p>
      </div>

      <div class="employees-section">
        <h3>All Employees</h3>
        <div *ngIf="loading" class="loading">Loading employees...</div>
        <div *ngIf="!loading && employees.length === 0" class="empty">
          No employees found.
        </div>
        <table *ngIf="!loading && employees.length > 0" class="table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let emp of employees">
              <td>{{ emp.employee_id }}</td>
              <td>{{ emp.full_name }}</td>
              <td>{{ emp.email }}</td>
              <td>{{ emp.department }}</td>
              <td>
                <button
                  (click)="deleteEmployee(emp.employee_id)"
                  class="btn btn-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 900px;
      margin: 0 auto;
    }

    h2 {
      color: #2c3e50;
      margin-bottom: 30px;
    }

    h3 {
      color: #34495e;
      margin-top: 20px;
      margin-bottom: 15px;
    }

    .form-section {
      background: #ecf0f1;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
    }

    .employee-form {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 15px;
    }

    input {
      padding: 10px;
      border: 1px solid #bdc3c7;
      border-radius: 4px;
      font-size: 14px;
    }

    input:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.3s;
    }

    .btn-primary {
      background-color: #3498db;
      color: white;
      grid-column: span 2;
    }

    .btn-primary:hover {
      background-color: #2980b9;
    }

    .btn-danger {
      background-color: #e74c3c;
      color: white;
      padding: 6px 12px;
      font-size: 12px;
    }

    .btn-danger:hover {
      background-color: #c0392b;
    }

    .error {
      color: #c0392b;
      background-color: #fadbd8;
      padding: 12px;
      border-radius: 4px;
      margin-top: 10px;
      border-left: 4px solid #e74c3c;
      font-weight: 500;
      white-space: pre-wrap;
      line-height: 1.5;
    }

    .success {
      color: #1e8449;
      background-color: #d5f4e6;
      padding: 12px;
      border-radius: 4px;
      margin-top: 10px;
      border-left: 4px solid #27ae60;
      font-weight: 500;
    }

    .employees-section {
      background: white;
      padding: 20px;
      border-radius: 8px;
    }

    .loading, .empty {
      text-align: center;
      padding: 20px;
      color: #7f8c8d;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }

    .table thead {
      background-color: #34495e;
      color: white;
    }

    .table th, .table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ecf0f1;
    }

    .table tbody tr:hover {
      background-color: #f9f9f9;
    }
  `]
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  loading = false;
  newEmployee: Employee = {
    employee_id: '',
    full_name: '',
    email: '',
    department: ''
  };
  errorMessage = '';
  successMessage = '';

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.loading = true;
    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading employees:', error);
        this.loading = false;
      }
    });
  }

  addEmployee() {
    this.errorMessage = '';
    this.successMessage = '';

    // Frontend validation - check for empty fields
    if (!this.newEmployee.employee_id?.trim()) {
      this.errorMessage = '❌ Employee ID is required';
      return;
    }
    if (!this.newEmployee.full_name?.trim()) {
      this.errorMessage = '❌ Full Name is required';
      return;
    }
    if (!this.newEmployee.email?.trim()) {
      this.errorMessage = '❌ Email is required';
      return;
    }
    if (!this.newEmployee.department?.trim()) {
      this.errorMessage = '❌ Department is required';
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.newEmployee.email)) {
      this.errorMessage = '❌ Please enter a valid email address (e.g., user@example.com)';
      return;
    }

    // Check if all fields are identical (suspicious test data)
    const id = this.newEmployee.employee_id.toLowerCase().trim();
    const name = this.newEmployee.full_name.toLowerCase().trim();
    const email = this.newEmployee.email.toLowerCase().trim();
    const dept = this.newEmployee.department.toLowerCase().trim();

    if (id === name && name === email && email === dept) {
      this.errorMessage = '❌ All fields cannot have the same value. Please provide valid employee information.';
      return;
    }

    // Check length constraints
    if (this.newEmployee.employee_id.length > 50) {
      this.errorMessage = '❌ Employee ID cannot exceed 50 characters';
      return;
    }
    if (this.newEmployee.full_name.length > 100) {
      this.errorMessage = '❌ Full Name cannot exceed 100 characters';
      return;
    }
    if (this.newEmployee.department.length > 50) {
      this.errorMessage = '❌ Department cannot exceed 50 characters';
      return;
    }

    this.employeeService.createEmployee(this.newEmployee).subscribe({
      next: () => {
        this.successMessage = '✅ Employee added successfully!';
        this.newEmployee = {
          employee_id: '',
          full_name: '',
          email: '',
          department: ''
        };
        this.loadEmployees();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        // Handle specific backend error messages
        const detail = error.error?.detail;
        if (typeof detail === 'string') {
          if (detail.includes('already exists')) {
            this.errorMessage = `❌ ${detail}`;
          } else if (detail.includes('already registered')) {
            this.errorMessage = `❌ ${detail}`;
          } else if (detail.includes('All fields')) {
            this.errorMessage = `❌ ${detail}`;
          } else {
            this.errorMessage = `❌ ${detail}`;
          }
        } else if (Array.isArray(detail)) {
          // Handle Pydantic validation errors
          const errors = detail.map((err: any) => {
            const field = err.loc?.[1] || 'field';
            const msg = err.msg || 'Invalid input';
            if (field === 'email') {
              return `❌ Invalid email format: ${msg}`;
            } else if (field === 'employee_id') {
              return `❌ Invalid Employee ID: ${msg}`;
            } else {
              return `❌ ${field}: ${msg}`;
            }
          }).join('\n');
          this.errorMessage = errors;
        } else {
          this.errorMessage = '❌ Error adding employee. Please try again.';
        }
      }
    });
  }

  deleteEmployee(employeeId: string) {
    if (confirm('Are you sure you want to delete this employee? This will also delete all their attendance records.')) {
      this.employeeService.deleteEmployee(employeeId).subscribe({
        next: (response) => {
          this.successMessage = `✅ ${response.message || 'Employee deleted successfully'} (${response.deleted_attendance_records} attendance records removed)`;
          this.loadEmployees();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          const detail = error.error?.detail;
          if (detail?.includes('not found')) {
            this.errorMessage = `❌ ${detail}`;
          } else {
            this.errorMessage = `❌ ${detail || 'Error deleting employee. Please try again.'}`;
          }
          console.error('Delete error:', error);
        }
      });
    }
  }
}
