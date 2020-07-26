import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TicketComponent } from './feeds/ticket/ticket.component';
import { MessageComponent } from './feeds/message/message.component';
import { HeaderComponent } from './header/header.component';
import { ChannelComponent } from './feeds/channel/channel.component';
import { SignupComponent } from './forms/signup/signup.component';
import { NewChannelFormComponent } from './forms/new-channel/new-channel.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthInterceptor } from './services/http-interceptors/auth-interceptor';
import { SetupComponent } from './forms/user-setup/setup.component';
import { InboxComponent } from './feeds/inbox/inbox.component'

@NgModule({
  declarations: [
    AppComponent,
    TicketComponent,
    MessageComponent,
    HeaderComponent,
    SignupComponent,
    ChannelComponent,
    NewChannelFormComponent,
    HomeComponent,
    LoginComponent,
    SetupComponent,
    InboxComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatDividerModule,
    HttpClientModule,
    MatIconModule,
    MatTabsModule,
    LayoutModule
  ],
  entryComponents: [NewChannelFormComponent],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
