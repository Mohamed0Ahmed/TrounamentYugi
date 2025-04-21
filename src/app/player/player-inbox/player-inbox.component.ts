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
import { Message } from 'src/app/models/interfaces';

@Component({
  selector: 'app-player-inbox',
  templateUrl: './player-inbox.component.html',
  styleUrls: ['./player-inbox.component.css'],
})
export class PlayerInboxComponent implements OnInit, AfterViewChecked {
  messages: Message[] = [];
  newMessage: string = '';
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  constructor(
    private messageService: MessageService,
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
    this.messageService.getPlayerMessages().subscribe({
      next: (response) => {
        if (response && response.messages) {
          this.messages = response.messages
            .filter((message) => !message.isDeleted)
            .sort(
              (a, b) =>
                new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
            );
          this.cdr.detectChanges();
        } else {
          this.toastr.info('لا يوجد رسائل الآن');
        }
      },
      error: (err) => {
        this.toastr.error('حصل خطأ أثناء جلب الرسائل');
      },
    });
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) {
      this.toastr.warning('الرجاء كتابة رسالة');
      return;
    }

    this.messageService.sendMessage(this.newMessage).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('تم إرسال الرسالة');
          this.newMessage = '';
          this.loadMessages();
          this.cdr.detectChanges();
        } else {
          this.toastr.error(response.message || 'فشل إرسال الرسالة');
        }
      },
      error: (err) => {
        this.toastr.error('حصل خطأ أثناء إرسال الرسالة');
      },
    });
  }

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      const container = this.messagesContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    }
  }
}
