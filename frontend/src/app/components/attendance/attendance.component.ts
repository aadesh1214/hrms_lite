import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AttendanceService, Attendance } from '../../services/attendance.service';
import { EmployeeService, Employee } from '../../services/employee.service';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>Attendance Management</h2>

      <div class="form-section">
        <h3>Mark Attendance</h3>
        <form (ngSubmit)="markAttendance()" class="attendance-form">
          <select
            [(ngModel)]="newAttendance.employee_id"
            name="employee_id"
            required
          >
            <option value="">Select Employee</option>
            <option *ngFor="let emp of employees" [value]="emp.employee_id">
              {{ emp.full_name }} ({{ emp.employee_id }})
            </option>
          </select>
          <input
            [(ngModel)]="newAttendance.date"
            name="date"
            type="date"
            required
          />
          <select
            [(ngModel)]="newAttendance.status"
            name="status"
            required
          >
            <option value="">Select Status</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
          <button type="submit" class="btn btn-primary">Mark Attendance</button>
        </form>
        <p *ngIf="errorMessage" class="error">{{ errorMessage }}</p>
        <p *ngIf="successMessage" class="success">{{ successMessage }}</p>
      </div>

      <div class="attendance-section">
        <h3>Attendance Records</h3>
        <div *ngIf="loadingAttendance" class="loading">Loading records...</div>
        <div *ngIf="!loadingAttendance && attendanceRecords.length === 0" class="empty">
          No attendance records found.
        </div>
        <table *ngIf="!loadingAttendance && attendanceRecords.length > 0" class="table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Employee Name</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let record of attendanceRecords">
              <td>{{ record.employee_id }}</td>
              <td>{{ getEmployeeName(record.employee_id) }}</td>
              <td>{{ record.date }}</td>
              <td>
                <span [class]="record.status === 'Present' ? 'badge-present' : 'badge-absent'">
                  {{ record.status }}
                </span>
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

    .attendance-form {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 15px;
    }

    select, input {
      padding: 10px;
      border: 1px solid #bdc3c7;
      border-radius: 4px;
      font-size: 14px;
    }

    select:focus, input:focus {
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

    .error {
      color: #e74c3c;
      margin-top: 10px;
    }

    .success {
      color: #27ae60;
      margin-top: 10px;
    }

    .attendance-section {
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

    .badge-present {
      background-color: #27ae60;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
    }

    .badge-absent {
      background-color: #e74c3c;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
    }
  `]
})
export class AttendanceComponent implements OnInit {
  attendanceRecords: Attendance[] = [];
  employees: Employee[] = [];
  loadingAttendance = false;
  newAttendance: Attendance = {
    employee_id: '',
    date: '',
    status: 'Present'
  };
  errorMessage = '';
  successMessage = '';

  constructor(
    private attendanceService: AttendanceService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit() {
    this.loadEmployees();
    this.loadAttendance();
  }

  loadEmployees() {
    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data;
      },
      error: (error) => {
        console.error('Error loading employees:', error);
      }
    });
  }

  loadAttendance() {
    this.loadingAttendance = true;
    this.attendanceService.getAllAttendance().subscribe({
      next: (data) => {
        this.attendanceRecords = data;
        this.loadingAttendance = false;
      },
      error: (error) => {
        console.error('Error loading attendance:', error);
        this.loadingAttendance = false;
      }
    });
  }

  markAttendance() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.newAttendance.employee_id || !this.newAttendance.date ||
        !this.newAttendance.status) {
      this.errorMessage = 'All fields are required';
      return;
    }

    this.attendanceService.markAttendance(this.newAttendance).subscribe({
      next: () => {
        this.successMessage = 'Attendance marked successfully';
        this.newAttendance = {
          employee_id: '',
          date: '',
          status: 'Present'
        };
        this.loadAttendance();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.errorMessage = error.error?.detail || 'Error marking attendance';
      }
    });
  }

  getEmployeeName(employeeId: string): string {
    const employee = this.employees.find(e => e.employee_id === employeeId);
    return employee ? employee.full_name : employeeId;
  }
}
