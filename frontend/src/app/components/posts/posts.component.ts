import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Post } from 'src/app/interfaces/post';
import { PostService } from 'src/app/services/post.service';

import { of, pipe } from 'rxjs';
import {
  debounceTime,
  map,
  distinctUntilChanged,
  filter
} from "rxjs/operators";
@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
posts:Post[]=[]
busqueda:any={}
formPost=new FormControl('')
  constructor(private postService:PostService) { }

  ngOnInit(): void {
    this.GetPost('')
this.formPost.valueChanges.pipe(filter(res => res!.length > 0)
// Time in milliseconds between key events
, debounceTime(1000)
 
// If previous query is diffent from current   
, distinctUntilChanged()
).subscribe(res=>{
  console.log('mi res',res)
  
  this.GetPost(res)
})



  }
GetPost(dato:any){
  this.busqueda={dato}
  this.postService.getPost(this.busqueda).subscribe(data=>{
  this.posts=data
})
}
}
