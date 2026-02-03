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

    // Frontend validation - check required fields
    if (!this.newAttendance.employee_id?.trim()) {
      this.errorMessage = '❌ Please select an employee';
      return;
    }

    if (!this.newAttendance.date?.trim()) {
      this.errorMessage = '❌ Please select a date';
      return;
    }

    if (!this.newAttendance.status?.trim()) {
      this.errorMessage = '❌ Please select a status (Present or Absent)';
      return;
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(this.newAttendance.date)) {
      this.errorMessage = '❌ Invalid date format. Please use YYYY-MM-DD format';
      return;
    }

    // Check if date is in future
    const selectedDate = new Date(this.newAttendance.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate > today) {
      this.errorMessage = '❌ Attendance date cannot be in the future. Please select today or an earlier date.';
      return;
    }

    // Check if date is too old (more than 5 years)
    const fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
    fiveYearsAgo.setHours(0, 0, 0, 0);
    
    if (selectedDate < fiveYearsAgo) {
      this.errorMessage = '❌ Attendance date cannot be more than 5 years in the past';
      return;
    }

    // Validate status is Present or Absent
    if (!['Present', 'Absent'].includes(this.newAttendance.status)) {
      this.errorMessage = '❌ Status must be either "Present" or "Absent"';
      return;
    }

    this.attendanceService.markAttendance(this.newAttendance).subscribe({
      next: () => {
        this.successMessage = `✅ Attendance marked successfully for ${this.getEmployeeName(this.newAttendance.employee_id)} on ${this.newAttendance.date}`;
        this.newAttendance = {
          employee_id: '',
          date: '',
          status: 'Present'
        };
        this.loadAttendance();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        const detail = error.error?.detail;
        
        // Handle specific error messages
        if (typeof detail === 'string') {
          if (detail.includes('not found')) {
            this.errorMessage = `❌ Employee not found. Please select a valid employee.`;
          } else if (detail.includes('future')) {
            this.errorMessage = `❌ Cannot mark attendance for future dates`;
          } else if (detail.includes('5 years')) {
            this.errorMessage = `❌ Cannot mark attendance for dates older than 5 years`;
          } else if (detail.includes('already marked')) {
            this.errorMessage = `❌ Attendance already marked for this date. Cannot mark twice for the same date.`;
          } else if (detail.includes('Status must be')) {
            this.errorMessage = `❌ Invalid status. Only "Present" or "Absent" allowed`;
          } else if (detail.includes('YYYY-MM-DD')) {
            this.errorMessage = `❌ Invalid date format. Please use YYYY-MM-DD`;
          } else {
            this.errorMessage = `❌ ${detail}`;
          }
        } else if (Array.isArray(detail)) {
          // Handle Pydantic validation errors
          const errors = detail.map((err: any) => {
            const field = err.loc?.[1] || 'field';
            const msg = err.msg || 'Invalid input';
            if (field === 'date') {
              return `❌ Invalid date: ${msg}`;
            } else if (field === 'employee_id') {
              return `❌ Invalid employee: ${msg}`;
            } else if (field === 'status') {
              return `❌ Invalid status: ${msg}`;
            } else {
              return `❌ ${field}: ${msg}`;
            }
          }).join('\n');
          this.errorMessage = errors;
        } else {
          this.errorMessage = '❌ Error marking attendance. Please try again.';
        }
        console.error('Attendance error:', error);
      }
    });
  }

  getEmployeeName(employeeId: string): string {
    const employee = this.employees.find(e => e.employee_id === employeeId);
    return employee ? employee.full_name : employeeId;
  }
}
