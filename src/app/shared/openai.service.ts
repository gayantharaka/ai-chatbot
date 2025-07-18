import { HttpClient } from '@angular/common/http';
import { Injectable, model } from '@angular/core';
import { Observable,map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OpenaiService {
  // private readonly apiUrl = 'https://api.openai.com/v1/chat/completions';
  // private readonly apiKey = environment.openaiApiKey;

  // constructor(private http:HttpClient){}

  // getAssistantReply(userMessage:string):Observable<string>{
  // const body ={
  //   model:'gpt-3.5-turbo',
  //   messages:[{role:'user',content:userMessage}],
  //   temperature:0.7
  // };

  // return this.http.post<any>(this.apiUrl,body,{
  //   headers:{
  //     Authorization:`Bearer ${this.apiKey}`,
  //     'Content-Type':'application/json'
  //   }
  // }).pipe(
  //   map(res => res.choices[0].message.content.trim())
  // );
  // }
}
