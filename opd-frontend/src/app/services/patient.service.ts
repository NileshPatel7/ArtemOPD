import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient } from '../models/patient.model';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private base = 'http://localhost:8080/api/patients';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.base);
  }

  search(query: string): Observable<Patient[]> {
    const params = new HttpParams().set('query', query);
    return this.http.get<Patient[]>(`${this.base}/search`, { params });
  }

  getById(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.base}/${id}`);
  }

  create(patient: Patient): Observable<Patient> {
    return this.http.post<Patient>(this.base, patient);
  }

  update(id: number, patient: Patient): Observable<Patient> {
    return this.http.put<Patient>(`${this.base}/${id}`, patient);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
