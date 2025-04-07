import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-forbidden-cards',
  templateUrl: './forbidden-cards.component.html',
  styleUrls: ['./forbidden-cards.component.css'],
})
export class ForbiddenCardsComponent implements OnInit {
  spellCards: string[] = [
    './assets/images/Spell Cards/1.jpg',
    './assets/images/Spell Cards/4.jpg',
    './assets/images/Spell Cards/5.jpg',
    './assets/images/Spell Cards/6.jpg',
    './assets/images/Spell Cards/12.jpg',
    './assets/images/Spell Cards/14.jpg',
    './assets/images/Spell Cards/15.jpg',
    './assets/images/Spell Cards/16.jpg',
    './assets/images/Spell Cards/18.jpg',
    './assets/images/Spell Cards/19.jpg',
    './assets/images/Spell Cards/20.jpg',
    './assets/images/Spell Cards/21.jpg',
    './assets/images/Spell Cards/24.jpg',
    './assets/images/Spell Cards/25.jpg',
    './assets/images/Spell Cards/26.jpg',
    './assets/images/Spell Cards/13.jpg',
    './assets/images/Spell Cards/2.jpg',
    './assets/images/Spell Cards/3.jpg',
    './assets/images/Spell Cards/7.jpg',
    './assets/images/Spell Cards/17.jpg',
    './assets/images/Spell Cards/8.jpg',
    './assets/images/Spell Cards/9.jpg',
    './assets/images/Spell Cards/10.jpg',
    './assets/images/Spell Cards/11.jpg',
    './assets/images/Spell Cards/22.jpg',
    './assets/images/Spell Cards/23.jpg',
  ];
  trapCards: string[] = [
    './assets/images/Trap Cards/11.jpg',
    './assets/images/Trap Cards/2.jpg',
    './assets/images/Trap Cards/1.jpg',
    './assets/images/Trap Cards/3.jpg',
    './assets/images/Trap Cards/4.jpg',
    './assets/images/Trap Cards/5.jpg',
    './assets/images/Trap Cards/6.jpg',
    './assets/images/Trap Cards/7.jpg',
    './assets/images/Trap Cards/8.jpg',
    './assets/images/Trap Cards/9.jpg',
    './assets/images/Trap Cards/10.jpg',
    './assets/images/Trap Cards/12.jpg',
    './assets/images/Trap Cards/13.jpg',
  ];
  monsters: string[] = [
    './assets/images/Monster/13.jpg',
    './assets/images/Monster/3.jpg',
    './assets/images/Monster/4.jpg',
    './assets/images/Monster/2.jpg',
    './assets/images/Monster/1.jpg',
    './assets/images/Monster/5.jpg',
    './assets/images/Monster/6.jpg',
    './assets/images/Monster/7.jpg',
    './assets/images/Monster/8.jpg',
    './assets/images/Monster/9.jpg',
    './assets/images/Monster/10.jpg',
    './assets/images/Monster/11.jpg',
    './assets/images/Monster/12.jpg',
  ];

  selectedImage: string | null = null;
  isModalOpen = false;
  isModalOpenAll = false;
  ngOnInit(): void {}

  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 1,
      },
      740: {
        items: 2,
      },
      940: {
        items: 10,
      },
    },
    nav: true,
  };

  openModal(image: string): void {
    this.selectedImage = image;
    this.isModalOpen = true;
  }
  openAll(): void {
    this.isModalOpenAll = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.isModalOpenAll = false;
    this.selectedImage = null;
  }
}
