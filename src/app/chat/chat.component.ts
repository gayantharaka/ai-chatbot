import { Component, OnInit } from '@angular/core';
import { ChatMessage } from './chat-message.model';
import { ChatService } from './chat.service';
import { OpenaiService } from '../shared/openai.service';
import { supabase } from '../supabase-client';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
  userMessage:string ='';
  messages:ChatMessage[]=[];

  constructor(private chatService:ChatService,private openAi:OpenaiService){}

  ngOnInit(): void {
    this.chatService.getMessages().subscribe(({data})=>{
      this.messages = data;
    });

    supabase.auth.onAuthStateChange((event,session)=>{
      if(!session){
        this.messages =[];
      }
    });
  }

  async sendMessage(){
    const message = this.userMessage.trim();
    if(!message) return;
     
    const userMsg:ChatMessage = {
      role:'user',
      content:message,
      timestamp:Date.now()
    };

    // Show immediately in UI
    this.messages.push(userMsg);
    this.userMessage = '';

    const accessToken = (await supabase.auth.getSession()).data.session?.access_token;

    const res = await fetch('https://whgrvemociuhqklleaon.supabase.co/functions/v1/chatgpt',
      {
        method:'POST',
        headers:{  'Content-Type':'application/json', 'Authorization':`Bearer ${accessToken}`},     
        body: JSON.stringify({ message })  
      }
    );

    const {content} = await res.json();
    const assistantMsg:ChatMessage = {
      role:'assistant',
      content:content,
      timestamp:Date.now()
    };
    this.messages.push(assistantMsg);
  } 

  //   // Save to Supabase
  //   this.chatService.addMessage('user',message).subscribe(
  //   {
  //     next:(res) => console.log('Message inserted:',res),
  //     error:(err) => console.error('Insert error',err)
  //   }
  //   );

  //   this.userMessage = '';

  //   this.openAi.getAssistantReply(message).subscribe((reply:string)=>{

  //   })
  // }
  }


