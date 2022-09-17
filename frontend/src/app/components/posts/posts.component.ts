import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Post } from 'src/app/interfaces/post';
import { PostService } from 'src/app/services/post.service';

import { of, pipe } from 'rxjs';
import {
  debounceTime,
  map,
  distinctUntilChanged,
  filter,
} from 'rxjs/operators';
@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
})
export class PostsComponent implements OnInit {
  imageFile!: File;
  posts: Post[] = [];
  busqueda: any = {};
  formBusqueda = new FormControl('');

  constructor(private postService: PostService, private fb: FormBuilder) {}
  postForm = this.fb.nonNullable.group({
    title: [''],
    content: [''],
    authorEmail: [''],
  });
  ngOnInit(): void {
    this.GetPost('');
    this.formBusqueda.valueChanges
      .pipe(
        filter((res) => res!.length > 0),
        // Time in milliseconds between key events
        debounceTime(1000),

        // If previous query is diffent from current
        distinctUntilChanged()
      )
      .subscribe((res) => {
        console.log('mi res', res);

        this.GetPost(res);
      });
  }

  onFileSelect(event: any) {
    console.log(event.target.files.length);
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.imageFile = file;
    }
  }
  GetPost(dato: any) {
    this.busqueda = { dato };
    if (dato.length == 1) {
      this.busqueda = { dato: ' ' };
    }
    this.postService.getPost(this.busqueda).subscribe((data) => {
      this.posts = data;
    });
  }
  enviar() {
    let formData = new FormData();
    formData.append('title', this.postForm.get('title')!.value);
    formData.append('content', this.postForm.get('content')!.value);
    formData.append('authorEmail', this.postForm.get('authorEmail')!.value);
    formData.append('image', this.imageFile);

    this.postService.agregarPost(formData).subscribe((data) => {
      this.GetPost('');
    });
    console.log(this.postForm.value);
  }
}
