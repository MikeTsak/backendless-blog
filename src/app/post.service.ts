import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment'; 

export interface ApiResponse {
  record: Post[];
  metadata: {
    id: string;
    private: boolean;
    createdAt: Date;
    name: string;
  };
}

export interface Post {
  title: string;
  content: string;
  date: Date;
}

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = environment.apiUrl;
  private apiUrlPUT = environment.apiUrlPUT;
  private headers = new HttpHeaders({
    'X-Master-Key': environment.apiMasterKey,
    'X-Access-Key': environment.apiAccessKey,
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) {}

  getPosts(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.apiUrl, { headers: this.headers });
  }

addPost(post: Post): Observable<Post[]> {
    // Step 1: Fetch existing data
    return new Observable<Post[]>(observer => {
      this.getPosts().subscribe(data => {
        // Step 2: Append the new post to the existing list
        const updatedPosts = [...data.record, post];

        // Step 3: Update the bin with the updatedPosts array
        this.http.put<Post[]>(this.apiUrlPUT, updatedPosts, { headers: this.headers }).subscribe(
          () => {
            observer.next(updatedPosts);
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        );
      });
    });
}


}
