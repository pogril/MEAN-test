import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class UiHelperService {

  sideNav = new Subject<number>()

  toggleSideNav(){
    this.sideNav.next(0);
  }
}
