import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  error = '';

  constructor(
    private http: HttpClient, 
    private router: Router,
    private authenticationService: AuthenticationService) { }
  
  url = 'http://127.0.0.1:5000';

  register(email, password){
    let body = {"email": email, "password": password}
    console.log(body)

    this.http.post(this.url+'/register', body)
      .subscribe(data => {
        if(data) {
          this.authenticationService.login(email, password)
          .subscribe(req => {
            if(req) {
              this.router.navigate(['/events'])
            }
          });
        } 
        else{
          this.error = 'email already registered';
        }
      })
  }

}
