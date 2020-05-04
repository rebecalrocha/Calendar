import { Component, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid'; // for FullCalendar!
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  constructor(private http: HttpClient) { }
  url = 'http://127.0.0.1:5000';

  ngOnInit(): void {
    this.getEvents();
  }

  calendarPlugins = [dayGridPlugin]; // for FullCalendar!
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  
  calendarEvents = []

  getEvents(){
      let request = this.http.get(this.url+'/events', { headers: new HttpHeaders({'api-key': this.currentUser.token})})
        .subscribe(data => {
          data["events"].map(event => {
            this.calendarEvents = this.calendarEvents.concat({
              "title": event.description,
              "start": event.start_time,
              "end": event.end_time
            })
          });
      })
  }

}
