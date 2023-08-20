import { Component } from '@angular/core';
import { PostService, Post } from './post.service';
import { Uploader, UploadWidgetConfig, UploadWidgetResult } from 'uploader';
import { environment } from '../environments/environment';

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
  isDarkTheme = false;

  showImagePreview: boolean = false;
  currentPreviewImage: string = '';

  toggleTheme(event: any) {
    this.isDarkTheme = event.checked;
    console.log(this.isDarkTheme);
    const theme = this.isDarkTheme ? 'dark-mode' : 'light-theme';
    document.body.className = theme;
  }

  toggleImagePreview(imageUrl: string, event?: MouseEvent) {
    if (event) {
        event.stopPropagation(); // Stop event from bubbling up
    }
    this.showImagePreview = !this.showImagePreview;
    this.currentPreviewImage = imageUrl;
}



  uploader = Uploader({ apiKey: environment.bytescaleApiKey });
  options: UploadWidgetConfig = {
    multi: false
  };
  uploadedFileUrl: string | undefined = undefined;

  constructor(private postService: PostService) {
    this.loadPosts();
  }

  loadPosts(): void {
    this.postService.getPosts().subscribe((data: ApiResponse) => {
      this.posts = data.record;
    });    
  }

  onComplete = (files: UploadWidgetResult[]) => {
    this.uploadedFileUrl = files[0]?.fileUrl;
  };

  addPost(): void {
    if (this.title && this.content) {
      const post: Post = {
        title: this.title,
        content: this.content,
        date: new Date(),
        imageUrl: this.uploadedFileUrl
      };
      this.postService.addPost(post).subscribe(response => {
        this.posts = response; // update the local list with the entire updated list from the server
        this.title = '';
        this.content = '';
      });
    }
  }

}
