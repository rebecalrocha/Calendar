import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {HomeComponent} from './home/home.component';
import {EventsComponent} from './events/events.component';
import {LoginComponent} from './login/login.component';
import {AuthGuard} from './auth.guard';
import { CreateEventComponent } from './create-event/create-event.component';
import { ViewEventComponent } from './view-event/view-event.component';
import { EditEventComponent } from './edit-event/edit-event.component';

const routes: Routes = [
  {path: '', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'events', component: EventsComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
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
