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
  constructor(private http: HttpClient, private router: Router, private authenticationService: AuthenticationService) { }

  error = null;
  url = 'http://127.0.0.1:5000';

  register(email, password){
    let body = {"email": email, "password": password}

    this.http.post(this.url+'/register', body)
      .subscribe((data : any) => {
        if (data && data["error"]) {
          this.error = data["error"]          
        }
        else {
          this.authenticationService.login(email, password)
            .subscribe(res => {
              if(res) {
                this.router.navigate(['/events'], { queryParams: { message: data.message } });
              }
            });
        }
      })
  }

}
