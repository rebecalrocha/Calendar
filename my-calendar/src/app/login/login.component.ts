import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loading = false;
  error = '';

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    // reset login status
    this.authenticationService.logout();
  }

  login(email, password){
    this.loading = true;
    this.authenticationService.login(email, password)
      .subscribe(result => {
        console.log("entrei no subscribe e o result é: ", result)
        if (result) {
          console.log("deu bom")
          this.router.navigate(['/events']);
        } else{
          this.error = 'email or password is incorrect';
          this.loading = false;
        }
      });
  }
}
