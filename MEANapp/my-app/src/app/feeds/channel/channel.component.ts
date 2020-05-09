import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { Message } from '../message.model';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/authService';
import { MsgService } from '../../services/msgService';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';

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
      private msgServ: MsgService
    ){}

    members: string[];
    messages: Message[] = [];
    messagesSub: Subscription;
    loaded: Boolean = false;
    previousHeight: number = 0;

    @ViewChild('msgContainer') msgContainer: ElementRef;

    getMessages() {

      this.http.get(`http://localhost:3000/channels/${this.route.snapshot.params.id}`)
        .subscribe( (response: {messages: Message[]}) => {
            this.messages = response.messages;
            this.loadNew();
            this.loaded = true;
        })
    }
    onSubmit(form: NgForm){
      const user = this.auth.currentUser.value.userID;
      this.msgServ.postMessage(this.route.snapshot.params.id, new Message(user, form.value.textInput))
    }


    loadNew() {
      this.msgServ.listen(this.route.snapshot.params.id, this.messages.length, 3000);
      this.messagesSub = this.msgServ.activeChanSub.subscribe( newMessage => {
        this.messages.push(newMessage);
        this.msgServ.dropChan();
        this.msgServ.listen(this.route.snapshot.params.id, this.messages.length, 3000);
        //record current scroll height
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
      //scroll to the bottom if there are new messages
      if(this.previousHeight < this.msgContainer.nativeElement.scrollHeight){
        this.msgContainer.nativeElement.scrollTop = this.msgContainer.nativeElement.scrollHeight;
        this.previousHeight = this.msgContainer.nativeElement.scrollHeight;
      }
    }

    ngOnInit(){

    }

    ngOnDestroy() {
      this.messagesSub.unsubscribe();
    }
}
