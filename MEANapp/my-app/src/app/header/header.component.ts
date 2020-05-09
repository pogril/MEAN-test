import { Component, OnInit } from '@angular/core';
import { LogoutService } from '../services/logoutService';
import { Router } from '@angular/router';
import { AuthService } from '../services/authService';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private l: LogoutService,
    private router: Router,
    private auth: AuthService
  ) { }

  logout() {
    this.l.dropAllConnections();
    localStorage.removeItem('user');
    this.auth.currentUser.complete();
    this.router.navigate(['/login']);
  }

  ngOnInit() {
  }

}
