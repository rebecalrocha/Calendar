import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css']
})
export class EditEventComponent implements OnInit {
  event_id: number;
  description: string;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
  end: string

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient) { }

  error = null;
  url = 'http://127.0.0.1:5000';
  currentUser = JSON.parse(localStorage.getItem('currentUser'));

  ngOnInit(): void {
    this.activatedRoute.paramMap
    .subscribe((params : any) => {
      this.event_id = params.params.event_id;
    });

    this.http.get(this.url+'/events/'+this.event_id, { headers: new HttpHeaders({'api-key': this.currentUser.token})})
    .subscribe((data : any) => {
      console.log(data.event)

       let start = data.event.start_time.split("T");
       let end = data.event.end_time.split("T");
       this.description = data.event.description;
       this.start_date = start[0];
       this.start_time = start[1];
       this.end_date = end[0];
       this.end_time = end[1];
    })
    
  }

  edit(description, start_date, start_time, end_date, end_time) {
    let start = moment(this.start_date + "T" + this.start_time).format("YYYY-MM-DDTHH:mm:SS");
    let end = moment(this.end_date + "T" + this.end_time).format("YYYY-MM-DDTHH:mm:SS");
    let body = {"description": this.description, "start_time": start, "end_time": end}

    this.http.put(this.url+'/events/'+this.event_id, body, { headers: new HttpHeaders({'api-key': this.currentUser.token})})
      .subscribe(data => {
        if (data && data["error"]) {
          this.error = data["error"]          
        }
        else {
          this.router.navigate(['/events'])
        }
    })
  }
  
}
