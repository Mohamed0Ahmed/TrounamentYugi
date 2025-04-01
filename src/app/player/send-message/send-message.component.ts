import { MessageService } from './../../core/services/message.service';
import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.css']
})
export class SendMessageComponent {
  message: string = '';

  constructor(
    private messageService: MessageService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  sendMessage(): void {
    if (!this.message) {
      this.toastr.error('من فضلك اكتب الرسالة');
      return;
    }

    this.messageService.sendMessage(this.message).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastr.success('تم إرسال الرسالة بنجاح');
          this.router.navigate(['/player']);
        } else {
          this.toastr.error(response.message);
        }
      },
      error: (err) => {
        this.toastr.error('حصل خطأ أثناء إرسال الرسالة');
        console.error(err);
      }
    });
  }

  close(): void {
    this.router.navigate(['/player']);
  }
}
