import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/authService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  constructor(private auth: AuthService, private router: Router){}

  ngOnInit(): void {

    console.log('keep calm, and carry a towel');
    const savedUser = this.auth.autoLogin();

    if(savedUser) {
      this.router.navigate(['home']);
    } else {
      this.router.navigate(['login']);
    }
  }
}
