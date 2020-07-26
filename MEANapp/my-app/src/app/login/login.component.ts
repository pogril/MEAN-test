import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/authService';
import { ErrorService } from '../services/errorService';
import { Subscription } from 'rxjs';
import { SignupComponent } from '../forms/signup/signup.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  @ViewChild('loginForm')
  form: SignupComponent;

  errorSub: Subscription;

  constructor(private authService: AuthService, private es: ErrorService) {}

  ngOnInit() {
    this.errorSub = this.es.errorSub.subscribe(error => {
      this.form.error = error;
    })
  }
}
