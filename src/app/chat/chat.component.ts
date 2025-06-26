import { Component, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as bootstrap from 'bootstrap';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { SocketService } from '../service/socket.service';

@Component({
  selector: 'app-chat',
  imports: [CommonModule,FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnDestroy {
  message = '';
  messages: { sender: string; message: string; created_at: any }[] = [];
  groupedMessages: any[] = [];

  users: any[] = [];
  groups: any[] = [];
  onlineUsers: string[] = [];

  currentUser = '';
  selectedUser: any;
  chatType: 'one_to_one' | 'group' = 'one_to_one';
  roomId = '';
  groupId = 0;

  groupName = '';
  selectedMembers: string[] = [];
  searchText = '';
  isEdited=false;
  suggestions: string[] = [
    'Hello 👋',
    'How are you?',
    'What’s up?',
    'Let’s meet at 5 PM',
    'Good morning!',
    'Thank you!',
    'See you soon 😊'
  ];
  filteredSuggestions: string[] = [];

  // Context menu
  contextMenuPosition = { x: '0px', y: '0px' };
  showContextMenu = false;
  selectedMessageIndex: number | null = null;

  // Edit mode
  editingMessageIndex: number | null = null;

  private destroy$ = new Subject<void>();

  constructor(private http: HttpClient, private chatService: SocketService) {}

  get receiverName(): string {
    return this.chatType === 'one_to_one'
      ? this.selectedUser?.name
      : this.selectedUser?.group_name;
  }

  ngOnInit() {
    const authData = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('authData',authData)
    this.currentUser = authData.name;
console.log('currentUser',this.currentUser)
    this.chatService.emitUserOnline(this.currentUser);

    this.chatService.listenOnlineUsers().pipe(takeUntil(this.destroy$)).subscribe(users => {
      this.onlineUsers = users;
    });

    this.listenForMessages();
    this.getUsers();
    // this.getGroups();
    // this.onMessageUpdated();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getUsers() {
    this.http.get<any[]>('http://localhost:3000/api/users').subscribe(data => {
      this.users = data.filter(user => user.name !== this.currentUser);
      if (this.users.length > 0) {
        this.selectUser(this.users[0], 'one_to_one');
      }
    });
  }

  getGroups() {
    this.http.get<any[]>('http://localhost:3000/api/${this.currentUser}').subscribe({
      next: res => (this.groups = res),
      error: err => console.error('Error fetching groups:', err),
    });
  }

  listenForMessages() {
    this.chatService.newMessage().pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
      if (Array.isArray(data)) {
        this.messages = data;
      } else {
        this.messages.push(data);
      }
      console.log(this.messages,"kl")
      this.groupMessagesByDate();
      this.scrollToBottom();
    });
  }

  groupMessagesByDate() {
    const grouped: { [date: string]: any[] } = {};

    this.messages.forEach(msg => {
      const date = new Date(msg.created_at).toDateString();
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(msg);
    });

    this.groupedMessages = Object.entries(grouped).map(([date, messages]) => ({
      date,
      messages,
    }));
  }

  scrollToBottom() {
    setTimeout(() => {
      const chatBox = document.getElementById('chatBox');
      if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
    }, 100);
  }

// onMessageUpdated() {
//   this.chatService.onMessageUpdated().pipe(takeUntil(this.destroy$)).subscribe(updatedMsg => {
//     this.groupedMessages.forEach(group => {
//       const msg = group.messages.find((m: any) => m.id === updatedMsg.id);
//       if (msg) {
//         msg.message = updatedMsg.message;
//         msg.isEdited = updatedMsg.isEdited;
//       }
//     });
//   });
// }

sendMessage() {
  const trimmed = this.message.trim();
  this.showEmojiPicker = false;
  if (!trimmed) return;
console.log("hiiiiii")
  // Edit mode
  if (
    this.editingMessageIndex !== null &&
    this.editingGroupIndex !== null &&
    this.groupedMessages[this.editingGroupIndex]
  ) {
    const msg = this.groupedMessages[this.editingGroupIndex].messages[this.editingMessageIndex];

    // Update locally
    msg.message = trimmed;

    // Send update to backend
    this.http.patch('http://localhost:3000/api/messages/${msg.id}', { message: trimmed }).subscribe({
      next: () =>  console.log("DB updated"),
      error: err => console.error('Error updating message:', err),
    });

    // Reset edit mode
    this.editingMessageIndex = null;
    this.editingGroupIndex = null;
    this.message = '';
    return;
  }

  // New message
  if (this.chatType === 'one_to_one') {
    const payload = {
      roomId: this.roomId,
      sender: this.currentUser,
      message: trimmed,
    };
    console.log(payload,"payload")
    this.chatService.sendMessage(payload);
  } else {
    this.chatService.sendGroupMessage(this.groupId, this.currentUser, trimmed);
  }

  this.message = '';
}


  filterUsers(searchText: any) {
    const search = searchText.toLowerCase();
    if (search !== '') {
      this.users = this.users.filter(user => user.name.toLowerCase().includes(search));
    } else {
      this.getUsers();
    }
  }

  selectUser(user: any, type: 'one_to_one' | 'group') {
    this.chatType = type;
    this.message = '';
    this.messages = [];
    this.groupedMessages = [];
    this.showEmojiPicker = false;
    if (type === 'one_to_one') {
      this.selectedUser = user;
      this.roomId = this.generateRoomId(this.currentUser, user.name);
      this.chatService.joinRoom(this.roomId);
    } else {
      this.selectedUser = user;
      this.groupId = user.group_id;
      this.chatService.joinGroupRoom(this.groupId, this.currentUser);
    }
  }

  generateRoomId(user1: string, user2: string): string {
    return [user1, user2].sort().join('_');
  }

  toggleUserSelection(name: string) {
    const index = this.selectedMembers.indexOf(name);
    if (index > -1) {
      this.selectedMembers.splice(index, 1);
    } else {
      this.selectedMembers.push(name);
    }
  }

  // createGroup() {
  //   if (!this.groupName || this.selectedMembers.length === 0) {
  //     alert('Please enter group name and select at least one member.');
  //     return;
  //   }

  //   if (!this.selectedMembers.includes(this.currentUser)) {
  //     this.selectedMembers.push(this.currentUser);
  //   }

  //   const groupPayload = {
  //     group_name: this.groupName,
  //     created_by: this.currentUser,
  //     members: this.selectedMembers,
  //   };

  //   this.http.post('http://localhost:3000/api/groups/create', groupPayload).subscribe({
  //     next: () => {
  //       alert(Group "${this.groupName}" created successfully!);
  //       this.groupName = '';
  //       this.selectedMembers = [];
  //       this.getGroups();

  //       const modalElement = document.getElementById('groupModal');
  //       if (modalElement) {
  //         const instance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
  //         instance.hide();
  //       }
  //     },
  //     error: err => {
  //       alert('Failed to create group.');
  //     },
  //   });
  // }

  showEmojiPicker = false;

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event: any) {
    this.message += event.emoji.native;
  }

  startAudioCall() {
    console.log('Audio call started with', this.receiverName);
  }

  startVideoCall() {
    console.log('Video call started with', this.receiverName);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      console.log('Selected file:', file);
    }
  }

  filterSuggestions(input: string): void {
    if (!input) {
      this.filteredSuggestions = [];
      return;
    }

    const lowerInput = input.toLowerCase();
    this.filteredSuggestions = this.suggestions
      .filter(s =>
        s.toLowerCase().includes(lowerInput) &&
        s.toLowerCase() !== lowerInput
      )
      .slice(0, 5);
  }

  selectSuggestion(suggestion: string): void {
    this.message = suggestion;
    this.filteredSuggestions = [];
  }

  openContextMenu(event: MouseEvent, index: number) {
    event.preventDefault();
    this.selectedMessageIndex = index;
    this.contextMenuPosition = {
      x: event.clientX + 'px',
      y: event.clientY + 'px',
    };
    this.showContextMenu = true;
  }

  closeContextMenu() {
    this.showContextMenu = false;
    this.selectedMessageIndex = null;
  }
  editingGroupIndex: number | null = null;

 editMessage(groupIndex: number, messageIndex: number) {
  const msg = this.groupedMessages[groupIndex].messages[messageIndex];
  this.message = msg.message;
console.log(msg ,"this.message ")
  // Store editing indices to refer back during update
  this.editingMessageIndex = messageIndex;
  this.editingGroupIndex = groupIndex;

  this.closeContextMenu();
}

// deleteMessage(groupIndex: number, messageIndex: number) {
//   const message = this.groupedMessages[groupIndex].messages[messageIndex];
//   const messageId = message.id; // Assuming each message has an 'id'

//   this.chatService.deleteMessage(messageId).subscribe({
//     next: () => {
//       // Remove message from UI on successful delete
//       this.groupedMessages[groupIndex].messages.splice(messageIndex, 1);

//       // Remove the group if empty
//       if (this.groupedMessages[groupIndex].messages.length === 0) {
//         this.groupedMessages.splice(groupIndex, 1);
//       }

//       this.closeContextMenu();
//     },
//     error: (err) => {
//       // Optional: show an error notification to the user
//     }
//   });
// }

canEditMessage(timestamp: string | Date): boolean {
  const messageTime = new Date(timestamp).getTime();
  const currentTime = new Date().getTime();
  const diffInMinutes = (currentTime - messageTime) / 60000;
  return diffInMinutes <= 15;
}

copyMessage(message: string) {
  navigator.clipboard.writeText(message).then(() => {
    // Optional: You can show a toast or alert
    // alert('Message copied to clipboard');
  }).catch(err => {
  });
}
}