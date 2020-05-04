import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router) { }
  url = 'http://127.0.0.1:5000';

  ngOnInit(): void {
  }

  currentUser = JSON.parse(localStorage.getItem('currentUser'));

  create(description, start_date, start_time, end_date, end_time){

    let body = {"description": description, "start_time": start_date+"T"+start_time+":00", "end_time": end_date+"T"+end_time+":00"}
    console.log(body)

    let request = this.http.post(this.url+'/create-events', body, { headers: new HttpHeaders({'api-key': this.currentUser.token})})
        .subscribe(data => {
          console.log(data)
          this.router.navigate(['/events']);
        })
  }

}
