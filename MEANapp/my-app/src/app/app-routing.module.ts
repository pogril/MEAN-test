import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChannelComponent } from './feeds/channel/channel.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { SetupComponent } from './forms/user-setup/setup.component';
import { InboxComponent } from './feeds/inbox/inbox.component';


const routes: Routes = [
  {path: '', children:
  [
    {path: 'login', component: LoginComponent},
    {path: 'setup', component: SetupComponent},
    {path: 'home', component: HomeComponent, children:
    [
      {path: 'channels', children: [
        {path: ':id', component: ChannelComponent}
      ]}
    ]},
    {path: 'inbox', component: InboxComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
