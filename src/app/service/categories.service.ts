import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ICategory } from '../interfacecs/category.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private dbPath = '/category';
  categoryRef: AngularFirestoreCollection<ICategory> = null;
  private url : string
constructor(private http: HttpClient,  private db: AngularFirestore) { 
  this.url = 'http://localhost:3000/category';
  this.categoryRef = this.db.collection(this.dbPath)
}
getJsonCategory(): Observable<Array<ICategory>>{
  return this.http.get<Array<ICategory>>(this.url)
}
postJsonCategory(category: ICategory): Observable<Array<ICategory>>{
  return this.http.post<Array<ICategory>>(this.url, category)
}
deleteJsonCategory(category: ICategory): Observable<Array<ICategory>>{
  return this.http.delete<Array<ICategory>>(`${this.url}/${category.id}`)
}
updateJsonCategory(category: ICategory): Observable<Array<ICategory>>{
  return this.http.put<Array<ICategory>>(`${this.url}/${category.id}`, category)
}
// -------------------------------------FireStore--------------------------------------

getAllCat():AngularFirestoreCollection<ICategory>{
  return this.categoryRef;
}
create(category: ICategory):any{
  return this.categoryRef.add( {...category} );
}
update(id:string, data: any):Promise<void>{
  return this.categoryRef.doc(id).update( {...data} );
}
delete(id:string):Promise<void>{
  return this.categoryRef.doc(id).delete();
}

}
