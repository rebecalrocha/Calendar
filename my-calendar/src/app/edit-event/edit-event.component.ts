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

  url = 'http://127.0.0.1:5000';
  currentUser = JSON.parse(localStorage.getItem('currentUser'));

  ngOnInit(): void {
    this.activatedRoute.paramMap
    .subscribe(params => {
      //console.log(params.params.event_id)
      this.event_id = params.params.event_id;
    });

    let request = this.http.get(this.url+'/get-event/'+this.event_id, { headers: new HttpHeaders({'api-key': this.currentUser.token})})
    .subscribe(data => {
      console.log(data.event)
      //console.log('start: ',data.event.start_time.replace("T", "    Time: "));

      let start = data.event.start_time.split("T");
      let end = data.event.end_time.split("T");
      this.description = data.event.description;
      this.start_date = start[0];
      this.start_time = start[1];
      this.end_date = end[0];
      this.end_time = end[1];
    })

    //this.teste = this.description; 2020-05-01 T00:00:00
    
  }


  edit(description, start_date, start_time, end_date, end_time) {
    let start = moment(this.start_date + "T" + this.start_time).format("YYYY-MM-DDTHH:mm:SS");
    let end = moment(this.end_date + "T" + this.end_time).format("YYYY-MM-DDTHH:mm:SS");
    let body = {"description": this.description, "start_time": start, "end_time": end}
    // console.log("altera start mas nao end ",this.start_time, this.end_time);

    this.http.post(this.url+'/edit-event/'+this.event_id, body, { headers: new HttpHeaders({'api-key': this.currentUser.token})})
      .subscribe(data => {
     console.log('o que o request retornou: ', data.event)
        this.router.navigate(['/events']);
    })

  }
  
}
