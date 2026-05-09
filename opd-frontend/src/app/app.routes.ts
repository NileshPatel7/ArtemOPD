import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'patients',
    loadComponent: () => import('./pages/patients/patients.component').then(m => m.PatientsComponent)
  },
  {
    path: 'appointments',
    loadComponent: () => import('./pages/appointments/appointments.component').then(m => m.AppointmentsComponent)
  },
  {
    path: 'consultations',
    loadComponent: () => import('./pages/consultations/consultations.component').then(m => m.ConsultationsComponent)
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
