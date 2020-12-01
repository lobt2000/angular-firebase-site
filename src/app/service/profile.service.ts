import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { IUser } from '../interfacecs/user.interface';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  localUser: IUser;
  private dbPath = '/users';
  profRef: AngularFirestoreCollection<IUser> = null;
  constructor(
    private db: AngularFirestore
  ) {
    this.profRef = this.db.collection(this.dbPath);
   }


  // getUser(): Observable<IUser>{
  //   return  JSON.parse(localStorage.getItem('user'));
  // }  
  // update(id:string, data: any):Promise<void>{
  //   return this.profRef.doc(id).update( {...data} );
  // }
}
