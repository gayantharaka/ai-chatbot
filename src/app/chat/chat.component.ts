import { Component } from '@angular/core';
import { ChatMessage } from './chat-message.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  userMessage:string ='';
  messages:ChatMessage[]=[];

  sendMessage(){
    const content = this.userMessage.trim();
    if(!content) return;
   
    const userMsg:ChatMessage = {
      role:'user',
      content,
      timestamp:Date.now()
    };

    this.messages.push(userMsg);
    this.userMessage = '';

    const aiMsg:ChatMessage ={
      role:'assistant',
      content:`Echo ${content}`,
      timestamp:Date.now()+1
    };

    setTimeout(() =>{
      this.messages.push(aiMsg);
    },500);

  }

}
