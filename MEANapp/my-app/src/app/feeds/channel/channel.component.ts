import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewChecked
 } from '@angular/core';

import { Message } from '../message.model';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/authService';
import { MsgService } from '../../services/msgService';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { UiHelperService } from 'src/app/services/uiHelperService';

@Component({
  selector: 'app-channel-component',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css']
})
export class ChannelComponent implements OnInit, OnDestroy, AfterViewChecked{

    constructor(
      private auth: AuthService,
      private http: HttpClient,
      private route: ActivatedRoute,
      private ui: UiHelperService,
      private msgServ: MsgService
    ){}

    members: string[];
    uiSub: Subscription;
    messages: Message[] = [];
    messagesSub: Subscription;
    loaded: Boolean = false;
    length: number = 0;
    previousHeight: number = 0;
    snapToBottom: Boolean = true;

    @ViewChild('msgContainer') msgContainer: ElementRef;
    @ViewChild('backdrop') backdrop: ElementRef;

    getMessages() {

      this.http.get(`http://localhost:3000/channels/${this.route.snapshot.params.id}`)
        .subscribe( (response: {length: number, messages: Message[]}) => {
          this.length = response.length;
          this.messages = response.messages;
          this.loadNew();
          this.loaded = true;
        })
    }
    onSubmit(form: NgForm){
      const user = this.auth.currentUser.value.name;
      this.msgServ.postMessage(this.route.snapshot.params.id, new Message(user, form.value.textInput));
      form.reset('textInput');
    }

    onScroll(e: any) {
      if(e.target.scrollTop >= e.target.scrollHeight - 500) {
        this.snapToBottom = true;
      } else {
        this.snapToBottom = false;
      }

      if(e.target.scrollTop == 0) {
        this.http.get(
          `http://localhost:3000/loadmore/${this.route.snapshot.params.id}?loaded=${this.messages.length}`
          ).subscribe((result: {messages: Message[]}) => {
            for(let msg of this.messages){
              result.messages.push(msg);
            }
            this.messages = result.messages;
          })
      }
    }

    loadNew() {
      this.msgServ.listen(this.route.snapshot.params.id, this.length, 3000);
      this.messagesSub = this.msgServ.activeChanSub.subscribe( newMessage => {
        this.messages.push(newMessage);
        this.length += 1;
        this.msgServ.dropChan();
        this.msgServ.listen(this.route.snapshot.params.id, this.length, 3000);
        //record the height of <msg container> before the new message was added
        this.previousHeight = this.msgContainer.nativeElement.scrollHeight;
      })
    }

    unload() {
      this.msgServ.dropChan();
      this.members = [];
      this.messages = [];
      this.messagesSub.unsubscribe();
    }

    ngAfterViewChecked() {
      //scroll to the bottom if the height of <msg container> has grown
      if(this.previousHeight < this.msgContainer.nativeElement.scrollHeight && this.snapToBottom){
        this.msgContainer.nativeElement.scrollTop = this.msgContainer.nativeElement.scrollHeight;
        this.previousHeight = this.msgContainer.nativeElement.scrollHeight;
      }
    }

    ngOnInit(){

    }

    ngOnDestroy() {
      this.messagesSub.unsubscribe();
      this.msgServ.dropChan();
      this.msgServ.dropNotifications();
    }
}
