import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { AuthService } from '../authService';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService){}
  intercept(req: HttpRequest<any>, next: HttpHandler){
    if(this.auth.currentUser.value) {
      const updatedRequest = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${this.auth.currentUser.value.token}`)
      })
      return next.handle(updatedRequest);
    }
    return next.handle(req);
  }
}
