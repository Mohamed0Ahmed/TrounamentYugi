import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Player } from 'src/app/models/interfaces';

interface AnimationGroup {
  groupNumber: number;
  players: Player[];
  animationState: 'pending' | 'animating' | 'completed';
}

@Component({
  selector: 'app-group-draw-animation',
  templateUrl: './group-draw-animation.component.html',
  styleUrls: ['./group-draw-animation.component.css'],
})
export class GroupDrawAnimationComponent implements OnInit {
  @Input() players: Player[] = [];
  @Output() animationComplete = new EventEmitter<void>();

  animationGroups: AnimationGroup[] = [];
  currentGroupIndex = 0;
  showBalls = false;
  currentRevealedPlayer = -1; // نبدأ بـ -1 عشان مفيش أسماء تظهر في البداية

  constructor() {}

  ngOnInit(): void {
    this.setupAnimation();
    this.startAnimation();
  }

  private setupAnimation(): void {
    // تجميع اللاعبين حسب المجموعات
    const groupedPlayers = this.getGroupedPlayers();

    // إنشاء مصفوفة الأنيميشن
    Object.keys(groupedPlayers).forEach((groupKey) => {
      const groupNumber = parseInt(groupKey);
      this.animationGroups.push({
        groupNumber,
        players: groupedPlayers[groupNumber],
        animationState: 'pending',
      });
    });

    // ترتيب المجموعات حسب الرقم
    this.animationGroups.sort((a, b) => a.groupNumber - b.groupNumber);
  }

  private getGroupedPlayers(): { [groupNumber: number]: Player[] } {
    const groupedPlayers: { [groupNumber: number]: Player[] } = {};

    this.players.forEach((player) => {
      if (player.groupNumber) {
        if (!groupedPlayers[player.groupNumber]) {
          groupedPlayers[player.groupNumber] = [];
        }
        groupedPlayers[player.groupNumber].push(player);
      }
    });

    // إذا لم يكن هناك groupNumber، استخدم التقسيم المحلي
    if (Object.keys(groupedPlayers).length === 0) {
      const sortedPlayers = [...this.players].sort(
        (a, b) => b.points - a.points
      );
      sortedPlayers.forEach((player, index) => {
        const groupNumber = (index % 4) + 1;
        if (!groupedPlayers[groupNumber]) {
          groupedPlayers[groupNumber] = [];
        }
        groupedPlayers[groupNumber].push(player);
      });
    }

    // ترتيب اللاعبين في كل مجموعة حسب النقاط
    Object.keys(groupedPlayers).forEach((groupKey) => {
      const groupNumber = parseInt(groupKey);
      groupedPlayers[groupNumber].sort((a, b) => b.points - a.points);
    });

    return groupedPlayers;
  }

  private async startAnimation(): Promise<void> {
    // انتظار قبل بدء الأنيميشن
    await this.delay(800);

    // عرض الكرات
    this.showBalls = true;
    await this.delay(1500);

    // بدء أنيميشن المجموعات
    for (let i = 0; i < this.animationGroups.length; i++) {
      this.currentGroupIndex = i;
      this.currentRevealedPlayer = -1; // reset قبل بدء كل مجموعة
      await this.animateGroup(this.animationGroups[i]);
      
      // إذا لم تكن المجموعة الأخيرة، اختفي الأسماء قبل الانتقال
      if (i < this.animationGroups.length - 1) {
        await this.delay(2500); // انتظار مع الأسماء ظاهرة
        this.currentRevealedPlayer = -1; // إخفاء الأسماء
        await this.delay(500); // نص ثانية قبل المجموعة الجديدة
      } else {
        // المجموعة الأخيرة - انتظار إضافي
        await this.delay(3000);
      }
    }

    // انتظار قبل إنهاء الأنيميشن
    await this.delay(2500);
    this.animationComplete.emit();
  }

    private async animateGroup(group: AnimationGroup): Promise<void> {
    group.animationState = 'animating';
    
    // أنيميشن فتح الكرة (مع صوت تأثير)
    await this.delay(1200);
    
    // كشف الأسماء واحد تلو الآخر (أبطأ)
    for (let i = 0; i < group.players.length; i++) {
      this.currentRevealedPlayer = i;
      await this.delay(800); // وقت أكتر بين كل اسم
    }
    
    group.animationState = 'completed';
    // لا نخفي الأسماء هنا - سيتم التحكم فيها من startAnimation
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  getCurrentGroup(): AnimationGroup | null {
    return this.animationGroups[this.currentGroupIndex] || null;
  }

  isGroupAnimating(groupNumber: number): boolean {
    const group = this.animationGroups.find(
      (g) => g.groupNumber === groupNumber
    );
    return group?.animationState === 'animating';
  }

  isGroupCompleted(groupNumber: number): boolean {
    const group = this.animationGroups.find(
      (g) => g.groupNumber === groupNumber
    );
    return group?.animationState === 'completed';
  }
}
