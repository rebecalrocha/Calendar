import { Component, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid'; 
import interactionPlugin from '@fullcalendar/interaction';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  constructor(private router: Router, private http: HttpClient,  private activatedRoute: ActivatedRoute) { }
  
  message = null;
  calendarEvents = []
  url = 'http://127.0.0.1:5000';

  ngOnInit(): void {
    this.getEvents();

    this.activatedRoute.queryParamMap
      .subscribe(params => {
         this.message = params.params.message;
      });
  }
  
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  calendarPlugins = [dayGridPlugin, interactionPlugin]; // for FullCalendar!
  calendarHeader = {
    left: 'prev,next',
    center: 'title',
    right: 'dayGridDay,dayGridWeek,dayGridMonth'
  }

  handleEventClick(info) {
    this.router.navigate(['/viewEvent/'+info.event.id]);
  }

  handleDateClick(info) {
    this.router.navigate(['/createEvent'], { queryParams: { start_date: info.dateStr, end_date: info.dateStr } });
  }

  getEvents(){
    this.http.get(this.url+'/events', { headers: new HttpHeaders({'api-key': this.currentUser.token})})
      .subscribe(data => {
        data.events.map(event => {
          this.calendarEvents = this.calendarEvents.concat({
            "title": event.description,
            "start": event.start_time,
            "end": event.end_time,
            "id": event.id
          })
        });
      });
  }
}

