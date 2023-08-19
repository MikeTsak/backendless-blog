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
  private headers = new HttpHeaders({
    'X-Master-Key': environment.apiMasterKey,
    'X-Access-Key': environment.apiAccessKey
  });

  constructor(private http: HttpClient) {}

  getPosts(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.apiUrl, { headers: this.headers });
  }

  addPost(post: Post): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, post, { headers: this.headers });
  }
}
