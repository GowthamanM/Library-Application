import { Component, OnInit } from '@angular/core';
import { CheckIn } from 'src/app/models/check-in';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'app-log-detail',
  templateUrl: './log-detail.component.html',
  styleUrls: ['./log-detail.component.css']
})
export class LogDetailComponent implements OnInit {
  dateJson:any={};
  searchDate:any="";
  checkInData:any;
  InData:any;
  OutData:any;
  date:Date=new Date();
  day:any = String(this.date.getDate()).padStart(2, '0');
  month:any = String(this.date.getMonth()+1).padStart(2, '0');
  year:any = String(this.date.getFullYear());
  constructor(private logService:LogService) {
    this.searchDate+=this.year+'-';
    this.searchDate+=this.month+'-';
    this.searchDate+=this.day;
    this.dateJson.date = this.searchDate;
    console.log(this.dateJson);
   }

  ngOnInit(): void {
    console.log(this.searchDate);
    this.logService.getCheckIn(this.dateJson).subscribe((data)=>{
      this.checkInData = data;
      console.log(data);
      this.InData = data.filter((d:any)=> (d.in_out === "IN"));
      this.OutData = data.filter((d:any)=> (d.in_out === "OUT"));
    });
  }

  searchLog(){
    // console.log(this.searchDate);
    // this.dateJson.date = this.searchDate;
    // this.logService.getCheckIn(this.dateJson).subscribe((data)=>{
    //   this.checkInData = data;
    //   console.log(data);
    //   this.InData = data.filter((d:any)=> (d.in_out === "IN"));
    //   this.OutData = data.filter((d:any)=> (d.in_out === "OUT"));
    // });
    this.ngOnInit();
  }
  
}
