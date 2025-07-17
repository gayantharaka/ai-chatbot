import { Injectable } from '@angular/core';
import { supabase } from '../supabase-client';
import { BehaviorSubject } from 'rxjs';
import { User } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

 private _user$ = new BehaviorSubject<User | null>(null);
 public user$ = this._user$.asObservable();

 constructor(){
  supabase.auth.getUser().then(({data})=>{
    this._user$.next(data.user);
  });

  supabase.auth.onAuthStateChange((event,session)=>{
    this._user$.next(session?.user ?? null);
  })
 }

  signInWithGoogle(){
    return supabase.auth.signInWithOAuth({provider:'google'});
  }

  signOut(){
    return supabase.auth.signOut()
  }

}
