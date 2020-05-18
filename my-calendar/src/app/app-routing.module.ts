import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuard} from './auth.guard';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {EventsComponent} from './events/events.component';
import { CreateEventComponent } from './create-event/create-event.component';
import { ViewEventComponent } from './view-event/view-event.component';
import { EditEventComponent } from './edit-event/edit-event.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: '', component: EventsComponent, canActivate: [AuthGuard]},
  {path: 'events', component: EventsComponent, canActivate: [AuthGuard]},
  {path: 'createEvent', component: CreateEventComponent, canActivate: [AuthGuard]},
  {path: 'viewEvent/:event_id', component: ViewEventComponent, canActivate: [AuthGuard]},
  {path: 'editEvent/:event_id', component: EditEventComponent, canActivate: [AuthGuard]},

  //senão volta para login
  {path: 'login', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
