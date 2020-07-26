import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm } from '@angular/forms';
import { Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { AuthService } from 'src/app/services/authService';
import { mimetypeValidator } from './mime-type.validator';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ErrorStateMatcher } from '@angular/material/core';


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css']
})

export class SetupComponent implements OnInit{

  constructor(
    private auth: AuthService,
    private http: HttpClient
    ) {}

  matcher = new MyErrorStateMatcher();
  form: FormGroup;
  checkedUsername: Boolean = false;
  validUsername: Boolean = false;
  usernameControlSub: Subscription;
  image: string = 'assets/empruh.jpg';

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();

    this.form.patchValue({sprite: file});
    this.form.get('sprite').updateValueAndValidity();
    reader.onload = () => {
      this.image = reader.result as string;
    }
    reader.readAsDataURL(file);
  }

  submit() {
    const data = this.form.controls;
    this.auth.signup(data.localname.value, data.sprite.value);
  }

  ngOnInit() {
    this.form = new FormGroup({
      'localname': new FormControl(null, {
        validators: [Validators.minLength(4), Validators.required]
      }),
      'sprite': new FormControl(null, {
        asyncValidators: [mimetypeValidator]
      }),
      'motto': new FormControl(null)
    })

    this.usernameControlSub = this.form.controls.localname.valueChanges.pipe(debounceTime(600))
    .subscribe(value => {
      this.validUsername = false;
      if(this.form.controls.localname.valid){
        this.http.get(`http://localhost:3000/checkusername/${value}`).subscribe((result: any) => {
          if(!result.available){
            this.form.controls.localname.setErrors({invalid: true});
          } else {
            this.validUsername = true;
          }
        })
      }
    })
  }
}
