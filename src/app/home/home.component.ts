import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CheckIn } from '../models/check-in';
import { LogService } from '../services/log.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  

  constructor() { }

  ngOnInit(): void {
  }
  
}
