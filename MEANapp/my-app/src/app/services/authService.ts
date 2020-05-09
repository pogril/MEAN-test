import { Injectable } from '@angular/core';
import { Channel } from '../feeds/channel.model';
import { Subject, BehaviorSubject, pipe } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LogoutService } from './logoutService';

export class User {

  constructor(
    public name: string,
    public userID: string,
    public channels: Channel[],
    public sprite: string,
    public motto: string,
    private _token: string,
    public authUntil : string
    ) {}

  get token() {
    if(new Date(this.authUntil) < new Date()){
      return false;
    }
    return this._token;
  }
}

@Injectable({
  providedIn: 'root'
})

export class AuthService{

  constructor(
    private router: Router,
    private http: HttpClient,
    private l: LogoutService
    ) {}

  currentUser = new BehaviorSubject<User>(null);

  login(email: string, password: string) {

    this.http.post('http://localhost:3000/login', {
      username: email,
      password: password
    }).subscribe( (user: any) => {
      this.currentUser.next(user);
      this.currentUser.next(new User(
        user.name,
        user.userID,
        user.channels,
        user.sprite,
        user.motto,
        user._token,
        user.authUntil
      ));
      this.saveUserData(this.currentUser.value);
      this.autoLogout();
      this.router.navigate(['home']);
    });
  }

  signup(email: string, password: string) {
    this.http.post('http://localhost:3000/signup', {
      username: email,
      password: password
    }).subscribe( (user: any) => {
      this.currentUser.next(user);
      this.currentUser.next(new User(
        user.name,
        user.userID,
        user.channels,
        user.sprite,
        user.motto,
        user._token,
        user.authUntil
      ));
      this.saveUserData(this.currentUser.value);
      this.autoLogout();
      this.router.navigate(['home']);
    });
  }

  saveUserData(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  autoLogin(): boolean {
    const localData = localStorage.getItem('user');

    if(!localData) {
      return false;
    }
    const parsedLocalData = JSON.parse(localData);

    if(!!parsedLocalData && new Date(parsedLocalData.authUntil) > new Date()) {

      const savedUser = new User(

        parsedLocalData.name,
        parsedLocalData.userID,
        parsedLocalData.channels,
        parsedLocalData.sprite,
        parsedLocalData.motto,
        parsedLocalData._token,
        parsedLocalData.authUntil
      );

      this.currentUser.next(savedUser);
      this.autoLogout();
      return true;
    } else {
      localStorage.removeItem('user');
      return false;
    }
  }

  autoLogout() {
    setTimeout( () => {
      this.currentUser.complete();
      localStorage.removeItem('user');
      this.l.dropAllConnections();
      this.router.navigate(['/login']);
    }, ( new Date(this.currentUser.value.authUntil).getTime() - new Date().getTime() ) );
  }

}
