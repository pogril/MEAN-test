import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-new-channel-form',
  templateUrl: './new-channel.component.html',
  styleUrls: ['./new-channel.component.css']
})

export class NewChannelFormComponent {

  constructor(public dRef: MatDialogRef<NewChannelFormComponent>) {}
  name: string;
  link: string;

  createNew() {
    this.dRef.close(this.name);
  }
}
