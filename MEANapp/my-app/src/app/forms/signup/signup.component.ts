import { Component } from '@angular/core';

import { AuthService } from 'src/app/services/authService';


@Component({
  selector: 'app-sign-in',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
  })

export class SignupComponent {
  username: string;
  password: string;
  confirmedPassword: string;
  confirmPassword = false;
  emailTaken = false;

  constructor(private auth: AuthService){}

  handleForm() {
    if(this.confirmPassword && this.password != this.confirmedPassword) {
      return false;
    }

    if(this.confirmPassword){
      this.auth.signup(this.username, this.password);
    }
    else {
      this.auth.login(this.username, this.password);
    }
  }

  onInit(){

   }
}
