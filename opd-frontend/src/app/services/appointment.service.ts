import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from '../models/appointment.model';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private base = 'http://localhost:8080/api/appointments';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.base);
  }

  getToday(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.base}/today`);
  }

  getByPatient(patientId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.base}/patient/${patientId}`);
  }

  create(appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(this.base, appointment);
  }

  update(id: number, appointment: Appointment): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.base}/${id}`, appointment);
  }

  cancel(id: number): Observable<Appointment> {
    return this.http.patch<Appointment>(`${this.base}/${id}/cancel`, {});
  }
}
