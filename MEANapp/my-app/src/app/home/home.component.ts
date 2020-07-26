import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Channel } from '../feeds/channel.model';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { AuthService, User } from '../services/authService';
import { Router, ActivatedRoute } from '@angular/router';
import { NewChannelFormComponent } from '../forms/new-channel/new-channel.component';
import { Subscription } from 'rxjs';
import { ChannelComponent } from '../feeds/channel/channel.component';
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState
} from '@angular/cdk/layout';
import { UiHelperService } from '../services/uiHelperService';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit, OnDestroy {

  signIn: Boolean;
  isMobile: Boolean = false;
  channels: Channel[];
  uiSub: Subscription;
  currentUser: Subscription;
  channelRef: ChannelComponent;
  showSidebar: Boolean = true;
  @ViewChild('backdrop') backdrop: ElementRef;

  constructor(
    private breakpointObs: BreakpointObserver,
    private route : ActivatedRoute,
    private dlg : MatDialog,
    private http: HttpClient,
    private auth: AuthService,
    public ui: UiHelperService,
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
          let user = this.auth.currentUser.value;
          user.channels.push(createdChannel);
          this.auth.saveUserData(user as User);
          this.auth.currentUser.next(user as User);
        })
    })
  }

  loadChannel(channel) {
    if(this.channelRef){
      this.channelRef.unload();
    }
    this.router.navigate([`./channels/${channel}`], {relativeTo: this.route})
      .then(res => {
        this.channelRef.getMessages();
        if(this.isMobile){
          this.ui.toggleSideNav();
        }
      });

  }

  getOptions() {

  }

  loadFeed() {

  }




  ngOnInit() {

    this.channels = this.auth.currentUser.value.channels;
    this.currentUser = this.auth.currentUser.subscribe( (user: User) => {
      this.channels = user.channels;
    });

    if(this.breakpointObs.isMatched('(max-width: 40rem)')){
      this.showSidebar = false;
      this.isMobile = true;
    };

    this.uiSub = this.ui.sideNav.subscribe(e => {
      this.showSidebar = !this.showSidebar;
      if(this.showSidebar) {
        this.backdrop.nativeElement.style.display = 'block';
      }
      else {
        this.backdrop.nativeElement.style.display = 'none';
      }
    })
  }

  ngOnDestroy() {
    this.currentUser.unsubscribe();
  }
}
