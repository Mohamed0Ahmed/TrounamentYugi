import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  ViewChild,
  ElementRef,
  AfterViewInit,
  AfterViewChecked,
} from '@angular/core';
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
export class FloatingInboxComponent
  implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked
{
  // Floating button properties
  isAdmin = false;
  showInboxOverlay = false;
  buttonPosition = { x: 20, y: 100 };
  isDragging = false;
  dragOffset = { x: 0, y: 0 };
  hasMovedDuringDrag = false;
  unreadCount = 0;
  isMobile = false;

  // Inbox properties
  playerChats: PlayerChat[] = [];
  selectedPlayerId: string | null = null;
  selectedChat: PlayerChat | null = null;
  replyText = ''; // New property for single reply input
  navbarHeight = 60;

  // ViewChild for messages container
  @ViewChild('messagesContainer')
  messagesContainer!: ElementRef<HTMLDivElement>;

  // Flag to control initial scroll
  private shouldScrollToBottom = false;

  // Cache management
  private readonly CACHE_KEY = 'adminMessagesCache';
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds
  private cachedMessages: PlayerChat[] = [];
  private lastCacheUpdate: number = 0;

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
    this.detectMobileDevice();

    if (this.isAdmin) {
      // Load fresh data from server (like inbox.component)
      this.loadAdminMessages();
    }
  }

  ngAfterViewInit(): void {
    // View is initialized, can now access ViewChild elements
  }

  ngAfterViewChecked(): void {
    // Only scroll to bottom if flag is set (first time opening chat)
    if (
      this.shouldScrollToBottom &&
      this.selectedChat &&
      this.messagesContainer
    ) {
      // Small delay to ensure DOM is fully updated
      setTimeout(() => {
        this.scrollToBottom();
        // Reset flag after scrolling
        this.shouldScrollToBottom = false;
      }, 100);
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
    // Always toggle the overlay when clicked
    this.showInboxOverlay = !this.showInboxOverlay;

    if (this.showInboxOverlay) {
      this.loadAdminMessages();
      setTimeout(() => {
        this.fixInboxComponentForOverlay();
      }, 100);
    }
  }

  onButtonClick(event: Event): void {
    // Handle click events (mainly for desktop)
    // Prevent this from firing if we're dragging or on mobile
    // This prevents conflicts with touch events on mobile
    if (!this.isDragging && !this.isMobile) {
      this.toggleInboxOverlay();
    }
  }

  private detectMobileDevice(): void {
    // Check if device is mobile using multiple detection methods
    // This ensures accurate mobile detection for touch event handling
    this.isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0;
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
    // Start dragging and reset movement flag for mouse events
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
    // Start dragging and reset movement flag for touch events
    this.isDragging = true;
    this.hasMovedDuringDrag = false;

    const touch = event.touches[0];
    this.dragOffset = {
      x: touch.clientX - this.buttonPosition.x,
      y: touch.clientY - this.buttonPosition.y,
    };

    // Don't prevent default on touch start to allow proper touch handling
    // This ensures touch events work correctly on mobile
    event.stopPropagation();
    document.body.style.cursor = 'grabbing';
    document.body.classList.add('dragging');
  }

  onButtonTouchEnd(event: TouchEvent): void {
    // Only open modal if it's a tap (no dragging occurred)
    if (!this.hasMovedDuringDrag) {
      event.preventDefault();
      event.stopPropagation();
      this.toggleInboxOverlay();
    }

    this.isDragging = false;
    document.body.style.cursor = 'default';
    document.body.classList.remove('dragging');

    // Reset the flag immediately to prevent conflicts
    this.hasMovedDuringDrag = false;
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

  @HostListener('document:touchend', ['$event'])
  onGlobalTouchEnd(event: TouchEvent): void {
    // Only handle global touch end if we're not handling button touch end
    if (
      this.isDragging &&
      !(event.target as Element)?.closest('.floating-button')
    ) {
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

  // Cache management methods
  private saveToCache(messages: PlayerChat[]): void {
    try {
      const cacheData = {
        messages: messages,
        timestamp: Date.now(),
      };
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheData));
      this.cachedMessages = messages;
      this.lastCacheUpdate = Date.now();
    } catch (error) {
      console.warn('Error saving messages to cache:', error);
    }
  }

  private loadFromCache(): PlayerChat[] | null {
    try {
      const cachedData = localStorage.getItem(this.CACHE_KEY);
      if (!cachedData) return null;

      const parsed = JSON.parse(cachedData);
      const cacheAge = Date.now() - parsed.timestamp;

      // Check if cache is still valid (less than 30 minutes old)
      if (cacheAge < this.CACHE_DURATION) {
        this.cachedMessages = parsed.messages;
        this.lastCacheUpdate = parsed.timestamp;
        return parsed.messages;
      }

      // Cache expired, remove it
      localStorage.removeItem(this.CACHE_KEY);
      return null;
    } catch (error) {
      console.warn('Error loading messages from cache:', error);
      localStorage.removeItem(this.CACHE_KEY);
      return null;
    }
  }

  private isCacheValid(): boolean {
    return (
      this.cachedMessages.length > 0 &&
      Date.now() - this.lastCacheUpdate < this.CACHE_DURATION
    );
  }

  // Public method to get cache status
  getCacheStatus(): { isValid: boolean; lastUpdate: Date | null; age: number } {
    if (this.cachedMessages.length === 0) {
      return { isValid: false, lastUpdate: null, age: 0 };
    }

    const age = Date.now() - this.lastCacheUpdate;
    const isValid = age < this.CACHE_DURATION;

    return {
      isValid,
      lastUpdate: new Date(this.lastCacheUpdate),
      age: Math.floor(age / 1000 / 60), // Age in minutes
    };
  }

  // Method to clear cache manually
  clearCache(): void {
    try {
      localStorage.removeItem(this.CACHE_KEY);
      this.cachedMessages = [];
      this.lastCacheUpdate = 0;
    } catch (error) {
      console.warn('Error clearing cache:', error);
    }
  }

  // Method to update cache with new data
  private updateCacheWithNewData(newMessages: any[]): void {
    if (newMessages.length === 0) return;

    // Update existing chat messages
    newMessages.forEach((newMessage) => {
      const existingChat = this.cachedMessages.find(
        (chat) => chat.playerId === newMessage.senderId
      );

      if (existingChat) {
        // Check if message already exists
        const messageExists = existingChat.messages.some(
          (msg) => msg.id === newMessage.id
        );

        if (!messageExists) {
          // Add new message
          existingChat.messages.push(newMessage);

          // Update last message and date
          if (
            new Date(newMessage.sentAt) > new Date(existingChat.lastMessageDate)
          ) {
            existingChat.lastMessage = newMessage.content;
            existingChat.lastMessageDate = newMessage.sentAt;
          }

          // Update unread count
          if (!newMessage.isRead && !newMessage.isFromAdmin) {
            existingChat.unreadCount++;
          }
        }
      } else {
        // Create new chat
        const newChat: PlayerChat = {
          playerId: newMessage.senderId,
          playerFullName: newMessage.senderFullName,
          lastMessage: newMessage.content,
          lastMessageDate: newMessage.sentAt,
          unreadCount: !newMessage.isRead && !newMessage.isFromAdmin ? 1 : 0,
          messages: [newMessage],
        };
        this.cachedMessages.push(newChat);
      }
    });

    // Sort chats by last message date
    this.cachedMessages.sort(
      (a, b) =>
        new Date(b.lastMessageDate).getTime() -
        new Date(a.lastMessageDate).getTime()
    );

    // Save updated cache
    this.saveToCache(this.cachedMessages);

    // Update UI
    this.playerChats = [...this.cachedMessages];
  }

  // Inbox functionality
  private loadAdminMessages(): void {
    // Always load fresh data from server (like inbox.component)
    this.loadFromServer(false);
  }

  private loadFromServer(isBackgroundRefresh: boolean = false): void {
    this.adminDashboardService.getSecondaryData('messages').subscribe({
      next: (messages) => {
        if (messages && messages.length > 0) {
          const groupedMessages = this.groupMessagesBySender(messages);

          // Always update playerChats (like inbox.component)
          this.playerChats = groupedMessages.sort(
            (a, b) =>
              new Date(b.lastMessageDate).getTime() -
              new Date(a.lastMessageDate).getTime()
          );

          // Save to cache for offline use
          this.saveToCache(this.playerChats);

          if (!isBackgroundRefresh) {
            // this.toastr.success('تم تحديث الرسائل بنجاح');
          }
        } else {
          this.toastr.error('لا يوجد رسائل');
          this.playerChats = []; // Clear chats if no messages
          this.saveToCache([]); // Save empty cache
        }
      },
      error: (err) => {
        this.toastr.error(err.message);
        this.playerChats = []; // Clear chats on error
        this.saveToCache([]); // Save empty cache on error
      },
    });
  }

  refreshMessages(): void {
    // Force refresh from server and update cache
    this.messageService.getAdminMessages().subscribe({
      next: (response) => {
        if (response && response.messages) {
          const groupedMessages = this.groupMessagesBySender(response.messages);

          // Update playerChats
          this.playerChats = groupedMessages.sort(
            (a, b) =>
              new Date(b.lastMessageDate).getTime() -
              new Date(a.lastMessageDate).getTime()
          );

          // Update cache
          this.saveToCache(this.playerChats);

          // Update UI
          this.cdr.detectChanges();
        } else {
          this.toastr.error('لا يوجد رسائل');
        }
      },
      error: (err) => {
        this.toastr.error(err.message || 'فشل في تحديث الرسائل');
      },
    });
  }

  selectChat(chat: PlayerChat): void {
    this.selectedChat = chat;
    this.selectedPlayerId = chat.playerId;

    // Use cached data directly (no new request)
    if (this.selectedChat && this.selectedChat.messages) {
      // Automatically mark unread messages as read
      this.markUnreadMessagesAsRead(chat.playerId);

      // Set flag to scroll to bottom on next view check
      this.shouldScrollToBottom = true;
    }
  }

  private loadChatMessages(playerId: string): void {
    // Use cached messages instead of making new request
    if (this.cachedMessages.length > 0) {
      const playerMessages =
        this.cachedMessages.find((chat) => chat.playerId === playerId)
          ?.messages || [];

      if (this.selectedChat) {
        this.selectedChat.messages = playerMessages;

        // Automatically mark unread messages as read
        this.markUnreadMessagesAsRead(playerId);

        // Scroll to bottom after messages load
        setTimeout(() => {
          this.scrollToBottom();
        }, 100);
      }
    } else {
      // Fallback: load from server if no cache
      this.loadFromServer(false);
    }
  }

  // New method to automatically mark unread messages as read
  private markUnreadMessagesAsRead(playerId: string): void {
    if (!this.selectedChat) return;

    const unreadMessages = this.selectedChat.messages.filter(
      (msg) => !msg.isFromAdmin && !msg.isRead
    );

    if (unreadMessages.length > 0) {
      // Mark all unread messages as read
      unreadMessages.forEach((message) => {
        this.messageService.toggleMarkMessage(message.id, true).subscribe({
          next: (response: any) => {
            if (response.success) {
              // Update local cache
              message.isRead = true;

              // Update unread count in chat list
              const chatInList = this.playerChats.find(
                (c) => c.playerId === playerId
              );
              if (chatInList) {
                chatInList.unreadCount = Math.max(
                  0,
                  chatInList.unreadCount - 1
                );
              }

              // Update cache with new read status
              this.saveToCache(this.playerChats);

              // Update UI
              this.cdr.detectChanges();
            }
          },
          error: (err: any) => {
            console.error('Error marking message as read:', err);
          },
        });
      });
    }
  }

  private scrollToTop(): void {
    const messagesContainer = document.querySelector('#messagesContainer');
    if (messagesContainer) {
      messagesContainer.scrollTop = 0;
    }
  }

  private scrollToBottom(): void {
    if (this.messagesContainer && this.messagesContainer.nativeElement) {
      // Scroll to bottom to show latest messages
      this.messagesContainer.nativeElement.scrollTop =
        this.messagesContainer.nativeElement.scrollHeight;
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

    // Sort messages within each chat from oldest to newest
    Array.from(chatMap.values()).forEach((chat) => {
      chat.messages.sort(
        (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
      );
    });

    return Array.from(chatMap.values());
  }

  sendReply(playerId: string): void {
    if (!this.replyText || this.replyText.trim() === '') {
      this.toastr.error('يرجى كتابة رد');
      return;
    }

    const replyContent = this.replyText; // Store before clearing
    this.replyText = ''; // Clear the input

    this.messageService.sendAdminReply(playerId, replyContent).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.toastr.success('تم إرسال الرد بنجاح');

          // Add the new reply to local data immediately (like inbox.component)
          // This ensures the UI updates instantly without waiting for server response
          if (this.selectedChat) {
            const newReply = {
              id: response.messageId || Date.now(),
              content: replyContent,
              sentAt: new Date().toISOString(),
              isFromAdmin: true,
              isRead: true,
              senderId: 'admin',
              senderFullName: 'Admin',
            };

            // Add to selected chat
            this.selectedChat.messages.push(newReply);

            // Update last message in chat list
            const chatInList = this.playerChats.find(
              (c) => c.playerId === playerId
            );
            if (chatInList) {
              chatInList.lastMessage = replyContent;
              chatInList.lastMessageDate = newReply.sentAt;

              // Re-sort chats by latest message
              this.playerChats.sort(
                (a, b) =>
                  new Date(b.lastMessageDate).getTime() -
                  new Date(a.lastMessageDate).getTime()
              );
            }

            // Update cache
            this.saveToCache(this.playerChats);

            // Force UI update immediately to show the new message
            this.cdr.detectChanges();

            // Scroll to bottom after sending reply to show the new message
            setTimeout(() => {
              this.scrollToBottom();
            }, 100);
          }
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
          // Update local data immediately (like inbox.component)
          if (this.selectedChat) {
            const message = this.selectedChat.messages.find(
              (msg) => msg.id === messageId
            );
            if (message) {
              message.isRead = true;

              // Update unread count in chat list
              const chatInList = this.playerChats.find(
                (c) => c.playerId === this.selectedChat?.playerId
              );
              if (chatInList) {
                chatInList.unreadCount = Math.max(
                  0,
                  chatInList.unreadCount - 1
                );
              }

              // Update cache
              this.saveToCache(this.playerChats);
            }
          }

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
