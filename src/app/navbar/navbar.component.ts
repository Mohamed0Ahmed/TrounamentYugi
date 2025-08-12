import {
  Component,
  HostListener,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { AuthService } from '../../app/core/services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NoteService } from '../core/services/note.service';
import { Note } from '../models/interfaces';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, AfterViewInit {
  @ViewChild('navbarContainer', { static: false }) navbarContainer!: ElementRef;
  @ViewChild('navbarOnly', { static: false }) navbarOnly!: ElementRef;
  @Output() navbarHeightChange = new EventEmitter<number>();

  isLoggedIn = false;
  isAdmin = false;
  notes: Note[] = [];
  isMenuOpen = false;
  navbarHeight = 80; // default height
  navbarOnlyHeight = 60; // navbar without notes

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private noteService: NoteService
  ) {
    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
      const role = this.authService.getRole();
      this.isAdmin = role === 'Admin';
    });
  }
  ngOnInit(): void {
    this.getNotes();
  }

  ngAfterViewInit(): void {
    this.calculateNavbarHeight();
  }

  calculateNavbarHeight(): void {
    setTimeout(() => {
      // Calculate navbar only height
      if (this.navbarOnly) {
        this.navbarOnlyHeight = this.navbarOnly.nativeElement.offsetHeight;
      }

      // Calculate total height including notes
      const notesHeight = this.notes.length * 32; // approximate height per note
      const totalHeight = this.navbarOnlyHeight + notesHeight;
      this.navbarHeight = totalHeight;
      this.navbarHeightChange.emit(totalHeight);
    }, 150);
  }

  getNavbarOnlyHeight(): number {
    return this.navbarOnlyHeight;
  }

  logout() {
    this.authService.logout();
    this.toastr.success('تم تسجيل الخروج بنجاح');
    this.router.navigate(['/player']);
  }

  getNotes(): void {
    this.noteService.getNotes().subscribe((response) => {
      // Handle if response.notes is wrapped in an object or not an array
      const notes = Array.isArray(response.notes)
        ? response.notes
        : (response.notes as any)?.data || [];
      this.notes = notes.filter((n: Note) => n.isHidden == false);
      // Recalculate height after notes change
      setTimeout(() => this.calculateNavbarHeight(), 50);
    });
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.calculateNavbarHeight();
  }
}
