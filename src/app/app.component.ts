import { Component } from '@angular/core';
import { HttpClient,HttpParams,HttpHeaders } from '@angular/common/http';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Schedule Tasks';

  private serverUrl = 'http://127.0.0.1:8080/gs-guide-websocket';
  private stompClient;

  initializeWebSocketConnection(){
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({}, function(frame) {
      that.stompClient.subscribe("/topic/greetings", (message) => {
        if(message.body) {
          //console.log(message.body);
          if (message.body instanceof Array){
            console.log('recieve data:'+message.body.length);
            this.tasks = message.body;
            if (message.body.length > 0) {
              this.task = message.body[0];
            }
          }
        }
      });
    });
  }

  sendMessage(message){
    this.stompClient.send("/app/hello" , {}, message);
    $('#input').val('');
  }

  constructor(private http: HttpClient){
    this.initializeWebSocketConnection();
  }

  public task = {};
  public tasks = []; 
  ngOnInit(): void {
    this.loadTask();
  }

  loadTask() {
  	this.http.get('http://127.0.0.1:8080/tasks').subscribe(data => {
      console.log(data);
      if (data instanceof Array){
        this.tasks = data;
        if (data.length > 0) {
          this.task = data[0];
        }
      }
      
    });
  }

  selectTask(task) {
  	console.log(task);
  	this.task = task;
  	console.log(task);
  }

  postponeTask(id) {
  	console.log(id);
  }

  deleteTask(id) {
  	console.log(id);
  	this.http.delete('http://127.0.0.1:8080/tasks/'+id).subscribe(data => {
      console.log(data);
      this.loadTask();
    });
  }

  modifyTask(id,title,description,priority,status) {
  	console.log(id+","+title+","+description+","+priority+","+status);

  	const body = new HttpParams()
    .set('title', title)
    .set('description', description)
    .set('priority', priority)
    .set('status', status);

  	this.http.put('http://127.0.0.1:8080/tasks/'+id, 
  	body.toString(),
  	{
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
    })
      .subscribe(
        res => {
          console.log(res);
          this.loadTask();
        },
        err => {
          console.log("Error occured");
        }
      );
  }
}
