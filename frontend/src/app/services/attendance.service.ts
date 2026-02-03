import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Attendance {
  id?: string;
  employee_id: string;
  date: string;
  status: 'Present' | 'Absent';
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private apiUrl = `${this.getApiUrl()}/api/attendance/`;

  private getApiUrl(): string {
    return (window as any).__env__?.['NG_APP_API_URL'] || 'http://localhost:8000';
  }

  constructor(private http: HttpClient) {}

  markAttendance(attendance: Attendance): Observable<Attendance> {
    return this.http.post<Attendance>(this.apiUrl, attendance);
  }

  getEmployeeAttendance(employeeId: string): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${this.apiUrl}/${employeeId}`);
  }

  getAllAttendance(): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(this.apiUrl);
  }
}
