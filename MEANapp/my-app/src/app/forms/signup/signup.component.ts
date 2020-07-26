import { Component } from '@angular/core';

import { AuthService } from 'src/app/services/authService';
import { Router } from '@angular/router';
import { ErrorService } from 'src/app/services/errorService';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-sign-in',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
  })

export class SignupComponent {
  email: string;
  password: string;
  confirmedPassword: string;
  confirmPassword = false;
  error: string;
  loading: Boolean = false;


  constructor(
    private auth: AuthService,
    private router: Router,
    private err: ErrorService,
    private http: HttpClient
    ){}

  handleForm() {
    if(this.confirmPassword && this.password != this.confirmedPassword) {
      return false;
    }

    if(this.confirmPassword){
      this.loading = true;
      this.http.get(`http://localhost:3000/checkemail/${this.email}`)
      .subscribe((result: {valid: Boolean}) => {
        if(result.valid){
          this.loading = false;
          this.auth.prepareNewUser(this.email, this.password);
          this.router.navigate(['setup']);
        } else {
          this.loading = false;
          this.err.push('A user with this email already exists!');
        }
      })
    }
    else {
      this.loading = true;
      this.auth.login(this.email, this.password);
    }
  }
}
