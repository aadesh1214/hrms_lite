import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Employee {
  id?: string;
  employee_id: string;
  full_name: string;
  email: string;
  department: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = `${this.getApiUrl()}/api/employees/`;

  private getApiUrl(): string {
    return (window as any).__env__?.['NG_APP_API_URL'] || 'http://localhost:8000';
  }

  constructor(private http: HttpClient) {}

  createEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee);
  }

  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  getEmployee(employeeId: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${employeeId}`);
  }

  deleteEmployee(employeeId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${employeeId}`);
  }
}
