import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { Message } from '../feeds/message.model';
import { HttpClient } from '@angular/common/http';
import * as htmlify from 'linkifyjs/html';

export class NewMessagesNotification {
  channel: string;
  newMessages: number;
}

@Injectable({
  providedIn: 'root'
})
export class MsgService {

  activeChanSub = new Subject<Message>();
  chanNotificationsSub = new BehaviorSubject<NewMessagesNotification[]>(null);
  chanListener: any;
  notifyListener: any;


  constructor(
    private http: HttpClient,
    ){}

  listen(cId: string, loaded: number, interval: number){
    this.chanListener = setInterval(() => {
      this.http.get(`http://localhost:3000/channels/listen/${cId}?loaded=${loaded}`)
        .subscribe((response: {messages: Message[]}) => {
          if(response.messages.length > 0) {
            for(let i = 0; i < response.messages.length; i++){
              this.activeChanSub.next(response.messages[i]);
            }
          }
        })
    }, interval);
  }

  postMessage(chanId: string, message: Message) {
    message.content = this.parse(message.content);
    console.log(message.content);
    this.http.post(`http://localhost:3000/channels/${chanId}`,
      {author: message.author, content: message.content})
      .subscribe((response: {id: string, createdAt: Date, updatedAt: Date}) => {
        message.id = response.id;
        message.createdAt = response.createdAt;
        message.updatedAt = response.updatedAt;
        this.activeChanSub.next(message);
      });
  }

  parse(message: string): string {
    return htmlify(message, {defaultProtocol: 'https'});
  }

  dropChan(){
    clearInterval(this.chanListener);
  }

  dropNotifications() {
    clearInterval(this.notifyListener);
  }

  pushNotifications(){}
}
