import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-view-event',
  templateUrl: './view-event.component.html',
  styleUrls: ['./view-event.component.css']
})
export class ViewEventComponent implements OnInit {
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private http: HttpClient){}

  event_id : number;
  description : String;
  start : String;
  end : String;

  url = 'http://127.0.0.1:5000';
  currentUser = JSON.parse(localStorage.getItem('currentUser'));

  ngOnInit(): void {
    //pegando id do evento enviado pelo path
    this.activatedRoute.paramMap
    .subscribe((params : any) => {
      this.event_id = params.params.event_id;
    });

    this.http.get(this.url+'/events/'+this.event_id, { headers: new HttpHeaders({'api-key': this.currentUser.token})})
    .subscribe((data : any) => {
      this.description = data.event.description;
      this.start = moment(data.event.start_time).format('MMMM Do YYYY, h:mm:ss a');
      this.end = moment(data.event.end_time).format('MMMM Do YYYY, h:mm:ss a');
    })
  }

  delete(){
    this.http.delete(this.url+'/events/'+this.event_id, { headers: new HttpHeaders({'api-key': this.currentUser.token})})
    .subscribe((data : any) => {
      if (data.message){
        this.router.navigate(['/events'], { queryParams: { message: data.message } });
      }
    })
  }

  handleEditClick(){
    this.router.navigate(['/editEvent/'+this.event_id]);
  }

}
