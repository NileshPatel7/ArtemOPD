import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Consultation } from '../models/consultation.model';

@Injectable({ providedIn: 'root' })
export class ConsultationService {
  private base = 'http://localhost:8080/api/consultations';

  constructor(private http: HttpClient) {}

  create(consultation: Consultation): Observable<Consultation> {
    return this.http.post<Consultation>(this.base, consultation);
  }

  getByPatient(patientId: number): Observable<Consultation[]> {
    return this.http.get<Consultation[]>(`${this.base}/patient/${patientId}`);
  }

  getByAppointment(appointmentId: number): Observable<Consultation> {
    return this.http.get<Consultation>(`${this.base}/appointment/${appointmentId}`);
  }

  getAll(): Observable<Consultation[]> {
    return this.http.get<Consultation[]>(this.base);
  }
}
