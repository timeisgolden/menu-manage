import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Menu Management';
  isAuthenticated: boolean;
  constructor(public authService: AuthService) {
    this.isAuthenticated = this.authService.isLoggedIn;
  }

  async ngOnInit() {
    this.isAuthenticated = this.authService.isLoggedIn;
  }

  logout() {
    this.authService.logout();
  }
}
