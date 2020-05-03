import { Component, OnInit } from '@angular/core';
const createContainer = document.getElementsByClassName("create")[0];
const caixa = document.querySelector('#title');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  eventCounter = 0;

  constructor() { }

  ngOnInit(): void {
  }

  createEvent() {

    //createContainer.style.visibility = "visible";
    this.eventCounter += 1;
  }

}
