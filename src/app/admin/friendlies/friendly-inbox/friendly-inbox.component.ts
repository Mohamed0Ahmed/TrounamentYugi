import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  OnDestroy,
} from '@angular/core';
import { FriendlyMessageService } from '../../../core/services/friendly-message.service';
import { ToastrService } from 'ngx-toastr';
import {
  FriendlyMessageDto,
  FriendlyMessageResponse,
} from 'friendly-message-types';
import { Subscription } from 'rxjs';

interface PlayerChat {
  senderId: string; // استخدام string فقط للتوافق مع GUID
  senderFullName: string;
  senderPhoneNumber: string; // إضافة رقم الهاتف
  lastMessage: string;
  lastMessageDate: string;
  unreadCount: number;
  messages: FriendlyMessageDto[];
}

@Component({
  selector: 'app-friendly-inbox',
  templateUrl: './friendly-inbox.component.html',
  styleUrls: ['./friendly-inbox.component.css'],
})
export class FriendlyInboxComponent
  implements OnInit, AfterViewChecked, OnDestroy
{
  playerChats: PlayerChat[] = [];
  selectedPlayerId: string | null = null;
  selectedChat: PlayerChat | null = null;
  replyMessages: { [messageId: number]: string } = {};
  private updateStatusSubscription?: Subscription;
  private refreshSubscription?: Subscription;
  navbarHeight = 60; // default navbar height

  @ViewChild('messagesContainer')
  messagesContainer!: ElementRef<HTMLDivElement>;

  constructor(
    private friendlyMessageService: FriendlyMessageService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadFriendlyMessages();
  }

  ngOnDestroy(): void {
    if (this.updateStatusSubscription) {
      this.updateStatusSubscription.unsubscribe();
    }
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  private loadFriendlyMessages(): void {
    this.friendlyMessageService.getAllMessages().subscribe({
      next: (response: FriendlyMessageResponse) => {
        if (response.success && response.messages) {
          const groupedMessages = this.groupMessagesBySender(response.messages);
          // ترتيب المحادثات حسب الأحدث (آخر رسالة)
          this.playerChats = groupedMessages.sort(
            (a, b) =>
              new Date(b.lastMessageDate).getTime() -
              new Date(a.lastMessageDate).getTime()
          );

          // عرض رسالة النجاح مع عدد الرسائل
          const totalMessages = response.messages.length;
          const unreadMessages = response.messages.filter(
            (msg) => !msg.isRead && !msg.isFromAdmin
          ).length;
        } else {
          this.toastr.error(response.message || 'لا يوجد رسائل ودية');
        }
      },
      error: (err: any) => {
        this.toastr.error(
          err.error?.message || err.message || 'حصل خطأ أثناء جلب الرسائل'
        );
      },
    });
  }

  // Add refresh method for immediate updates
  refreshMessages(): void {
    this.friendlyMessageService.getAllMessages().subscribe({
      next: (response: FriendlyMessageResponse) => {
        if (response.success && response.messages) {
          const groupedMessages = this.groupMessagesBySender(response.messages);
          // ترتيب المحادثات حسب الأحدث (آخر رسالة)
          this.playerChats = groupedMessages.sort(
            (a, b) =>
              new Date(b.lastMessageDate).getTime() -
              new Date(a.lastMessageDate).getTime()
          );

          // عرض رسالة التحديث مع عدد الرسائل
          const totalMessages = response.messages.length;
          const unreadMessages = response.messages.filter(
            (msg) => !msg.isRead && !msg.isFromAdmin
          ).length;

          if (totalMessages > 0) {
            this.toastr.info(
              `تم تحديث ${totalMessages} رسالة${
                unreadMessages > 0
                  ? ` (${unreadMessages} رسالة غير مقروءة)`
                  : ''
              }`,
              'تم تحديث الرسائل'
            );
          } else {
            this.toastr.info('لا توجد رسائل ودية حالياً', 'معلومات');
          }
        } else {
          this.toastr.error(response.message || 'لا يوجد رسائل ودية');
        }
      },
      error: (err: any) => {
        this.toastr.error(
          err.error?.message || err.message || 'حصل خطأ أثناء جلب الرسائل'
        );
      },
    });
  }

  ngAfterViewChecked(): void {
    if (this.selectedChat && this.messagesContainer) {
      this.scrollToBottom();
    }
  }

  groupMessagesBySender(messages: FriendlyMessageDto[]): PlayerChat[] {
    const chatMap: { [senderId: string | number]: PlayerChat } = {};
    messages.forEach((msg) => {
      // استخدام senderId كـ playerId (قد يكون string أو number)
      let playerId = msg.senderId || msg.playerId;

      // إذا كان senderId هو GUID، نستخدمه كما هو
      if (typeof playerId === 'string' && playerId.includes('-')) {
        // هذا GUID، نستخدمه كما هو
      } else if (typeof playerId === 'string') {
        // محاولة تحويل إلى number
        const parsedId = parseInt(playerId, 10);
        if (!isNaN(parsedId) && parsedId > 0) {
          playerId = parsedId;
        }
      }

      // تأكد من أن playerId موجود
      if (!playerId) {
        return; // تخطي هذه الرسالة
      }

      if (!chatMap[playerId]) {
        chatMap[playerId] = {
          senderId: String(playerId), // تحويل إلى string
          senderFullName:
            msg.senderFullName || msg.playerFullName || `اللاعب ${playerId}`, // fallback للاسم
          senderPhoneNumber: msg.senderPhoneNumber || 'غير متوفر', // استخدام الحقل الصحيح مع fallback
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

    const result = Object.values(chatMap).map((chat) => {
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

    return result;
  }

  openChat(playerId: string): void {
    this.selectedPlayerId = playerId;
    this.selectedChat =
      this.playerChats.find((chat) => chat.senderId === playerId) || null;

    if (this.selectedChat) {
      // تأكد من وجود اسم اللاعب
      if (!this.selectedChat.senderFullName) {
        this.selectedChat.senderFullName = `اللاعب ${this.selectedChat.senderId}`;
      }
      // Mark messages as read when opening chat
      this.selectedChat.messages
        .filter((msg) => !msg.isRead && !msg.isFromAdmin)
        .forEach((msg) => {
          this.friendlyMessageService.markMessageAsRead(msg.id).subscribe({
            next: (response: any) => {
              if (response.success) {
                msg.isRead = true;
                this.selectedChat!.unreadCount =
                  this.selectedChat!.messages.filter(
                    (m) => !m.isRead && !m.isFromAdmin
                  ).length;
                this.cdr.detectChanges();
              }
            },
            error: (err: any) => {
              this.toastr.error(
                err.error?.message ||
                  err.message ||
                  'حصل خطأ أثناء تحديث حالة الرسالة',
                'خطأ في التحديث'
              );
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

    if (!this.selectedChat.senderId) {
      this.toastr.error('خطأ: معرف اللاعب غير صحيح');
      return;
    }

    if (
      !this.selectedChat.messages ||
      this.selectedChat.messages.length === 0
    ) {
      this.toastr.error('خطأ: لا توجد رسائل في هذه المحادثة');
      return;
    }

    const replyContent =
      this.replyMessages[this.selectedChat.messages[0].id]?.trim();
    if (!replyContent) {
      this.toastr.warning('الرجاء كتابة رد');
      return;
    }

    this.friendlyMessageService
      .sendAdminReply(this.selectedChat.senderId, replyContent)
      .subscribe({
        next: (response: FriendlyMessageResponse) => {
          if (response.success) {
            const playerName =
              this.selectedChat!.senderFullName ||
              `اللاعب ${this.selectedChat!.senderId}`;
            this.toastr.success(
              `تم إرسال الرد بنجاح إلى ${playerName}`,
              'تم الإرسال'
            );
            this.replyMessages[this.selectedChat!.messages[0].id] = '';

            const newMessage: FriendlyMessageDto = {
              id: Math.random(),
              senderId: this.selectedChat!.senderId,
              senderFullName:
                this.selectedChat!.senderFullName ||
                `اللاعب ${this.selectedChat!.senderId}`,
              senderPhoneNumber:
                this.selectedChat!.senderPhoneNumber || 'غير متوفر',
              content: replyContent,
              isRead: true,
              sentAt: new Date().toISOString(),
              isFromAdmin: true,
              messageType: 'admin_reply',
            };

            // تحديث الرسائل في المحادثة المحددة
            this.selectedChat!.messages.push(newMessage);
            this.selectedChat!.messages.sort(
              (a, b) =>
                new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
            );

            // تحديث آخر رسالة في قائمة المحادثات
            this.selectedChat!.lastMessage = replyContent;
            this.selectedChat!.lastMessageDate = newMessage.sentAt;

            // تحديث اسم اللاعب إذا كان غير موجود
            if (!this.selectedChat!.senderFullName) {
              this.selectedChat!.senderFullName = `اللاعب ${
                this.selectedChat!.senderId
              }`;
            }

            // إعادة ترتيب قائمة المحادثات حسب الأحدث
            this.playerChats.sort(
              (a, b) =>
                new Date(b.lastMessageDate).getTime() -
                new Date(a.lastMessageDate).getTime()
            );

            // تحديث المحادثة المحددة بعد إعادة الترتيب
            this.selectedChat =
              this.playerChats.find(
                (chat) => chat.senderId === this.selectedPlayerId
              ) || null;

            this.cdr.detectChanges();
          } else {
            this.toastr.error(
              response.message || 'فشل إرسال الرد',
              'خطأ في الإرسال'
            );
          }
        },
        error: (err: any) => {
          this.toastr.error(
            err.error?.message || err.message || 'حصل خطأ أثناء إرسال الرد',
            'خطأ في الإرسال'
          );
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

  trackByMessageId(index: number, message: FriendlyMessageDto): number {
    return message.id;
  }
}
