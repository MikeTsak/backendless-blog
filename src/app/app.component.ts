import { Component } from '@angular/core';
import { PostService, Post } from './post.service';

interface ApiResponse {
  record: Post[];
  metadata: {
    id: string;
    private: boolean;
    createdAt: Date;
    name: string;
  };
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = '';
  content = '';
  posts: Post[] = [];

  constructor(private postService: PostService) {
    this.loadPosts();
  }

  loadPosts(): void {
    this.postService.getPosts().subscribe((data: ApiResponse) => {
      this.posts = data.record;
    });    
  }

  addPost(): void {
    if (this.title && this.content) {
      const post: Post = {
        title: this.title,
        content: this.content,
        date: new Date()
      };
      this.postService.addPost(post).subscribe(response => {
        this.posts = response; // update the local list with the entire updated list from the server
        this.title = '';
        this.content = '';
      });
    }
  }

}
