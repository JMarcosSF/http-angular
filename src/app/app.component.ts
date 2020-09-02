import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map} from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loadedPosts = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchPosts();
  }

  onCreatePost(postData: { title: string; content: string }) {
    // Send Http request
    this.http
      .post(
        'https://ng-course-recipe-book-ac604.firebaseio.com/posts.json',
        postData
      ).subscribe(responseData => {
        console.log(responseData);
      });
  }

  onFetchPosts() {
    // Send Http request
    this.fetchPosts();
  }

  private fetchPosts() {
    this.http.get('https://ng-course-recipe-book-ac604.firebaseio.com/posts.json')
      .pipe(map(resp => {
        const postsArray = [];
        for(const key in resp) {
          if(resp.hasOwnProperty(key)) {
            postsArray.push({...resp[key], id: key});
          }
        }
        return postsArray;
      }))
      .subscribe(resp => {
        console.log(resp);
      })
  }

  onClearPosts() {
    // Send Http request
  }
}
