import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="navbar-brand">
        <span class="brand-icon">🏥</span>
        <div>
          <div class="brand-name">MediCare OPD</div>
          <div class="brand-sub">Outpatient Management</div>
        </div>
      </div>
      <ul class="navbar-nav">
        <li>
          <a routerLink="/patients" routerLinkActive="active" class="nav-link">
            <span class="nav-icon">👤</span>
            <span>Patients</span>
          </a>
        </li>
        <li>
          <a routerLink="/appointments" routerLinkActive="active" class="nav-link">
            <span class="nav-icon">📅</span>
            <span>Appointments</span>
          </a>
        </li>
        <li>
          <a routerLink="/consultations" routerLinkActive="active" class="nav-link">
            <span class="nav-icon">🩺</span>
            <span>Consultations</span>
          </a>
        </li>
      </ul>
      <div class="navbar-user">
        <div class="user-avatar">Dr</div>
        <div class="user-info">
          <div class="user-name">Dr. Admin</div>
          <div class="user-role">General Physician</div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 64px;
      background: var(--bg-surface);
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      padding: 0 24px;
      gap: 32px;
      z-index: 100;
      box-shadow: 0 1px 20px rgba(0,0,0,0.3);
    }

    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 200px;
    }

    .brand-icon { font-size: 28px; }

    .brand-name {
      font-size: 15px;
      font-weight: 700;
      color: var(--primary);
      line-height: 1.2;
    }

    .brand-sub {
      font-size: 10px;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .navbar-nav {
      display: flex;
      list-style: none;
      gap: 4px;
      flex: 1;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
      transition: var(--transition);
    }

    .nav-link:hover {
      color: var(--text-primary);
      background: var(--bg-elevated);
    }

    .nav-link.active {
      color: var(--primary);
      background: var(--primary-light);
      font-weight: 600;
    }

    .nav-icon { font-size: 16px; }

    .navbar-user {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 6px 12px;
      border-radius: var(--radius-md);
      background: var(--bg-elevated);
      border: 1px solid var(--border);
    }

    .user-avatar {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 700;
      color: #000;
    }

    .user-name {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .user-role {
      font-size: 11px;
      color: var(--text-muted);
    }

    @media (max-width: 768px) {
      .navbar-brand { min-width: auto; }
      .brand-sub, .user-info { display: none; }
      .nav-link span:last-child { display: none; }
    }
  `]
})
export class NavbarComponent {}
