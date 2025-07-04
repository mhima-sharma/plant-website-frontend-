import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChatService } from '../service/chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {
   
 
 
  userInput: string = '';
  isLoading: boolean = false;
 isChatbotOpen: boolean = true; 
  messages: { from: string, text: string, time: string, isGif: boolean }[] = [];
 // Show/hide chatbot state
  // Or false if you want to start closed

  @ViewChild('chatContainer') chatContainer!: ElementRef;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.loadMessages();
  }

    toggleChatbot() {
    this.isChatbotOpen = false;
  }
  // ✅ Load chat history from DB
  loadMessages() {
    this.chatService.getAllMessages().subscribe((data: any) => {
      this.messages = [];

      console.log(data);

      data.messages.forEach((msg: any) => {
        this.messages.push({
          from: 'user',
          text: msg.user_query,
          time: msg.created_at ? msg.created_at : new Date().toISOString(),
          isGif: this.isGifUrl(msg.user_query)
        });

        this.messages.push({
          from: 'bot',
          text: msg.bot_response,
          time: msg.created_at ? msg.created_at : new Date().toISOString(),
          isGif: this.isGifUrl(msg.bot_response)
        });
      });

      console.log(this.messages, "Loaded Messages");
      this.scrollToBottom();
    });
  }

  // ✅ Send new message
  sendMessage() {
    if (this.userInput.trim() === '') return;

    const userMessage = {
      from: 'user',
      text: this.userInput,
      time: new Date().toISOString(),
      isGif: this.isGifUrl(this.userInput)
    };

    this.messages.push(userMessage);
    this.scrollToBottom();

    this.isLoading = true;

    this.chatService.sendMessage(this.userInput).subscribe((response) => {
      this.isLoading = false;

      const botMessage = {
        from: 'bot',
        text: response.message,
        time: new Date().toISOString(),
        isGif: this.isGifUrl(response.message)
      };

      this.messages.push(botMessage);
      this.userInput = '';
      this.scrollToBottom();
    }, (error) => {
      this.isLoading = false;
      console.error('ChatGPT API Error:', error);
    });
  }

  // ✅ Check if message is a GIF URL
  isGifUrl(message: string): boolean {
    return message.trim().toLowerCase().endsWith('.gif');
  }

  // ✅ Auto-scroll to the bottom
  scrollToBottom() {
    setTimeout(() => {
      if (this.chatContainer) {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }
}
