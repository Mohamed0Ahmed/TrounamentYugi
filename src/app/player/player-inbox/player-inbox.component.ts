import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  ChangeDetectorRef,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'src/app/core/services/message.service';
import { FriendlyMessageService } from 'src/app/core/services/friendly-message.service';
import { Message } from 'src/app/models/interfaces';
import { FriendlyMessageDto } from 'friendly-message-types';

@Component({
  selector: 'app-player-inbox',
  templateUrl: './player-inbox.component.html',
  styleUrls: ['./player-inbox.component.css'],
})
export class PlayerInboxComponent implements OnInit, AfterViewChecked {
  messages: Message[] = [];
  friendlyMessages: FriendlyMessageDto[] = [];
  newMessage: string = '';
  isFriendlyMode: boolean = false; // Default to official messages
  isLoading: boolean = false;
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  constructor(
    private messageService: MessageService,
    private friendlyMessageService: FriendlyMessageService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
    this.scrollToBottom();
  }

  loadMessages(): void {
    this.isLoading = true;

    if (this.isFriendlyMode) {
      this.loadFriendlyMessages();
    } else {
      this.loadOfficialMessages();
    }
  }

  private loadOfficialMessages(): void {
    this.messageService.getPlayerMessages().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response && response.messages) {
          this.messages = response.messages
            .filter((message) => !message.isDeleted)
            .sort(
              (a, b) =>
                new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
            );
          this.cdr.detectChanges();
        } else {
          this.toastr.info('لا يوجد رسائل رسمية الآن');
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error('حصل خطأ أثناء جلب الرسائل الرسمية');
      },
    });
  }

  private loadFriendlyMessages(): void {
    this.friendlyMessageService.getPlayerMessages(0).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response && response.messages) {
          this.friendlyMessages = response.messages.sort(
            (a, b) =>
              new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
          );
          this.cdr.detectChanges();
        } else {
          this.toastr.info('لا يوجد رسائل ودية الآن');
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error('حصل خطأ أثناء جلب الرسائل الودية');
      },
    });
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) {
      this.toastr.warning('الرجاء كتابة رسالة');
      return;
    }

    if (this.isFriendlyMode) {
      this.sendFriendlyMessage();
    } else {
      this.sendOfficialMessage();
    }
  }

  private sendOfficialMessage(): void {
    this.messageService.sendMessage(this.newMessage).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('تم إرسال الرسالة الرسمية');
          this.newMessage = '';
          this.loadMessages();
          this.cdr.detectChanges();
        } else {
          this.toastr.error(response.message || 'فشل إرسال الرسالة الرسمية');
        }
      },
      error: (err) => {
        this.toastr.error('حصل خطأ أثناء إرسال الرسالة الرسمية');
      },
    });
  }

  private sendFriendlyMessage(): void {
    this.friendlyMessageService
      .sendMessageToAdmin(0, this.newMessage)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success('تم إرسال الرسالة الودية');
            this.newMessage = '';
            this.loadMessages();
            this.cdr.detectChanges();
          } else {
            this.toastr.error(response.message || 'فشل إرسال الرسالة الودية');
          }
        },
        error: (err) => {
          this.toastr.error('حصل خطأ أثناء إرسال الرسالة الودية');
        },
      });
  }

  toggleMessageMode(): void {
    this.isFriendlyMode = !this.isFriendlyMode;
    this.messages = [];
    this.friendlyMessages = [];
    this.newMessage = '';
    this.loadMessages();
  }

  get currentMessages(): any[] {
    return this.isFriendlyMode ? this.friendlyMessages : this.messages;
  }

  get messageTypeLabel(): string {
    return this.isFriendlyMode ? 'رسائل ودية' : 'رسائل رسمية';
  }

  get toggleButtonText(): string {
    return this.isFriendlyMode
      ? 'التبديل للرسائل الرسمية'
      : 'التبديل للرسائل الودية';
  }

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      const container = this.messagesContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    }
  }
}
