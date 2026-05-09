import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Consultation } from '../../models/consultation.model';
import { Appointment } from '../../models/appointment.model';
import { Patient } from '../../models/patient.model';
import { ConsultationService } from '../../services/consultation.service';
import { AppointmentService } from '../../services/appointment.service';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-consultations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <!-- Stats Row -->
      <div class="grid grid-3 stats-row">
        <div class="stat-card primary">
          <div class="stat-label">Total Consultations</div>
          <div class="stat-value">{{ allConsultations().length }}</div>
          <div class="stat-icon">🩺</div>
        </div>
        <div class="stat-card success">
          <div class="stat-label">Pending Appointments</div>
          <div class="stat-value">{{ pendingAppointments().length }}</div>
          <div class="stat-icon">⏰</div>
        </div>
        <div class="stat-card accent">
          <div class="stat-label">Patients with Records</div>
          <div class="stat-value">{{ uniquePatients() }}</div>
          <div class="stat-icon">👥</div>
        </div>
      </div>

      <div class="content-layout">
        <!-- Consultation Form -->
        <div class="card form-card">
          <div class="card-header">
            <div>
              <h2 class="card-title">🩺 New Consultation</h2>
              <p class="card-subtitle">Record vitals and clinical notes</p>
            </div>
          </div>
          <div class="card-body">
            @if (successMsg()) {
              <div class="alert alert-success" style="margin-bottom:16px">✅ {{ successMsg() }}</div>
            }
            @if (errorMsg()) {
              <div class="alert alert-error" style="margin-bottom:16px">❌ {{ errorMsg() }}</div>
            }

            <form #consultForm="ngForm" (ngSubmit)="onSubmit(consultForm)" class="form-layout">
              <div class="form-group">
                <label class="form-label">Appointment *</label>
                <select
                  class="form-control"
                  name="appointmentId"
                  [(ngModel)]="formData.appointmentId"
                  required
                  id="select-appointment"
                  (ngModelChange)="onAppointmentSelect($event)"
                  #apptCtrl="ngModel"
                >
                  <option value="" disabled selected>Select appointment</option>
                  @for (a of pendingAppointments(); track a.id) {
                    <option [value]="a.id">
                      #{{ a.id }} — {{ a.patientName || 'Patient #' + a.patientId }} @ {{ formatTime(a.dateTime) }}
                    </option>
                  }
                </select>
                @if (apptCtrl.invalid && apptCtrl.touched) {
                  <div class="form-error">Please select an appointment</div>
                }
              </div>

              @if (selectedAppointment()) {
                <div class="selected-appt-info">
                  <div class="info-row">
                    <span class="info-label">👨‍⚕️ Doctor</span>
                    <span>{{ selectedAppointment()!.doctorName }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">📅 Scheduled</span>
                    <span>{{ formatDateTime(selectedAppointment()!.dateTime) }}</span>
                  </div>
                </div>
              }

              <div class="vitals-section">
                <div class="vitals-header">
                  <span class="vitals-icon">❤️</span>
                  <h3 class="vitals-title">Vitals</h3>
                </div>
                <div class="grid grid-2" style="gap:14px">
                  <div class="form-group">
                    <label class="form-label">Blood Pressure *</label>
                    <input
                      class="form-control"
                      name="bloodPressure"
                      [(ngModel)]="formData.bloodPressure"
                      required
                      placeholder="e.g. 120/80 mmHg"
                      id="input-bp"
                      #bpCtrl="ngModel"
                    />
                    @if (bpCtrl.invalid && bpCtrl.touched) {
                      <div class="form-error">Required</div>
                    }
                  </div>
                  <div class="form-group">
                    <label class="form-label">Temperature *</label>
                    <input
                      class="form-control"
                      name="temperature"
                      [(ngModel)]="formData.temperature"
                      required
                      placeholder="e.g. 98.6°F"
                      id="input-temp"
                      #tempCtrl="ngModel"
                    />
                    @if (tempCtrl.invalid && tempCtrl.touched) {
                      <div class="form-error">Required</div>
                    }
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Clinical Notes *</label>
                <textarea
                  class="form-control"
                  name="notes"
                  [(ngModel)]="formData.notes"
                  required
                  minlength="5"
                  placeholder="Symptoms, diagnosis, prescription, follow-up instructions..."
                  id="input-notes"
                  rows="4"
                  #notesCtrl="ngModel"
                ></textarea>
                @if (notesCtrl.invalid && notesCtrl.touched) {
                  <div class="form-error">Please enter clinical notes (min 5 chars)</div>
                }
              </div>

              <button type="submit" class="btn btn-primary btn-block btn-lg" [disabled]="consultForm.invalid || loading()">
                @if (loading()) { ⏳ Saving... }
                @else { ✅ Mark Consultation Complete }
              </button>
            </form>
          </div>
        </div>

        <!-- Records Panel -->
        <div class="right-panel">
          <!-- Patient Filter -->
          <div class="card">
            <div class="card-header">
              <div>
                <h2 class="card-title">🗂️ Consultation History</h2>
                <p class="card-subtitle">{{ filteredConsultations().length }} records</p>
              </div>
              <select class="form-control" style="width:200px" [(ngModel)]="selectedPatientId" (ngModelChange)="filterByPatient($event)" id="filter-patient">
                <option value="">All Patients</option>
                @for (p of patients(); track p.id) {
                  <option [value]="p.id">{{ p.name }}</option>
                }
              </select>
            </div>
            <div class="table-wrapper">
              @if (loadingList()) {
                <div class="empty-state">
                  <div class="icon pulse">⏳</div>
                  <h3>Loading records...</h3>
                </div>
              } @else if (filteredConsultations().length === 0) {
                <div class="empty-state">
                  <div class="icon">🩺</div>
                  <h3>No consultations found</h3>
                  <p>Complete a consultation to see records here</p>
                </div>
              } @else {
                @for (c of filteredConsultations(); track c.id) {
                  <div class="consultation-card">
                    <div class="consult-header">
                      <div class="consult-patient">
                        <div class="patient-avatar-sm">{{ (c.patientName || 'P').charAt(0).toUpperCase() }}</div>
                        <div>
                          <div class="consult-name">{{ c.patientName || 'Patient #' + c.appointmentId }}</div>
                          <div class="consult-meta">Appt #{{ c.appointmentId }} · {{ c.doctorName || 'Dr.' }}</div>
                        </div>
                      </div>
                      <span class="badge badge-success">✅ Completed</span>
                    </div>
                    <div class="vitals-display">
                      <div class="vital-chip">
                        <span class="vital-icon">❤️</span>
                        <span class="vital-label">BP</span>
                        <span class="vital-val">{{ c.bloodPressure }}</span>
                      </div>
                      <div class="vital-chip">
                        <span class="vital-icon">🌡️</span>
                        <span class="vital-label">Temp</span>
                        <span class="vital-val">{{ c.temperature }}</span>
                      </div>
                    </div>
                    <div class="consult-notes">
                      <div class="notes-label">📝 Notes</div>
                      <div class="notes-text">{{ c.notes }}</div>
                    </div>
                    @if (c.createdAt) {
                      <div class="consult-time">🕐 {{ formatDateTime(c.createdAt) }}</div>
                    }
                  </div>
                }
              }
            </div>
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

    .content-layout {
      display: grid;
      grid-template-columns: 420px 1fr;
      gap: 20px;
      align-items: start;
    }

    .card-title { font-size: 16px; font-weight: 600; }
    .card-subtitle { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
    .form-layout { display: flex; flex-direction: column; gap: 16px; }

    .selected-appt-info {
      background: var(--bg-elevated);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 12px 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .info-row {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 13px;
    }

    .info-label {
      color: var(--text-muted);
      font-size: 12px;
      min-width: 100px;
    }

    .vitals-section {
      background: var(--bg-elevated);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 16px;
    }

    .vitals-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 14px;
    }

    .vitals-icon { font-size: 18px; }
    .vitals-title { font-size: 14px; font-weight: 600; color: var(--danger); }

    /* Consultation Cards */
    .consultation-card {
      padding: 16px 20px;
      border-bottom: 1px solid var(--border-light);
      display: flex;
      flex-direction: column;
      gap: 12px;
      transition: var(--transition);
    }

    .consultation-card:last-child { border-bottom: none; }
    .consultation-card:hover { background: var(--bg-elevated); }

    .consult-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .consult-patient {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .patient-avatar-sm {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 700;
      color: #000;
      flex-shrink: 0;
    }

    .consult-name { font-size: 14px; font-weight: 600; }
    .consult-meta { font-size: 11px; color: var(--text-muted); margin-top: 2px; }

    .vitals-display {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .vital-chip {
      display: flex;
      align-items: center;
      gap: 6px;
      background: var(--bg-elevated);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 6px 12px;
      font-size: 12px;
    }

    .vital-icon { font-size: 14px; }
    .vital-label { color: var(--text-muted); }
    .vital-val { font-weight: 600; color: var(--text-primary); }

    .consult-notes {
      background: var(--bg-elevated);
      border-radius: var(--radius-sm);
      padding: 10px 12px;
    }

    .notes-label { font-size: 11px; font-weight: 600; color: var(--text-muted); margin-bottom: 6px; text-transform: uppercase; }
    .notes-text { font-size: 13px; color: var(--text-secondary); line-height: 1.6; }

    .consult-time { font-size: 11px; color: var(--text-muted); }

    .right-panel { display: flex; flex-direction: column; gap: 16px; }

    @media (max-width: 1100px) {
      .content-layout { grid-template-columns: 1fr; }
    }
  `]
})
export class ConsultationsComponent implements OnInit {
  allConsultations = signal<Consultation[]>([]);
  filteredConsultations = signal<Consultation[]>([]);
  pendingAppointments = signal<Appointment[]>([]);
  patients = signal<Patient[]>([]);
  loading = signal(false);
  loadingList = signal(false);
  successMsg = signal('');
  errorMsg = signal('');
  selectedPatientId = '';
  selectedAppointment = signal<Appointment | null>(null);

  formData: Partial<Consultation> = this.emptyForm();

  constructor(
    private consultationService: ConsultationService,
    private appointmentService: AppointmentService,
    private patientService: PatientService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loadingList.set(true);

    this.patientService.getAll().subscribe(p => this.patients.set(p));

    this.appointmentService.getAll().subscribe(appts => {
      const pending = appts.filter(a => a.status === 'SCHEDULED' || !a.status);
      this.pendingAppointments.set(pending);
    });

    this.consultationService.getAll().subscribe({
      next: (c) => {
        this.allConsultations.set(c);
        this.filteredConsultations.set(c);
        this.loadingList.set(false);
      },
      error: () => {
        this.loadingList.set(false);
        this.errorMsg.set('Failed to load consultations.');
        setTimeout(() => this.errorMsg.set(''), 4000);
      }
    });
  }

  onAppointmentSelect(apptId: number) {
    const appt = this.pendingAppointments().find(a => a.id === +apptId);
    this.selectedAppointment.set(appt || null);
  }

  filterByPatient(patientId: string) {
    if (!patientId) {
      this.filteredConsultations.set(this.allConsultations());
      return;
    }
    this.consultationService.getByPatient(+patientId).subscribe({
      next: (c) => this.filteredConsultations.set(c),
      error: () => {
        const all = this.allConsultations();
        this.filteredConsultations.set(all.filter(c => c.patientId === +patientId));
      }
    });
  }

  onSubmit(form: NgForm) {
    if (form.invalid) return;
    this.loading.set(true);
    this.consultationService.create(this.formData as Consultation).subscribe({
      next: () => {
        this.successMsg.set('Consultation saved and marked complete!');
        setTimeout(() => this.successMsg.set(''), 3000);
        this.loading.set(false);
        this.formData = this.emptyForm();
        this.selectedAppointment.set(null);
        form.resetForm();
        this.loadData();
      },
      error: () => {
        this.errorMsg.set('Failed to save consultation.');
        setTimeout(() => this.errorMsg.set(''), 4000);
        this.loading.set(false);
      }
    });
  }

  uniquePatients(): number {
    const ids = new Set(this.allConsultations().map(c => c.patientId || c.appointmentId));
    return ids.size;
  }

  formatDateTime(dt: string): string {
    if (!dt) return '-';
    return new Date(dt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  }

  formatTime(dt: string): string {
    if (!dt) return '-';
    return new Date(dt).toLocaleTimeString('en-IN', { timeStyle: 'short' });
  }

  emptyForm(): Partial<Consultation> {
    return { appointmentId: undefined, bloodPressure: '', temperature: '', notes: '' };
  }
}
