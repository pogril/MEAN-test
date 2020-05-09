import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Channel } from '../feeds/channel.model';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { AuthService, User } from '../services/authService';
import { Router, ActivatedRoute } from '@angular/router';
import { NewChannelFormComponent } from '../forms/new-channel/new-channel.component';
import { Subscription } from 'rxjs';
import { ChannelComponent } from '../feeds/channel/channel.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit, OnDestroy {

  signIn: Boolean;
  channels: Channel[];
  currentUser: Subscription;
  channelRef: ChannelComponent;

  constructor(
    private route : ActivatedRoute,
    private dlg : MatDialog,
    private http: HttpClient,
    private auth: AuthService,
    private router: Router
    ) { }

  getRef(componentRef) {
    this.channelRef = componentRef;
  }

  newChannel() {

    let dialogRef = this.dlg.open(NewChannelFormComponent, {
      width: '80%',
      height: '80%'
    })

    dialogRef.afterClosed().subscribe(result => {
      this.http.post('http://localhost:3000/createnewchannel', {name: result})
        .subscribe((result : any) => {
          const createdChannel: Channel = {
            name: result.name,
            id: result.id
          }
          this.channels.push(createdChannel);
        })
    })
  }

  loadChannel(channel) {
    if(this.channelRef){
      this.channelRef.unload();
    }
    this.router.navigate([`./channels/${channel}`], {relativeTo: this.route})
      .then(res => {this.channelRef.getMessages()});
  }

  getOptions() {

  }

  loadFeed() {

  }




  ngOnInit() {
    this.currentUser = this.auth.currentUser.subscribe( (user: User) => {
      this.channels = user.channels;
    });

  }

  ngOnDestroy() {
    this.currentUser.unsubscribe();
  }
}
