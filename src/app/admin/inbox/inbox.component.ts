import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  OnDestroy,
} from '@angular/core';
import { MessageService } from 'src/app/core/services/message.service';
import { ToastrService } from 'ngx-toastr';
import { Message } from 'src/app/models/interfaces';
import { CacheService } from 'src/app/core/services/cache.service';
import { AdminBackgroundService } from 'src/app/core/services/admin-background.service';
import { Subscription, interval } from 'rxjs';

interface PlayerChat {
  senderId: string;
  senderFullName: string;
  lastMessage: string;
  lastMessageDate: string;
  unreadCount: number;
  messages: Message[];
}

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css'],
})
export class InboxComponent implements OnInit, AfterViewChecked, OnDestroy {
  playerChats: PlayerChat[] = [];
  selectedPlayerId: string | null = null;
  selectedChat: PlayerChat | null = null;
  replyMessages: { [messageId: number]: string } = {};
  private updateStatusSubscription?: Subscription;
  private refreshSubscription?: Subscription;

  @ViewChild('messagesContainer')
  messagesContainer!: ElementRef<HTMLDivElement>;

  constructor(
    private messageService: MessageService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private cacheService: CacheService,
    private adminBackgroundService: AdminBackgroundService
  ) {}

  ngOnInit(): void {
    this.loadAdminMessages();
    this.subscribeToUpdates();
    this.startPeriodicRefresh();
  }

  ngOnDestroy(): void {
    if (this.updateStatusSubscription) {
      this.updateStatusSubscription.unsubscribe();
    }
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  private startPeriodicRefresh(): void {
    // Refresh messages every 30 seconds for immediate updates
    this.refreshSubscription = interval(30000).subscribe(() => {
      this.messageService.getAdminMessages().subscribe({
        next: (response) => {
          if (response && response.messages) {
            const groupedMessages = this.groupMessagesBySender(response.messages);
            // ترتيب المحادثات حسب الأحدث (آخر رسالة)
            this.playerChats = groupedMessages.sort(
              (a, b) =>
                new Date(b.lastMessageDate).getTime() -
                new Date(a.lastMessageDate).getTime()
            );
            // console.log('🔄 Periodic refresh completed');
          }
        },
        error: (err) => {
          // console.log('❌ Periodic refresh failed:', err);
        },
      });
    });
  }

  private loadAdminMessages(): void {
    // Always load fresh data from server for immediate updates
    this.loadFromServer();
  }

  private loadFromCache(): void {
    // تم إلغاء الكاش للادمن، سيتم التحميل دائماً من السيرفر
    this.loadFromServer();
  }

  private loadFromServer(): void {
    this.messageService.getAdminMessages().subscribe({
      next: (response) => {
        if (response && response.messages) {
          const groupedMessages = this.groupMessagesBySender(response.messages);
          // ترتيب المحادثات حسب الأحدث (آخر رسالة)
          this.playerChats = groupedMessages.sort(
            (a, b) =>
              new Date(b.lastMessageDate).getTime() -
              new Date(a.lastMessageDate).getTime()
          );
          // console.log('🌐 Fresh messages loaded from server');
        } else {
          this.toastr.error('لا يوجد رسائل');
        }
      },
      error: (err) => {
        this.toastr.error(err.message);
      },
    });
  }

  // Add refresh method for immediate updates
  refreshMessages(): void {
    this.messageService.getAdminMessages().subscribe({
      next: (response) => {
        if (response && response.messages) {
          const groupedMessages = this.groupMessagesBySender(response.messages);
          // ترتيب المحادثات حسب الأحدث (آخر رسالة)
          this.playerChats = groupedMessages.sort(
            (a, b) =>
              new Date(b.lastMessageDate).getTime() -
              new Date(a.lastMessageDate).getTime()
          );
          // console.log('🔄 Messages refreshed from server');
        } else {
          this.toastr.error('لا يوجد رسائل');
        }
      },
      error: (err) => {
        this.toastr.error(err.message);
      },
    });
  }

  private subscribeToUpdates(): void {
    this.updateStatusSubscription =
      this.adminBackgroundService.updateStatus$.subscribe((status) => {
        // console.log('🔄 Admin inbox update status:', status);
      });
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
          this.processMessages(response.messages);
        } else {
          this.toastr.error('لا يوجد رسائل الآن');
        }
      },
      error: (err) => {
        this.toastr.error('حصل خطأ أثناء جلب الرسائل');
      },
    });
  }

  private processMessages(messages: Message[]): void {
    const groupedMessages = this.groupMessagesBySender(messages);
    // ترتيب حسب الأحدث (آخر رسالة)
    this.playerChats = groupedMessages.sort(
      (a, b) =>
        new Date(b.lastMessageDate).getTime() -
        new Date(a.lastMessageDate).getTime()
    );
    this.cdr.detectChanges();
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
            lastMessageDate: '',
            unreadCount: 0,
            messages: [],
          };
        }
        chatMap[playerId].messages.push(msg);
        if (!msg.isFromAdmin && !msg.isRead) {
          chatMap[playerId].unreadCount++;
        }
      });

    return Object.values(chatMap).map((chat) => {
      // ترتيب الرسائل من الأقدم للأحدث
      chat.messages = chat.messages.sort(
        (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
      );
      // آخر رسالة
      const lastMsg = chat.messages[chat.messages.length - 1];
      chat.lastMessage = lastMsg?.content ?? '';
      chat.lastMessageDate = lastMsg?.sentAt ?? '';
      return chat;
    });
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
