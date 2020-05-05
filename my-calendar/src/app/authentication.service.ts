import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthenticationService {
    public token: string;

    constructor(private http: HttpClient) {
        // set token if saved in local storage
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        //se currentUser não é null e se tem token
        this.token = currentUser && currentUser.token;
    }

    login(email, password) : Observable<any> {
        console.log("entrei no login")
        return this.http.post('http://127.0.0.1:5000/login', JSON.stringify({ email: email, password: password }))
            .pipe(
                map(data  => {
                    //login successful if there's a jwt token in the response
                    console.log("data: ", data)
                    let token = data && data["token"];
                    console.log("token: ", token)
                    if (token) {
                        // set token property
                        this.token = token;

                        // store email and jwt token in local storage to keep user logged in between page refreshes
                        localStorage.setItem('currentUser', JSON.stringify({ email: email, token: token }));
                        console.log("guardei no local storage")
                    }
                    console.log("map já retornou data")
                    return data;
                })
            );
    }

    logout(): void {
        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.removeItem('currentUser');
    }
}