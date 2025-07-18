import { Injectable } from '@angular/core';
import { from, Observable, switchMap } from 'rxjs';
import { supabase } from '../supabase-client';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  // Add a new chat message (user or assistant)
  addMessage(role:'user' | 'assistant',content:string):Observable<any>{
    return from(supabase.auth.getUser()).pipe(
      switchMap(({data}) =>{
        const userId = data.user?.id;
        console.log('Current user ID:', userId);
        if(!userId){
          throw new Error('User not authenticated');
        }

        return from(
          supabase.from('chat_messages').insert([
              {
                role,
                content,
                user_id:userId
              }

          ])
        );
      })
    );
  }

  // Get all chat messages ordered by creation time
  getMessages():Observable<any>{
    return from(
      supabase.from('chat_messages')
      .select('*')
      .order('created_at',{ascending:true})
    );
  }

}
