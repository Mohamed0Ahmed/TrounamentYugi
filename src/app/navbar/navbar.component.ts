import { Component, OnInit } from '@angular/core';
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
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  isAdmin = false;
  notes: Note[] = [];
  isMenuOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private noteService: NoteService
  ) {
    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
      this.isAdmin = this.authService.getRole() === 'Admin';
    });
  }
  ngOnInit(): void {
    this.getNotes();
  }

  logout() {
    this.authService.logout();
    this.toastr.success('تم تسجيل الخروج بنجاح');
    this.router.navigate(['/player']);
  }

  getNotes(): void {
    this.noteService.getNotes().subscribe((response) => {
      this.notes = response.notes.filter((n) => n.isHidden == false);
    });
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
