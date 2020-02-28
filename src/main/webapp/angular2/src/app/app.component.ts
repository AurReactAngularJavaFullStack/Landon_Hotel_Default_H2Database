import { Component,OnInit } from '@angular/core';
import { FormControl, FormGroup} from "@angular/forms";
//import '../node_modules/bootstrap/dist/css/bootstrap.css';
import {Http, Response} from @angular/http;
import { Observable} from "rxjs/Rx"
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  constructor(private http:Http) {}

  private baseUrl:string = 'http://localhost:8080';
  public submitted:boolean;
  roomsearch : FormGroup;
  rooms:Room[];
  currentCheckInVal:string;
  currentCheckOutVal:string;
  
  ngOnInit(){
  	this.roomsearch = new FormGroup({
  		checkin: new FormControl(''),
  		checkout : new FormControl('')
  	});
  	
  	const roomsearchValueChange$ = this.roomsearch.valueChanges;
  	
  	roomsearchValueChange$.subscribe( valChange => {
  			currentCheckInVal = valChange.checkin;
  			currentCheckOutVal = valChange.checkout;
  			}
  	)
  	//this.rooms = ROOMS;
  	
  }
  
  onSubmit({value,valid}:{value:Roomsearch, valid:boolean}){
  	this.getAll()
  		.subscribe(
  		rooms => this.rooms = rooms,
  		err => {
  			console.log(err);
  			}
  		);
  }
  
  reserveRoom(value:string){
  	<!--console.log("Room id for reservation: " +value);-->
  	this.request = new ReserveRoomRequest(value, this.currentCheckInVal,this.currentCheckOutVal);
  }
  
  getAll():Observable<Room[]>{
  	return this.http.get(this.baseUrl + '/room/reservation/v1?checkin='+ this.currentCheckInVal + '&checkout=' + this.currentCheckOutVal);
  	map(this.mapRoom);
  }
  
  createReservation(body: ReserveRoomRequest){
  	let bodyString = JSON.stringify(body);
  	let headers = new Headers({'Content-type':'application/json'});
  	let option = new RequestOptions{headers: headers});
  	
  	this.http.post(this.baseUrl + '/room/reservation/v1',body, option)
  		.subscribe(res => console.log(res));
  
  }
  
  mapRoom(response:Response):Room[]{
  	return response.json().content;
  }
}

  export interface Roomsearch {
  	checkin:string;
  	checkout:string;
  }
  export interface Room {
  	id:string;
  	roomNumber:string;
  	price:string;
  	links:string;
  }
  
  export class ReserveRoomRequest{
  	roomId:string;
  	checkin:string;
  	checkout:string;
  	
  	constructor(
  		roomId:string,
  		checkin:string,
  		checkout:string
  	){
  		this.roomId = roomId;
  		this.checkin = checkin;
  		this.checkout = checkout;
  	}
  
  }
<!--  var ROOMS:Room[] =[
  {
  	"id" : "38932123",
  	"roomNumber" : "409",
  	"price" : "20",
  	"links" : ""
  },
  {
  	"id" : "83232323",
  	"roomNumber" : "410",
  	"price" : "25",
  	"links" : ""
  },
  {
  	"id" : "1264554",
  	"roomNumber" : "411",
  	"price" : "28",
  	"links" : ""
  }
];-->
 