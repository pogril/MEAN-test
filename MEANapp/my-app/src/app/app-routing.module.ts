import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChannelComponent } from './feeds/channel/channel.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
  {path: '', children:
  [
    {path: 'login', component: LoginComponent},
    {path: 'home', component: HomeComponent, children:
    [
      {path: 'channels', children: [
        {path: ':id', component: ChannelComponent}
      ]}
    ]}
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
