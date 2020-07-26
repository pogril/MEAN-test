import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  errorSub = new Subject<string>();

  push(err: string) {
    this.errorSub.next(err);
  }
}
