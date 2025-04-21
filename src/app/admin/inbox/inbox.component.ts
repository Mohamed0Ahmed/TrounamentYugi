import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import { MessageService } from 'src/app/core/services/message.service';
import { ToastrService } from 'ngx-toastr';
import { Message } from 'src/app/models/interfaces';

interface PlayerChat {
  senderId: string;
  senderFullName: string;
  lastMessage: string;
  unreadCount: number;
  messages: Message[];
}

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css'],
})
export class InboxComponent implements OnInit, AfterViewChecked {
  playerChats: PlayerChat[] = [];
  selectedPlayerId: string | null = null;
  selectedChat: PlayerChat | null = null;
  replyMessages: { [messageId: number]: string } = {};

  @ViewChild('messagesContainer')
  messagesContainer!: ElementRef<HTMLDivElement>;

  constructor(
    private messageService: MessageService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  ngAfterViewChecked(): void {
    if (this.selectedChat && this.messagesContainer) {
      this.scrollToBottom();
    }
  }

  loadMessages(): void {
    this.messageService.getMessages().subscribe({
      next: (response) => {
        if (response && response.messages) {
          console.log('Loaded messages:', response.messages);
          const groupedMessages = this.groupMessagesBySender(response.messages);
          this.playerChats = groupedMessages.sort(
            (a, b) =>
              new Date(b.messages[0].sentAt).getTime() -
              new Date(a.messages[0].sentAt).getTime()
          );
          this.cdr.detectChanges();
        } else {
          this.toastr.error('لا يوجد رسائل الآن');
        }
      },
      error: (err) => {
        this.toastr.error('حصل خطأ أثناء جلب الرسائل');
      },
    });
  }

  groupMessagesBySender(messages: Message[]): PlayerChat[] {
    const chatMap: { [senderId: string]: PlayerChat } = {};
    messages
      .filter((msg) => !msg.isDeleted)
      .forEach((msg) => {
        const playerId = msg.isFromAdmin ? msg.senderId : msg.senderId;
        if (!chatMap[playerId]) {
          chatMap[playerId] = {
            senderId: playerId,
            senderFullName: msg.senderFullName,
            lastMessage: '',
            unreadCount: 0,
            messages: [],
          };
        }
        chatMap[playerId].messages.push(msg);
        if (!msg.isFromAdmin) {
          chatMap[playerId].lastMessage = msg.content;
          if (!msg.isRead) {
            chatMap[playerId].unreadCount++;
          }
        }
      });
    return Object.values(chatMap)
      .filter((chat) => chat.messages.some((msg) => !msg.isFromAdmin))
      .map((chat) => ({
        ...chat,
        messages: chat.messages.sort(
          (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
        ),
      }));
  }

  openChat(playerId: string): void {
    this.selectedPlayerId = playerId;
    this.selectedChat =
      this.playerChats.find((chat) => chat.senderId === playerId) || null;
    if (this.selectedChat) {
      this.selectedChat.messages
        .filter((msg) => !msg.isRead && !msg.isFromAdmin)
        .forEach((msg) => {
          this.messageService.toggleMarkMessage(msg.id, true).subscribe({
            next: (response) => {
              if (response.success) {
                msg.isRead = true;
                this.selectedChat!.unreadCount =
                  this.selectedChat!.messages.filter(
                    (m) => !m.isRead && !m.isFromAdmin
                  ).length;
                this.cdr.detectChanges();
              }
            },
            error: (err) => {
              this.toastr.error('حصل خطأ أثناء تحديث حالة الرسالة');
            },
          });
        });
      this.cdr.detectChanges();
    }
  }

  closeChat(): void {
    this.selectedPlayerId = null;
    this.selectedChat = null;
    this.replyMessages = {};
    this.cdr.detectChanges();
  }

  sendReply(): void {
    if (!this.selectedChat) {
      this.toastr.warning('الرجاء اختيار محادثة');
      return;
    }
    const replyContent =
      this.replyMessages[this.selectedChat.messages[0].id]?.trim();
    if (!replyContent) {
      this.toastr.warning('الرجاء كتابة رد');
      return;
    }

    this.messageService
      .sendAdminReply(this.selectedChat.senderId, replyContent)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success('تم إرسال الرد');
            this.replyMessages[this.selectedChat!.messages[0].id] = '';
            const newMessage: Message = {
              id: Math.random(),
              senderId: this.selectedChat!.senderId,
              senderFullName: 'Admin',
              senderPhoneNumber: '',
              content: replyContent,
              isRead: true,
              isDeleted: false,
              sentAt: new Date().toISOString(),
              isFromAdmin: true,
            };
            this.selectedChat!.messages.push(newMessage);
            this.selectedChat!.messages.sort(
              (a, b) =>
                new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
            );
            this.cdr.detectChanges();
          } else {
            this.toastr.error(response.message || 'فشل إرسال الرد');
          }
        },
        error: (err) => {
          this.toastr.error('حصل خطأ أثناء إرسال الرد');
        },
      });
  }

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      const container = this.messagesContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    }
  }

  trackByPlayerId(index: number, chat: PlayerChat): string {
    return chat.senderId;
  }

  trackByMessageId(index: number, message: Message): number {
    return message.id;
  }
}
