import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { User } from '@supabase/supabase-js';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  user: User | null = null;

  constructor(private auth: AuthService){
  }

  ngOnInit(): void {
    
  this.auth.user$.subscribe((user)=>{
    this.user = user;
    console.log("avatar url:",this.user?.user_metadata["avatar_url"]);
  });
  }

  signIn(){
    this.auth.signInWithGoogle();
  }

  signOut(){
    this.auth.signOut();
  }

}
