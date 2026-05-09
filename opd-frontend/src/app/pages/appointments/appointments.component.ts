import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Appointment } from '../../models/appointment.model';
import { Patient } from '../../models/patient.model';
import { AppointmentService } from '../../services/appointment.service';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <!-- Stats -->
      <div class="grid grid-4 stats-row">
        <div class="stat-card primary">
          <div class="stat-label">Today's Appointments</div>
          <div class="stat-value">{{ todayAppointments().length }}</div>
          <div class="stat-icon">📅</div>
        </div>
        <div class="stat-card success">
          <div class="stat-label">Completed</div>
          <div class="stat-value">{{ statusCount('COMPLETED') }}</div>
          <div class="stat-icon">✅</div>
        </div>
        <div class="stat-card accent">
          <div class="stat-label">Scheduled</div>
          <div class="stat-value">{{ statusCount('SCHEDULED') }}</div>
          <div class="stat-icon">⏰</div>
        </div>
        <div class="stat-card warning">
          <div class="stat-label">Cancelled</div>
          <div class="stat-value">{{ statusCount('CANCELLED') }}</div>
          <div class="stat-icon">❌</div>
        </div>
      </div>

      <div class="content-grid">
        <!-- Booking Form -->
        <div class="card form-card">
          <div class="card-header">
            <div>
              <h2 class="card-title">📅 Book Appointment</h2>
              <p class="card-subtitle">Schedule a doctor visit</p>
            </div>
          </div>
          <div class="card-body">
            @if (successMsg()) {
              <div class="alert alert-success" style="margin-bottom:16px">✅ {{ successMsg() }}</div>
            }
            @if (errorMsg()) {
              <div class="alert alert-error" style="margin-bottom:16px">❌ {{ errorMsg() }}</div>
            }
            <form #apptForm="ngForm" (ngSubmit)="onSubmit(apptForm)" class="form-layout">
              <div class="form-group">
                <label class="form-label">Patient *</label>
                <select class="form-control" name="patientId" [(ngModel)]="formData.patientId" required id="select-patient" #patCtrl="ngModel">
                  <option value="" disabled selected>Select patient</option>
                  @for (p of patients(); track p.id) {
                    <option [value]="p.id">{{ p.name }} — {{ p.phone }}</option>
                  }
                </select>
                @if (patCtrl.invalid && patCtrl.touched) {
                  <div class="form-error">Please select a patient</div>
                }
              </div>

              <div class="form-group">
                <label class="form-label">Doctor *</label>
                <select class="form-control" name="doctorName" [(ngModel)]="formData.doctorName" required id="select-doctor" #docCtrl="ngModel">
                  <option value="" disabled selected>Select doctor</option>
                  @for (d of doctors; track d) {
                    <option [value]="d">{{ d }}</option>
                  }
                </select>
                @if (docCtrl.invalid && docCtrl.touched) {
                  <div class="form-error">Please select a doctor</div>
                }
              </div>

              <div class="form-group">
                <label class="form-label">Date &amp; Time *</label>
                <input
                  class="form-control"
                  type="datetime-local"
                  name="dateTime"
                  [(ngModel)]="formData.dateTime"
                  required
                  id="input-datetime"
                  [min]="minDateTime"
                  #dtCtrl="ngModel"
                />
                @if (dtCtrl.invalid && dtCtrl.touched) {
                  <div class="form-error">Date &amp; time is required</div>
                }
              </div>

              <button type="submit" class="btn btn-primary btn-block" [disabled]="apptForm.invalid || loading()">
                @if (loading()) { ⏳ Booking... }
                @else { 📅 Book Appointment }
              </button>
            </form>
          </div>
        </div>

        <!-- Today's Appointments -->
        <div class="card list-card">
          <div class="card-header">
            <div>
              <h2 class="card-title">📋 Today's Schedule</h2>
              <p class="card-subtitle">{{ todayDate }}</p>
            </div>
            <div class="tab-group">
              <button class="tab-btn" [class.active]="viewMode() === 'today'" (click)="setView('today')">
                Today
              </button>
              <button class="tab-btn" [class.active]="viewMode() === 'all'" (click)="setView('all')">
                All
              </button>
            </div>
          </div>
          <div class="table-wrapper">
            @if (loadingList()) {
              <div class="empty-state">
                <div class="icon pulse">⏳</div>
                <h3>Loading appointments...</h3>
              </div>
            } @else if (activeAppointments().length === 0) {
              <div class="empty-state">
                <div class="icon">📅</div>
                <h3>No appointments {{ viewMode() === 'today' ? 'today' : 'found' }}</h3>
                <p>Book an appointment using the form on the left</p>
              </div>
            } @else {
              <table class="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Date &amp; Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (appt of activeAppointments(); track appt.id) {
                    <tr>
                      <td><span class="badge badge-muted">{{ appt.id }}</span></td>
                      <td>
                        <div style="font-weight:500">{{ appt.patientName || 'Patient #' + appt.patientId }}</div>
                      </td>
                      <td>
                        <div class="doctor-cell">
                          <span class="doc-icon">👨‍⚕️</span> {{ appt.doctorName }}
                        </div>
                      </td>
                      <td class="text-muted">{{ formatDateTime(appt.dateTime) }}</td>
                      <td>
                        <span class="badge" [ngClass]="{
                          'badge-accent': appt.status === 'SCHEDULED',
                          'badge-success': appt.status === 'COMPLETED',
                          'badge-danger': appt.status === 'CANCELLED'
                        }">{{ appt.status || 'SCHEDULED' }}</span>
                      </td>
                      <td>
                        @if (appt.status !== 'CANCELLED' && appt.status !== 'COMPLETED') {
                          <button class="btn btn-danger btn-sm" (click)="cancelAppt(appt)" title="Cancel">❌ Cancel</button>
                        }
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 84px 24px 24px;
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .stats-row { margin-bottom: 4px; }

    .content-grid {
      display: grid;
      grid-template-columns: 360px 1fr;
      gap: 20px;
      align-items: start;
    }

    .card-title { font-size: 16px; font-weight: 600; }
    .card-subtitle { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
    .form-layout { display: flex; flex-direction: column; gap: 16px; }

    .doctor-cell { display: flex; align-items: center; gap: 6px; }
    .doc-icon { font-size: 16px; }

    .tab-group {
      display: flex;
      background: var(--bg-elevated);
      border-radius: var(--radius-md);
      padding: 3px;
      gap: 2px;
    }

    .tab-btn {
      padding: 5px 14px;
      border-radius: var(--radius-sm);
      border: none;
      background: transparent;
      color: var(--text-secondary);
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      font-family: inherit;
      transition: var(--transition);
    }

    .tab-btn.active {
      background: var(--primary);
      color: #000;
      font-weight: 600;
    }

    @media (max-width: 1024px) {
      .content-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class AppointmentsComponent implements OnInit {
  todayAppointments = signal<Appointment[]>([]);
  allAppointmentsData = signal<Appointment[]>([]);
  activeAppointments = signal<Appointment[]>([]);
  patients = signal<Patient[]>([]);
  loading = signal(false);
  loadingList = signal(false);
  successMsg = signal('');
  errorMsg = signal('');
  viewMode = signal<'today' | 'all'>('today');

  formData: Partial<Appointment> = this.emptyForm();
  todayDate = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  minDateTime = new Date().toISOString().slice(0, 16);

  doctors = [
    'Dr. Anil Sharma',
    'Dr. Priya Mehta',
    'Dr. Ramesh Kumar',
    'Dr. Sunita Patel',
    'Dr. Vikram Singh'
  ];

  constructor(
    private appointmentService: AppointmentService,
    private patientService: PatientService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loadingList.set(true);
    this.patientService.getAll().subscribe(p => this.patients.set(p));

    this.appointmentService.getToday().subscribe({
      next: (appts) => {
        this.todayAppointments.set(appts);
        this.activeAppointments.set(appts);
        this.loadingList.set(false);
      },
      error: () => {
        this.loadingList.set(false);
        this.errorMsg.set('Failed to load appointments.');
        setTimeout(() => this.errorMsg.set(''), 4000);
      }
    });

    this.appointmentService.getAll().subscribe(all => this.allAppointmentsData.set(all));
  }

  setView(mode: 'today' | 'all') {
    this.viewMode.set(mode);
    this.activeAppointments.set(mode === 'today' ? this.todayAppointments() : this.allAppointmentsData());
  }

  onSubmit(form: NgForm) {
    if (form.invalid) return;
    this.loading.set(true);
    this.appointmentService.create(this.formData as Appointment).subscribe({
      next: () => {
        this.successMsg.set('Appointment booked successfully!');
        setTimeout(() => this.successMsg.set(''), 3000);
        this.loading.set(false);
        this.formData = this.emptyForm();
        form.resetForm();
        this.loadData();
      },
      error: () => {
        this.errorMsg.set('Booking failed. Try again.');
        setTimeout(() => this.errorMsg.set(''), 4000);
        this.loading.set(false);
      }
    });
  }

  cancelAppt(appt: Appointment) {
    if (!appt.id) return;
    this.appointmentService.cancel(appt.id).subscribe({
      next: () => this.loadData(),
      error: () => {
        this.errorMsg.set('Cancel failed.');
        setTimeout(() => this.errorMsg.set(''), 3000);
      }
    });
  }

  formatDateTime(dt: string): string {
    if (!dt) return '-';
    return new Date(dt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  }

  statusCount(status: string): number {
    return this.allAppointmentsData().filter(a => (a.status || 'SCHEDULED') === status).length;
  }

  emptyForm(): Partial<Appointment> {
    return { patientId: undefined, doctorName: '', dateTime: '' };
  }
}
