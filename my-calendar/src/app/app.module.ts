import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular'; // for FullCalendar!
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EventsComponent } from './events/events.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import {AuthGuard} from './auth.guard';
import { FormsModule } from '@angular/forms';
import { CreateEventComponent } from './create-event/create-event.component';
import { DlDateTimeDateModule, DlDateTimePickerModule } from 'angular-bootstrap-datetimepicker';
import { ViewEventComponent } from './view-event/view-event.component';
import { EditEventComponent } from './edit-event/edit-event.component';
import { RegisterComponent } from './register/register.component';
 
   

@NgModule({
  declarations: [
    AppComponent,
    EventsComponent,
    LoginComponent,
    CreateEventComponent,
    ViewEventComponent,
    EditEventComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FullCalendarModule, // for FullCalendar!
    HttpClientModule,
    FormsModule,
    DlDateTimeDateModule,  // <--- Determines the data type of the model
    DlDateTimePickerModule,
  ],
  providers: [
    AuthenticationService, 
    AuthGuard,
    FormsModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
