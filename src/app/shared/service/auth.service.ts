import { Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import firebase from 'firebase/compat/app';
import { ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import {loginPath} from "../routes";

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private readonly fireauth: AngularFireAuth,
    private readonly toast: ToastController,
    private readonly router: Router
  ) {}

  currentUser = (): Observable<firebase.User | null> => this.fireauth.user;

  loginWithGithub = (next?: () => void): void => {
    from(this.fireauth.signInWithPopup(new firebase.auth.GithubAuthProvider())).subscribe({
      next: next || (() => {}),
      error: (error) => this.displayLoginError(error),
    });
  };

  loginWithGoogle = (next?: () => void): void => {
    from(this.fireauth.signInWithPopup(new firebase.auth.GoogleAuthProvider())).subscribe({
      next: next || (() => {}),
      error: (error) => this.displayLoginError(error),
    });
  };

  logout = (): void => {
    this.fireauth.signOut();
    this.router.navigate([`/${loginPath}`]);
  };

  // --------------
  // Helper methods
  // --------------

  private displayLoginError = (error: firebase.auth.Error): void => {
    console.error(error);
    this.toast
      .create({
        message: error.message,
        duration: 5000,
        position: 'bottom',
        color: 'danger',
        icon: 'alert-circle',
      })
      .then((toast) => toast.present());
  };
}
