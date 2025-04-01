import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/core/services/message.service';
import { ToastrService } from 'ngx-toastr';
import { Message } from 'src/app/models/interfaces';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css'],
})
export class InboxComponent implements OnInit {
  messages: Message[] = [];
  filteredMessages: Message[] = [];
  activeTab: 'all' | 'read' | 'unread' = 'all';

  constructor(
    private messageService: MessageService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadMessages();
  }
  loadMessages(): void {
    this.messageService.getMessages().subscribe({
      next: (response) => {
        if (response) {
          this.messages = response.messages.sort(
            (a, b) =>
              new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
          );

          this.filterMessages();
        } else {
          this.toastr.error('لا يوجد رسائل الآن');
        }
      },
      error: (err) => {
        this.toastr.error('حصل خطأ أثناء جلب الرسائل');
        console.error(err);
      },
    });
  }

  filterMessages(): void {
    if (this.activeTab === 'all') {
      this.filteredMessages = this.messages;
    } else if (this.activeTab === 'read') {
      this.filteredMessages = this.messages.filter((msg) => msg.isRead);
    } else {
      this.filteredMessages = this.messages.filter((msg) => !msg.isRead);
    }
  }

  changeTab(tab: 'all' | 'read' | 'unread'): void {
    this.activeTab = tab;
    this.filterMessages();
  }

  toggleMarkMessage(message: Message): void {
    this.messageService
      .toggleMarkMessage(message.id, !message.isRead)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.toastr.success('تم تحديث حالة الرسالة');
            message.isRead = !message.isRead;
            this.filterMessages();
          }
        },
        error: (err) => {
          this.toastr.error('حدث خطأ أثناء تحديث الحالة');
          console.error(err);
        },
      });
  }
}
