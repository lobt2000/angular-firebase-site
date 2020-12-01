import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { IProduct } from '../interfacecs/product.interface';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private url: string;
  private dbPath = '/products';
  localProd: Array<IProduct> = []
  prod: Subject<any> = new Subject<any>();
  productsRef: AngularFirestoreCollection<IProduct> = null;
  constructor(private http: HttpClient, private db: AngularFirestore) {
    this.url = 'http://localhost:3000/products';
    this.productsRef = this.db.collection(this.dbPath);
    this.localProd = [];
  }

  getProducts(): Observable<Array<IProduct>> {
    return this.http.get<Array<IProduct>>(this.url);
  }

  postProduct(product: IProduct): Observable<IProduct> {
    return this.http.post<IProduct>(this.url, product);
  }

  updateProduct(product: IProduct): Observable<IProduct> {
    return this.http.put<IProduct>(`${this.url}/${product.id}`, product);
  }

  deleteProduct(product: IProduct): Observable<IProduct> {
    return this.http.delete<IProduct>(`${this.url}/${product.id}`);
  }
  getCategoryProduct(category: string): Observable<Array<IProduct>> {
    return this.http.get<Array<IProduct>>(`${this.url}?category.name=${category}`)
  }
  getOneProduct(id: number | string): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.url}/${id}`)
  }
  // -------------------------------------FireStore--------------------------------------

getAllProd():AngularFirestoreCollection<IProduct>{
  return this.productsRef;
  
  
}
create(category: IProduct):any{
  return this.productsRef.add( {...category} );
}
update(id:string, data: any):Promise<void>{
  return this.productsRef.doc(id).update( {...data} );
}
delete(id:string):Promise<void>{
  return this.productsRef.doc(id).delete();
}
getProduct(category: string): void{
  this.localProd = []
  console.log('sdfsd');
  
 this.productsRef.ref.where('category.name', '==', category).onSnapshot(
    snap => {
      this.localProd = []
      snap.forEach(userRef => {
        
        this.localProd.push(userRef.data())
        this.prod.next(this.localProd);
      })
    })
 
}


}
