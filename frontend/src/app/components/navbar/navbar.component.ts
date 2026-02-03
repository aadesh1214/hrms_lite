import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="navbar-brand">
        <h1>HRMS Lite</h1>
      </div>
      <ul class="navbar-menu">
        <li>
          <a routerLink="/employees" routerLinkActive="active" class="nav-link">
            Employees
          </a>
        </li>
        <li>
          <a routerLink="/attendance" routerLinkActive="active" class="nav-link">
            Attendance
          </a>
        </li>
      </ul>
    </nav>
  `,
  styles: [`
    .navbar {
      background-color: #2c3e50;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .navbar-brand h1 {
      color: #fff;
      margin: 0;
      font-size: 24px;
    }

    .navbar-menu {
      list-style: none;
      display: flex;
      gap: 20px;
      margin: 0;
      padding: 0;
    }

    .nav-link {
      color: #ecf0f1;
      text-decoration: none;
      padding: 10px 15px;
      border-radius: 4px;
      transition: background-color 0.3s;
    }

    .nav-link:hover {
      background-color: rgba(255,255,255,0.1);
    }

    .nav-link.active {
      background-color: #3498db;
      color: #fff;
    }
  `]
})
export class NavbarComponent {}
