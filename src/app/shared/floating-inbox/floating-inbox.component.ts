import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { MessageService } from '../../core/services/message.service';
import { AdminDashboardService } from '../../core/services/admin-dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';

interface PlayerChat {
  playerId: string;
  playerFullName: string;
  lastMessage: string;
  lastMessageDate: string;
  unreadCount: number;
  messages: any[];
}

@Component({
  selector: 'app-floating-inbox',
  templateUrl: './floating-inbox.component.html',
  styleUrls: ['./floating-inbox.component.css'],
})
export class FloatingInboxComponent implements OnInit, OnDestroy {
  // Floating button properties
  isAdmin = false;
  showInboxOverlay = false;
  buttonPosition = { x: 20, y: 100 };
  isDragging = false;
  dragOffset = { x: 0, y: 0 };
  hasMovedDuringDrag = false;
  unreadCount = 0;

  // Inbox properties
  playerChats: PlayerChat[] = [];
  selectedPlayerId: string | null = null;
  selectedChat: PlayerChat | null = null;
  replyText = ''; // New property for single reply input
  navbarHeight = 60;

  private updateStatusSubscription?: Subscription;
  private refreshSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private adminDashboardService: AdminDashboardService
  ) {}

  ngOnInit(): void {
    this.checkAdminStatus();
    this.setInitialButtonPosition();
    if (this.isAdmin) {
      this.loadAdminMessages();
    }
  }

  ngOnDestroy(): void {
    this.isDragging = false;
    this.showInboxOverlay = false;
    document.body.style.cursor = 'default';
    document.body.classList.remove('dragging');

    if (this.updateStatusSubscription) {
      this.updateStatusSubscription.unsubscribe();
    }
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }

    document.removeEventListener(
      'mousemove',
      this.onGlobalMouseMove.bind(this)
    );
    document.removeEventListener('mouseup', this.onGlobalMouseUp.bind(this));
  }

  checkAdminStatus(): void {
    try {
      const role = this.authService.getRole();
      this.isAdmin = role === 'Admin';
    } catch (error) {
      console.warn('Error checking admin status:', error);
      this.isAdmin = false;
    }
  }

  toggleInboxOverlay(): void {
    if (!this.isDragging && !this.hasMovedDuringDrag) {
      this.showInboxOverlay = !this.showInboxOverlay;

      if (this.showInboxOverlay) {
        this.loadAdminMessages();
        setTimeout(() => {
          this.fixInboxComponentForOverlay();
        }, 100);
      }
    }
  }

  closeInboxOverlay(): void {
    this.showInboxOverlay = false;
  }

  fixInboxComponentForOverlay(): void {
    const inboxElement = document.querySelector(
      '.overlay-enter app-floating-inbox'
    );
    if (inboxElement) {
      const elementsWithMarginTop = inboxElement.querySelectorAll(
        '[style*="margin-top"]'
      );
      elementsWithMarginTop.forEach((el: any) => {
        el.style.marginTop = '0px';
      });

      const elementsWithTop = inboxElement.querySelectorAll('[style*="top"]');
      elementsWithTop.forEach((el: any) => {
        el.style.top = '0px';
      });
    }
  }

  setInitialButtonPosition(): void {
    const savedPosition = localStorage.getItem('floatingInboxButtonPosition');

    if (savedPosition) {
      try {
        const parsedPosition = JSON.parse(savedPosition);
        const margin = 24;
        const buttonSize = 48;
        const maxX = window.innerWidth - buttonSize - margin;
        const maxY = window.innerHeight - buttonSize - margin;

        if (
          parsedPosition.x >= margin &&
          parsedPosition.x <= maxX &&
          parsedPosition.y >= margin &&
          parsedPosition.y <= maxY
        ) {
          this.buttonPosition = parsedPosition;
          return;
        }
      } catch (error) {
        console.warn('Error parsing saved button position:', error);
      }
    }

    const margin = 24;
    const buttonSize = 48;
    const maxX = window.innerWidth - buttonSize - margin;
    const maxY = window.innerHeight - buttonSize - margin;

    this.buttonPosition = {
      x: Math.max(margin, maxX),
      y: Math.max(margin, maxY),
    };
  }

  // Dragging functionality
  onButtonMouseDown(event: MouseEvent): void {
    this.isDragging = true;
    this.hasMovedDuringDrag = false;
    this.dragOffset = {
      x: event.clientX - this.buttonPosition.x,
      y: event.clientY - this.buttonPosition.y,
    };
    event.preventDefault();
    event.stopPropagation();
    document.body.style.cursor = 'grabbing';
    document.body.classList.add('dragging');
  }

  onButtonTouchStart(event: TouchEvent): void {
    this.isDragging = true;
    this.hasMovedDuringDrag = false;

    const touch = event.touches[0];
    this.dragOffset = {
      x: touch.clientX - this.buttonPosition.x,
      y: touch.clientY - this.buttonPosition.y,
    };

    event.preventDefault();
    event.stopPropagation();
    document.body.style.cursor = 'grabbing';
    document.body.classList.add('dragging');
  }

  @HostListener('document:mousemove', ['$event'])
  onGlobalMouseMove(event: MouseEvent): void {
    if (this.isDragging) {
      requestAnimationFrame(() => {
        const newX = event.clientX - this.dragOffset.x;
        const newY = event.clientY - this.dragOffset.y;

        const oldX = this.buttonPosition.x;
        const oldY = this.buttonPosition.y;

        const margin = 24;
        const buttonSize = 48;
        const maxX = window.innerWidth - buttonSize - margin;
        const maxY = window.innerHeight - buttonSize - margin;

        const finalX = Math.max(margin, Math.min(newX, maxX));
        const finalY = Math.max(margin, Math.min(newY, maxY));

        if (Math.abs(finalX - oldX) > 5 || Math.abs(finalY - oldY) > 5) {
          this.hasMovedDuringDrag = true;
        }

        this.buttonPosition = {
          x: finalX,
          y: finalY,
        };

        this.saveButtonPosition();
      });
    }
  }

  @HostListener('document:touchmove', ['$event'])
  onGlobalTouchMove(event: TouchEvent): void {
    if (this.isDragging) {
      requestAnimationFrame(() => {
        const touch = event.touches[0];
        const newX = touch.clientX - this.dragOffset.x;
        const newY = touch.clientY - this.dragOffset.y;

        const oldX = this.buttonPosition.x;
        const oldY = this.buttonPosition.y;

        const margin = 24;
        const buttonSize = 48;
        const maxX = window.innerWidth - buttonSize - margin;
        const maxY = window.innerHeight - buttonSize - margin;

        const finalX = Math.max(margin, Math.min(newX, maxX));
        const finalY = Math.max(margin, Math.min(newY, maxY));

        if (Math.abs(finalX - oldX) > 5 || Math.abs(finalY - oldY) > 5) {
          this.hasMovedDuringDrag = true;
        }

        this.buttonPosition = {
          x: finalX,
          y: finalY,
        };

        this.saveButtonPosition();
      });
    }
  }

  @HostListener('document:mouseup')
  onGlobalMouseUp(): void {
    if (this.isDragging) {
      this.isDragging = false;
      document.body.style.cursor = 'default';
      document.body.classList.remove('dragging');

      setTimeout(() => {
        this.hasMovedDuringDrag = false;
      }, 100);
    }
  }

  @HostListener('document:touchend')
  onGlobalTouchEnd(): void {
    if (this.isDragging) {
      this.isDragging = false;
      document.body.style.cursor = 'default';
      document.body.classList.remove('dragging');

      setTimeout(() => {
        this.hasMovedDuringDrag = false;
      }, 100);
    }
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    const margin = 24;
    const buttonSize = 48;
    const maxX = window.innerWidth - buttonSize - margin;
    const maxY = window.innerHeight - buttonSize - margin;

    this.buttonPosition = {
      x: Math.max(margin, Math.min(this.buttonPosition.x, maxX)),
      y: Math.max(margin, Math.min(this.buttonPosition.y, maxY)),
    };
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.showInboxOverlay) {
      this.showInboxOverlay = false;
    }
  }

  private saveButtonPosition(): void {
    try {
      localStorage.setItem(
        'floatingInboxButtonPosition',
        JSON.stringify(this.buttonPosition)
      );
    } catch (error) {
      console.warn('Error saving button position to localStorage:', error);
    }
  }

  // Inbox functionality
  private loadAdminMessages(): void {
    this.loadFromServer();
  }

  private loadFromCache(): void {
    this.loadFromServer();
  }

  private loadFromServer(): void {
    this.adminDashboardService.getSecondaryData('messages').subscribe({
      next: (messages) => {
        if (messages && messages.length > 0) {
          const groupedMessages = this.groupMessagesBySender(messages);
          this.playerChats = groupedMessages.sort(
            (a, b) =>
              new Date(b.lastMessageDate).getTime() -
              new Date(a.lastMessageDate).getTime()
          );
        } else {
          this.toastr.error('لا يوجد رسائل');
        }
      },
      error: (err) => {
        this.toastr.error(err.message);
      },
    });
  }

  refreshMessages(): void {
    this.messageService.getAdminMessages().subscribe({
      next: (response) => {
        if (response && response.messages) {
          const groupedMessages = this.groupMessagesBySender(response.messages);
          this.playerChats = groupedMessages.sort(
            (a, b) =>
              new Date(b.lastMessageDate).getTime() -
              new Date(a.lastMessageDate).getTime()
          );
        } else {
          this.toastr.error('لا يوجد رسائل');
        }
      },
      error: (err) => {
        this.toastr.error(err.message);
      },
    });
  }

  selectChat(chat: PlayerChat): void {
    this.selectedChat = chat;
    this.selectedPlayerId = chat.playerId;
    this.loadChatMessages(chat.playerId);

    // Scroll to bottom after selecting chat
    setTimeout(() => {
      this.scrollToBottom();
    }, 100);
  }

  private loadChatMessages(playerId: string): void {
    // Load chat messages for specific player
    this.messageService.getAdminMessages().subscribe({
      next: (response) => {
        if (response && response.messages) {
          const playerMessages = response.messages.filter(
            (msg: any) => msg.senderId === playerId
          );

          // Sort messages by date (newest first) so they appear from bottom
          playerMessages.sort(
            (a: any, b: any) =>
              new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
          );

          this.selectedChat!.messages = playerMessages;

          // Scroll to bottom after messages load to show latest message
          setTimeout(() => {
            this.scrollToBottom();
          }, 100);
        }
      },
      error: (err) => {
        this.toastr.error(err.message);
      },
    });
  }

  private scrollToTop(): void {
    const messagesContainer = document.querySelector('#messagesContainer');
    if (messagesContainer) {
      messagesContainer.scrollTop = 0;
    }
  }

  private scrollToBottom(): void {
    const messagesContainer = document.querySelector('#messagesContainer');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  private groupMessagesBySender(messages: any[]): PlayerChat[] {
    const chatMap = new Map<string, PlayerChat>();

    messages.forEach((message) => {
      const senderId = message.senderId;
      if (!chatMap.has(senderId)) {
        chatMap.set(senderId, {
          playerId: senderId,
          playerFullName: message.senderFullName,
          lastMessage: message.content,
          lastMessageDate: message.sentAt,
          unreadCount: message.isRead ? 0 : 1,
          messages: [message],
        });
      } else {
        const chat = chatMap.get(senderId)!;
        chat.messages.push(message);

        if (new Date(message.sentAt) > new Date(chat.lastMessageDate)) {
          chat.lastMessage = message.content;
          chat.lastMessageDate = message.sentAt;
        }

        if (!message.isRead) {
          chat.unreadCount++;
        }
      }
    });

    return Array.from(chatMap.values());
  }

  sendReply(playerId: string): void {
    if (!this.replyText || this.replyText.trim() === '') {
      this.toastr.error('يرجى كتابة رد');
      return;
    }

    this.messageService.sendAdminReply(playerId, this.replyText).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.toastr.success('تم إرسال الرد بنجاح');
          this.replyText = ''; // Clear the input
          this.loadAdminMessages();
          this.cdr.detectChanges();

          // Scroll to bottom after sending reply
          setTimeout(() => {
            this.scrollToBottom();
          }, 100);
        } else {
          this.toastr.error(response.message || 'فشل في إرسال الرد');
        }
      },
      error: (err: any) => {
        this.toastr.error(err.message || 'فشل في إرسال الرد');
      },
    });
  }

  markAsRead(messageId: number): void {
    this.messageService.toggleMarkMessage(messageId, true).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.loadAdminMessages();
          this.cdr.detectChanges();
        }
      },
      error: (err: any) => {
        console.error('Error marking message as read:', err);
      },
    });
  }

  goBack(): void {
    this.selectedChat = null;
    this.selectedPlayerId = null;
  }

  trackByMessageId(index: number, message: any): number {
    return message.id;
  }
}
