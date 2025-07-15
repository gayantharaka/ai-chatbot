import { Component } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  userMessage:string ='';

  sendMessage(){
    if(!this.userMessage.trim()) return;
    console.log('User says:', this.userMessage);
    this.userMessage = '';
  }

}
