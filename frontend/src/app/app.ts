import {Component, inject} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {
  MatSidenav,
  MatSidenavContainer,
  MatSidenavContent
} from '@angular/material/sidenav';
import {MatToolbar} from '@angular/material/toolbar';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatListItem, MatListItemIcon, MatNavList} from '@angular/material/list';
import {MatChip} from '@angular/material/chips';

@Component({
  selector: 'app-root',
  imports: [MatToolbar, MatSidenav, MatSidenavContainer, MatSidenavContent, MatIcon, MatIconButton, MatNavList, MatListItem, MatChip, RouterOutlet, RouterLink, MatListItemIcon],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  router = inject(Router);
}
