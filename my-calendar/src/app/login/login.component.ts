import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  error = '';

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService) { }

  login(email, password){
    this.authenticationService.login(email, password)
      .subscribe(data => {
        if(data) {
          this.router.navigate(['/events'])
        } 
        else {
          this.error = 'email or password is incorrect'
        }
      });
  }
}
