import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { IBlog } from '../interfacecs/blog.interface';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
private blog: Array<IBlog> = []
localBlog:IBlog;
oneblog: Subject<any> = new Subject<any>();
private url : string
private dbPath = '/blog';
blogRef: AngularFirestoreCollection<IBlog> = null;
constructor(private http: HttpClient,  private db: AngularFirestore) { 
  this.url = 'http://localhost:3000/blog';
  this.blogRef = this.db.collection(this.dbPath);
}
  getJsonBlogs(): Observable<Array<IBlog>>{
    return this.http.get<Array<IBlog>>(this.url)
  }
  postJsonBlogs(blog: IBlog): Observable<Array<IBlog>>{
    return this.http.post<Array<IBlog>>(this.url, blog)
  }
  deleteJsonBlog(blog: IBlog): Observable<Array<IBlog>>{
    return this.http.delete<Array<IBlog>>(`${this.url}/${blog.id}`)
  }
  updateJsonBlog(blog: IBlog): Observable<Array<IBlog>>{
    return this.http.put<Array<IBlog>>(`${this.url}/${blog.id}`, blog)
  }
  getOneJSONBlog(id:number | string): Observable<IBlog>{
    return this.http.get<IBlog>(`${this.url}/${id}`)
  }

    // -------------------------------------FireStore--------------------------------------

getAllBlog():AngularFirestoreCollection<IBlog>{
  return this.blogRef;
}
create(category: IBlog):any{
  return this.blogRef.add( {...category} );
}
update(id:string, data: any):Promise<void>{
  return this.blogRef.doc(id).update( {...data} );
}
delete(id:string):Promise<void>{
  return this.blogRef.doc(id).delete();
}
getOneBlog(blog: string): void{
  // this.localBlog = []

  
 this.blogRef.ref.where('id', '==', blog).onSnapshot(
  
    snap => {
      console.log('sdfsd');
      snap.forEach(userRef => {
        console.log(userRef.data());
        
        this.localBlog = userRef.data()
        this.oneblog.next(this.localBlog);
        console.log(this.localBlog);
        
      })
    })
 
}
}
