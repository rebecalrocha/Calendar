import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private authenticationService: AuthenticationService, private router: Router) { }

  isLogged() : boolean {
    if (this.authenticationService.token) {
      return true;
    }

    return false;
  }

  logout(){
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
