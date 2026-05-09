import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Patient } from '../../models/patient.model';
import { PatientService } from '../../services/patient.service';
import { debounceTime, distinctUntilChanged, Subject, switchMap, catchError, of } from 'rxjs';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <!-- Stats Row -->
      <div class="grid grid-4 stats-row">
        <div class="stat-card primary">
          <div class="stat-label">Total Patients</div>
          <div class="stat-value">{{ allPatients().length }}</div>
          <div class="stat-icon">👥</div>
        </div>
        <div class="stat-card accent">
          <div class="stat-label">Male</div>
          <div class="stat-value">{{ genderCount('MALE') }}</div>
          <div class="stat-icon">👨</div>
        </div>
        <div class="stat-card warning">
          <div class="stat-label">Female</div>
          <div class="stat-value">{{ genderCount('FEMALE') }}</div>
          <div class="stat-icon">👩</div>
        </div>
        <div class="stat-card success">
          <div class="stat-label">Other</div>
          <div class="stat-value">{{ genderCount('OTHER') }}</div>
          <div class="stat-icon">🧑</div>
        </div>
      </div>

      <div class="content-grid">
        <!-- Add Patient Form -->
        <div class="card form-card">
          <div class="card-header">
            <div>
              <h2 class="card-title">{{ editingPatient() ? '✏️ Edit Patient' : '➕ Add Patient' }}</h2>
              <p class="card-subtitle">Register a new patient record</p>
            </div>
          </div>
          <div class="card-body">
            @if (successMsg()) {
              <div class="alert alert-success" style="margin-bottom:16px">
                ✅ {{ successMsg() }}
              </div>
            }
            @if (errorMsg()) {
              <div class="alert alert-error" style="margin-bottom:16px">
                ❌ {{ errorMsg() }}
              </div>
            }
            <form #patientForm="ngForm" (ngSubmit)="onSubmit(patientForm)" class="form-layout">
              <div class="form-group">
                <label class="form-label">Full Name *</label>
                <input
                  class="form-control"
                  name="name"
                  [(ngModel)]="formData.name"
                  required
                  minlength="2"
                  placeholder="e.g. Raj Patel"
                  id="input-name"
                  #nameCtrl="ngModel"
                />
                @if (nameCtrl.invalid && nameCtrl.touched) {
                  <div class="form-error">Name is required (min 2 chars)</div>
                }
              </div>

              <div class="form-group">
                <label class="form-label">Gender *</label>
                <select class="form-control" name="gender" [(ngModel)]="formData.gender" required id="select-gender" #genderCtrl="ngModel">
                  <option value="" disabled selected>Select gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
                @if (genderCtrl.invalid && genderCtrl.touched) {
                  <div class="form-error">Please select gender</div>
                }
              </div>

              <div class="form-group">
                <label class="form-label">Age *</label>
                <input
                  class="form-control"
                  type="number"
                  name="age"
                  [(ngModel)]="formData.age"
                  required
                  min="0"
                  max="150"
                  placeholder="e.g. 35"
                  id="input-age"
                  #ageCtrl="ngModel"
                />
                @if (ageCtrl.invalid && ageCtrl.touched) {
                  <div class="form-error">Valid age required (0-150)</div>
                }
              </div>

              <div class="form-group">
                <label class="form-label">Phone Number *</label>
                <input
                  class="form-control"
                  name="phone"
                  [(ngModel)]="formData.phone"
                  required
                  pattern="[0-9]{10}"
                  placeholder="10-digit number"
                  id="input-phone"
                  #phoneCtrl="ngModel"
                />
                @if (phoneCtrl.invalid && phoneCtrl.touched) {
                  <div class="form-error">Valid 10-digit phone required</div>
                }
              </div>

              <div class="form-actions">
                <button type="submit" class="btn btn-primary btn-block" [disabled]="patientForm.invalid || loading()">
                  @if (loading()) { ⏳ Saving... }
                  @else if (editingPatient()) { ✏️ Update Patient }
                  @else { ➕ Add Patient }
                </button>
                @if (editingPatient()) {
                  <button type="button" class="btn btn-outline btn-block" (click)="cancelEdit()">
                    ✕ Cancel
                  </button>
                }
              </div>
            </form>
          </div>
        </div>

        <!-- Patient List -->
        <div class="card list-card">
          <div class="card-header">
            <div>
              <h2 class="card-title">🗂️ Patient Records</h2>
              <p class="card-subtitle">{{ displayedPatients().length }} records found</p>
            </div>
            <div class="search-wrapper">
              <span class="search-icon">🔍</span>
              <input
                class="form-control search-input"
                placeholder="Search by name or phone..."
                [(ngModel)]="searchQuery"
                (ngModelChange)="onSearch($event)"
                id="patient-search"
                style="width:240px"
              />
            </div>
          </div>
          <div class="table-wrapper">
            @if (loadingList()) {
              <div class="empty-state">
                <div class="icon pulse">⏳</div>
                <h3>Loading patients...</h3>
              </div>
            } @else if (displayedPatients().length === 0) {
              <div class="empty-state">
                <div class="icon">👥</div>
                <h3>No patients found</h3>
                <p>Add a new patient using the form on the left</p>
              </div>
            } @else {
              <table class="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Gender</th>
                    <th>Age</th>
                    <th>Phone</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (patient of displayedPatients(); track patient.id; let i = $index) {
                    <tr>
                      <td><span class="badge badge-muted">{{ patient.id }}</span></td>
                      <td>
                        <div class="patient-name-cell">
                          <div class="patient-avatar">{{ patient.name.charAt(0).toUpperCase() }}</div>
                          <span style="font-weight:500">{{ patient.name }}</span>
                        </div>
                      </td>
                      <td>
                        <span class="badge" [ngClass]="{
                          'badge-accent': patient.gender === 'MALE',
                          'badge-warning': patient.gender === 'FEMALE',
                          'badge-muted': patient.gender === 'OTHER'
                        }">{{ patient.gender }}</span>
                      </td>
                      <td>{{ patient.age }} yrs</td>
                      <td class="text-muted">📱 {{ patient.phone }}</td>
                      <td>
                        <div class="action-btns">
                          <button class="btn btn-outline btn-sm" (click)="editPatient(patient)" title="Edit">✏️</button>
                          <button class="btn btn-danger btn-sm" (click)="deletePatient(patient)" title="Delete">🗑️</button>
                        </div>
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

    <!-- Delete Confirm Modal -->
    @if (showDeleteModal()) {
      <div class="modal-backdrop" (click)="showDeleteModal.set(false)">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">🗑️ Delete Patient</h3>
            <button class="btn btn-outline btn-icon" (click)="showDeleteModal.set(false)">✕</button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete <strong>{{ patientToDelete()?.name }}</strong>? This action cannot be undone.</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline" (click)="showDeleteModal.set(false)">Cancel</button>
            <button class="btn btn-danger" (click)="confirmDelete()">🗑️ Delete</button>
          </div>
        </div>
      </div>
    }
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
    .form-actions { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; }

    .patient-name-cell {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .patient-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 700;
      color: #000;
      flex-shrink: 0;
    }

    .action-btns { display: flex; gap: 6px; }

    @media (max-width: 1024px) {
      .content-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class PatientsComponent implements OnInit {
  allPatients = signal<Patient[]>([]);
  displayedPatients = signal<Patient[]>([]);
  loading = signal(false);
  loadingList = signal(false);
  successMsg = signal('');
  errorMsg = signal('');
  searchQuery = '';
  showDeleteModal = signal(false);
  patientToDelete = signal<Patient | null>(null);
  editingPatient = signal<Patient | null>(null);

  formData: Partial<Patient> = this.emptyForm();
  private searchSubject = new Subject<string>();

  constructor(private patientService: PatientService) {}

  ngOnInit() {
    this.loadPatients();
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (query.trim().length < 2) {
          return of(this.allPatients());
        }
        return this.patientService.search(query).pipe(catchError(() => of(this.filterLocally(query))));
      })
    ).subscribe(patients => this.displayedPatients.set(patients));
  }

  loadPatients() {
    this.loadingList.set(true);
    this.patientService.getAll().subscribe({
      next: (patients) => {
        this.allPatients.set(patients);
        this.displayedPatients.set(patients);
        this.loadingList.set(false);
      },
      error: () => {
        this.loadingList.set(false);
        this.errorMsg.set('Failed to load patients. Check if backend is running.');
        setTimeout(() => this.errorMsg.set(''), 4000);
      }
    });
  }

  onSearch(query: string) {
    if (!query.trim()) {
      this.displayedPatients.set(this.allPatients());
      return;
    }
    this.searchSubject.next(query);
  }

  filterLocally(query: string): Patient[] {
    const q = query.toLowerCase();
    return this.allPatients().filter(p =>
      p.name.toLowerCase().includes(q) || p.phone.includes(q)
    );
  }

  onSubmit(form: NgForm) {
    if (form.invalid) return;
    this.loading.set(true);
    const patient = this.formData as Patient;

    const req = this.editingPatient()
      ? this.patientService.update(this.editingPatient()!.id!, patient)
      : this.patientService.create(patient);

    req.subscribe({
      next: () => {
        this.successMsg.set(this.editingPatient() ? 'Patient updated!' : 'Patient registered!');
        setTimeout(() => this.successMsg.set(''), 3000);
        this.loading.set(false);
        this.formData = this.emptyForm();
        this.editingPatient.set(null);
        form.resetForm();
        this.loadPatients();
      },
      error: () => {
        this.errorMsg.set('Operation failed. Please try again.');
        setTimeout(() => this.errorMsg.set(''), 4000);
        this.loading.set(false);
      }
    });
  }

  editPatient(patient: Patient) {
    this.editingPatient.set(patient);
    this.formData = { ...patient };
  }

  cancelEdit() {
    this.editingPatient.set(null);
    this.formData = this.emptyForm();
  }

  deletePatient(patient: Patient) {
    this.patientToDelete.set(patient);
    this.showDeleteModal.set(true);
  }

  confirmDelete() {
    if (!this.patientToDelete()?.id) return;
    this.patientService.delete(this.patientToDelete()!.id!).subscribe({
      next: () => {
        this.showDeleteModal.set(false);
        this.loadPatients();
      },
      error: () => {
        this.errorMsg.set('Delete failed.');
        setTimeout(() => this.errorMsg.set(''), 3000);
        this.showDeleteModal.set(false);
      }
    });
  }

  genderCount(gender: string): number {
    return this.allPatients().filter(p => p.gender === gender).length;
  }

  emptyForm(): Partial<Patient> {
    return { name: '', gender: undefined, age: undefined, phone: '' };
  }
}
