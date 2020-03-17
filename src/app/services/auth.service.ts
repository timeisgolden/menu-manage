import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { auth } from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { User } from 'firebase';
import { AngularFirestoreDocument, CollectionReference, AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: User;
  userRef: CollectionReference;
  constructor(public afAuth: AngularFireAuth, public router: Router, private firestore: AngularFirestore) {
    this.userRef = this.firestore.collection('users').ref;

    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
      } else {
        localStorage.setItem('user', null);
      }
    })
  }



  async login(email: string, password: string) {
    var result = await this.afAuth.auth.signInWithEmailAndPassword(email, password);
    console.log("login result:", result);

    this.router.navigate(['menus']);
  }

  async register(email: string, password: string, fullname: string) {
    var result = await this.afAuth.auth.createUserWithEmailAndPassword(email, password);
    this.sendEmailVerification();
    console.log("fullname:", fullname);
    await result.user.updateProfile({ displayName: fullname, photoURL: '' });
    this.SetUserData(result.user);
  }

  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.firestore.doc(`users/${user.uid}`);
    const userData: any = {
      email: user.email,
      displayName: user.displayName,
      phone: '',
      address: '',
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    }
    return userRef.set(userData, {
      merge: true
    });
  }


  async sendEmailVerification() {
    await this.afAuth.auth.currentUser.sendEmailVerification()
    this.router.navigate(['verify-email']);
  }

  async logout() {
    await this.afAuth.auth.signOut();
    localStorage.removeItem('user');
    this.router.navigate(['login']);
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null;
  }
  get currentUser(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user;
  }

  async updateProfile(uid, displayName: string, phone: string, address: string) {
    if (!uid) return;
    let data = {
      displayName: displayName,
      phone: phone,
      address: address
    }
    this.firestore.collection('users').doc(uid).update(data);
  }

  async changePassword(uid, password) {
    if (!uid) return;
    return this.afAuth.auth.currentUser.updatePassword(password).then(response => {
      console.log(">>>>response:", response);
      // let currentUser = this.currentUser;
      // save localstorage
      // localStorage.setItem('user', JSON.stringify(currentUser));
      // save to database
      // this.SetUserData(currentUser);
    }).catch(error => {
      console.error("displayName Error:", JSON.stringify(error));
    });
  }

  getUserInfo(uid) {
    return this.firestore.collection('users').doc(uid).snapshotChanges();
  }

}
