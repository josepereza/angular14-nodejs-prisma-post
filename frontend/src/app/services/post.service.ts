import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../interfaces/post';
@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http:HttpClient ) { }

getPost(dato:any):Observable<Post[]>{
  console.log('mi dato',dato)
  return this.http.post<Post[]>('http://localhost:3000/buscar',dato)
}

agregarPost(dato:any){
  
  return this.http.post('http://localhost:3000/postimagen',dato)
}
}
