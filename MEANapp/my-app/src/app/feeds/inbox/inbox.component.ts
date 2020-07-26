import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MsgService } from 'src/app/services/msgService';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { UiHelperService } from 'src/app/services/uiHelperService';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {
  constructor(
    public http: HttpClient,
    public msg: MsgService,
    public ui: UiHelperService,
    public breakpointObs: BreakpointObserver
    ) {}

  @ViewChild('backdrop') backdrop: ElementRef;
  showSidebar: Boolean = true;
  isMobile: Boolean = false;
  uiSub: Subscription;
  conversations: {image: string, name: string}[] = [{image: 'https://nnimgt-a.akamaihd.net/transform/v1/crop/frm/3AijacentBN9GedHCvcASxG/d0c1b8be-ee01-462a-8085-1e70ba97d387.jpg/r0_52_1101_1134_w1200_h678_fmax.jpg', name: 'Trump'}];

  getRef(e: any){

  }

  ripple() {
    console.log('clicked');
  }

  ngOnInit(){
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

}
