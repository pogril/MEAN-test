import { Injectable } from '@angular/core';
import { MsgService } from './msgService';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  constructor(
    private msg: MsgService
  ){}

  dropAllConnections() {
    this.msg.dropChan();
    this.msg.dropNotifications();
    this.msg.activeChanSub.complete();
    this.msg.chanNotificationsSub.complete();
    //...
  }

}
