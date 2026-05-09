import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { AppointmentService } from '../../services/appointment.service';
import { ConsultationService } from '../../services/consultation.service';
import { Appointment } from '../../models/appointment.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-container">
      <!-- Hero -->
      <div class="hero-section">
        <div class="hero-content">
          <div class="hero-badge">🏥 MediCare OPD System</div>
          <h1 class="hero-title">Welcome back, <span class="hero-name">Dr. Admin</span></h1>
          <p class="hero-sub">{{ todayDate }}</p>
        </div>
        <div class="hero-illustration">🩺</div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-4">
        <div class="stat-card primary" style="cursor:pointer" routerLink="/patients">
          <div class="stat-label">Total Patients</div>
          <div class="stat-value">{{ totalPatients() }}</div>
          <div class="stat-trend">+{{ newToday }} registered today</div>
          <div class="stat-icon">👥</div>
        </div>
        <div class="stat-card accent" style="cursor:pointer" routerLink="/appointments">
          <div class="stat-label">Today's Appointments</div>
          <div class="stat-value">{{ todayAppts().length }}</div>
          <div class="stat-trend">{{ scheduledCount() }} scheduled</div>
          <div class="stat-icon">📅</div>
        </div>
        <div class="stat-card success" style="cursor:pointer" routerLink="/consultations">
          <div class="stat-label">Consultations Done</div>
          <div class="stat-value">{{ completedConsultations() }}</div>
          <div class="stat-trend">Today's completions</div>
          <div class="stat-icon">✅</div>
        </div>
        <div class="stat-card warning">
          <div class="stat-label">Pending Consults</div>
          <div class="stat-value">{{ pendingConsults() }}</div>
          <div class="stat-trend">Awaiting doctor</div>
          <div class="stat-icon">⏳</div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="section-header">
        <h2 class="section-title">⚡ Quick Actions</h2>
      </div>
      <div class="quick-actions">
        <a routerLink="/patients" class="quick-card primary">
          <div class="quick-icon">👤</div>
          <div class="quick-label">Register Patient</div>
          <div class="quick-desc">Add a new patient record</div>
          <div class="quick-arrow">→</div>
        </a>
        <a routerLink="/appointments" class="quick-card accent">
          <div class="quick-icon">📅</div>
          <div class="quick-label">Book Appointment</div>
          <div class="quick-desc">Schedule a doctor visit</div>
          <div class="quick-arrow">→</div>
        </a>
        <a routerLink="/consultations" class="quick-card success">
          <div class="quick-icon">🩺</div>
          <div class="quick-label">Start Consultation</div>
          <div class="quick-desc">Enter vitals and notes</div>
          <div class="quick-arrow">→</div>
        </a>
      </div>

      <!-- Today's Schedule -->
      <div class="section-header">
        <h2 class="section-title">📋 Today's Schedule</h2>
        <a routerLink="/appointments" class="btn btn-outline btn-sm">View All →</a>
      </div>

      <div class="card">
        @if (loadingToday()) {
          <div class="empty-state" style="padding:40px">
            <div class="icon pulse">⏳</div>
            <h3>Loading schedule...</h3>
          </div>
        } @else if (todayAppts().length === 0) {
          <div class="empty-state" style="padding:40px">
            <div class="icon">📅</div>
            <h3>No appointments today</h3>
            <p>Book appointments to see them here</p>
          </div>
        } @else {
          <div class="schedule-list">
            @for (appt of todayAppts().slice(0, 5); track appt.id) {
              <div class="schedule-item">
                <div class="schedule-time">{{ formatTime(appt.dateTime) }}</div>
                <div class="schedule-dot" [ngClass]="{
                  'dot-scheduled': !appt.status || appt.status === 'SCHEDULED',
                  'dot-completed': appt.status === 'COMPLETED',
                  'dot-cancelled': appt.status === 'CANCELLED'
                }"></div>
                <div class="schedule-info">
                  <div class="schedule-patient">{{ appt.patientName || 'Patient #' + appt.patientId }}</div>
                  <div class="schedule-doctor">👨‍⚕️ {{ appt.doctorName }}</div>
                </div>
                <span class="badge" [ngClass]="{
                  'badge-accent': !appt.status || appt.status === 'SCHEDULED',
                  'badge-success': appt.status === 'COMPLETED',
                  'badge-danger': appt.status === 'CANCELLED'
                }">{{ appt.status || 'SCHEDULED' }}</span>
              </div>
            }
          </div>
        }
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

    .hero-section {
      background: linear-gradient(135deg, var(--bg-card), var(--bg-elevated));
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
      padding: 32px 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
    }

    .hero-section::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -10%;
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, var(--primary-light) 0%, transparent 70%);
      pointer-events: none;
    }

    .hero-badge {
      display: inline-block;
      padding: 4px 12px;
      background: var(--primary-light);
      border: 1px solid var(--primary)44;
      border-radius: var(--radius-full);
      color: var(--primary);
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
    }

    .hero-title {
      font-size: 26px;
      font-weight: 700;
      line-height: 1.2;
    }

    .hero-name { color: var(--primary); }
    .hero-sub { color: var(--text-muted); font-size: 13px; margin-top: 8px; }

    .hero-illustration {
      font-size: 72px;
      opacity: 0.6;
      line-height: 1;
    }

    .stat-card { cursor: default; }
    .stat-trend { font-size: 11px; color: var(--text-muted); margin-top: 4px; }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 4px;
    }

    .section-title { font-size: 16px; font-weight: 600; }

    .quick-actions {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    .quick-card {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 24px;
      border-radius: var(--radius-lg);
      border: 1px solid var(--border);
      text-decoration: none;
      position: relative;
      overflow: hidden;
      transition: var(--transition-slow);
      background: var(--bg-card);
    }

    .quick-card::before {
      content: '';
      position: absolute;
      inset: 0;
      opacity: 0;
      transition: opacity 0.2s;
    }

    .quick-card.primary::before { background: var(--primary-light); }
    .quick-card.accent::before { background: var(--accent-light); }
    .quick-card.success::before { background: var(--success-light); }

    .quick-card:hover::before { opacity: 1; }
    .quick-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
    .quick-card.primary:hover { border-color: var(--primary); box-shadow: var(--shadow-glow); }
    .quick-card.accent:hover { border-color: var(--accent); box-shadow: var(--shadow-glow-accent); }
    .quick-card.success:hover { border-color: var(--success); }

    .quick-icon { font-size: 32px; line-height: 1; margin-bottom: 4px; }

    .quick-label {
      font-size: 15px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .quick-desc { font-size: 12px; color: var(--text-muted); }

    .quick-arrow {
      position: absolute;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
      font-size: 20px;
      color: var(--text-muted);
      transition: var(--transition);
    }

    .quick-card:hover .quick-arrow {
      transform: translateY(-50%) translateX(4px);
      color: var(--text-secondary);
    }

    /* Schedule */
    .schedule-list { display: flex; flex-direction: column; }

    .schedule-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 14px 24px;
      border-bottom: 1px solid var(--border-light);
      transition: var(--transition);
    }

    .schedule-item:last-child { border-bottom: none; }
    .schedule-item:hover { background: var(--bg-elevated); }

    .schedule-time {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-secondary);
      min-width: 60px;
      font-variant-numeric: tabular-nums;
    }

    .schedule-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .dot-scheduled { background: var(--accent); box-shadow: 0 0 8px var(--accent)88; }
    .dot-completed { background: var(--success); box-shadow: 0 0 8px var(--success)88; }
    .dot-cancelled { background: var(--danger); }

    .schedule-info { flex: 1; }
    .schedule-patient { font-size: 14px; font-weight: 500; }
    .schedule-doctor { font-size: 12px; color: var(--text-muted); margin-top: 2px; }

    @media (max-width: 768px) {
      .quick-actions { grid-template-columns: 1fr; }
      .hero-illustration { display: none; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  totalPatients = signal(0);
  todayAppts = signal<Appointment[]>([]);
  completedConsultations = signal(0);
  pendingConsults = signal(0);
  loadingToday = signal(true);
  newToday = 0;

  todayDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  constructor(
    private patientService: PatientService,
    private appointmentService: AppointmentService,
    private consultationService: ConsultationService
  ) {}

  ngOnInit() {
    this.patientService.getAll().subscribe(p => this.totalPatients.set(p.length));

    this.appointmentService.getToday().subscribe({
      next: (appts) => {
        this.todayAppts.set(appts);
        this.loadingToday.set(false);
        this.pendingConsults.set(appts.filter(a => !a.status || a.status === 'SCHEDULED').length);
      },
      error: () => this.loadingToday.set(false)
    });

    this.consultationService.getAll().subscribe(c => {
      this.completedConsultations.set(c.length);
    });
  }

  scheduledCount(): number {
    return this.todayAppts().filter(a => !a.status || a.status === 'SCHEDULED').length;
  }

  formatTime(dt: string): string {
    if (!dt) return '--:--';
    return new Date(dt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  }
}
