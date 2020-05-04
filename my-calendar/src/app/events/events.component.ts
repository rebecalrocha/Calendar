import { Component, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid'; // for FullCalendar!
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ITS_JUST_ANGULAR } from '@angular/core/src/r3_symbols';
import { Router } from '@angular/router';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  constructor(
    private router: Router,
    private http: HttpClient) { }
  url = 'http://127.0.0.1:5000';

  ngOnInit(): void {
    this.getEvents();
  }
  
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  calendarPlugins = [dayGridPlugin]; // for FullCalendar!
  calendarHeader = {
    left: 'prev,next',
    center: 'title',
    right: 'dayGridDay,dayGridWeek,dayGridMonth'
  }
  calendarEvents = []
  handleEventClick(info){
    this.router.navigate(['/viewEvent/'+info.event.id]);
  }

  getEvents(){
      let request = this.http.get(this.url+'/events', { headers: new HttpHeaders({'api-key': this.currentUser.token})})
        .subscribe(data => {
          data.events.map(event => {
            this.calendarEvents = this.calendarEvents.concat({
              "title": event.description,
              "start": event.start_time,
              "end": event.end_time,
              "id": event.id
            })
          });
      })
  }

}

