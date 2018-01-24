import { Component } from '@angular/core';
import { HttpClient,HttpParams,HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Schedule Tasks';

  constructor(private http: HttpClient){
  }

  public task:{};
  public tasks:[]; 
  ngOnInit(): void {
    this.loadTask();
  }

  loadTask() {
  	this.http.get('http://127.0.0.1:8080/tasks').subscribe(data => {
      console.log(data);
      this.tasks = data;
      if (data.length > 0) {
      	this.task = data[0];
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
