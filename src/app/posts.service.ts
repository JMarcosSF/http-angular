import {Injectable} from "@angular/core";
import {Post} from "./post.model";
import {HttpClient, HttpEventType, HttpHeaders, HttpParams} from "@angular/common/http";
import {catchError, map, tap} from "rxjs/operators";
import {Subject, throwError} from "rxjs";

@Injectable({providedIn: "root"})
export class PostsService {
  error = new Subject<string>();

  constructor(private http: HttpClient) {
  }

  createAndStorePost(title: string, content: string) {
    const postData: Post = {title: title, content: content}
    this.http.post<{ name: string }>(
        'https://ng-course-recipe-book-ac604.firebaseio.com/posts.json',
        postData,
      {
        observe: 'body'
      }
      ).subscribe(responseData => {
        console.log(responseData);
      }, error => {
        this.error.next(error.message);
    });
  }

  fetchPosts() {
    let params = new HttpParams();
    params = params.append('print', 'pretty');
    params = params.append('custom', 'key');
    return this.http.get<{[key: string]: Post}>('https://ng-course-recipe-book-ac604.firebaseio.com/posts.json',
      {
        headers: new HttpHeaders({'Custom-Header': 'Hello!!!!'}),
        params: params,
      })
      .pipe(
        map(responseData => {
          const postsArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArray.push({ ...responseData[key], id: key });
            }
          }
          return postsArray;
        }),
        catchError(errorResp => {
          return throwError(errorResp);
        })
      )
  }

  deletePosts() {
    return this.http.delete('https://ng-course-recipe-book-ac604.firebaseio.com/posts.json',
      {
        observe: 'events',
      }).pipe(tap(event => {
        console.log(event);
        if(event.type === HttpEventType.Response) {
          console.log(event.body);
        }
        if(event.type === HttpEventType.Sent) {
          console.log('is Sent type')
        }
    }));
  }

}
