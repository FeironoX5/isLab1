import {Injectable, signal} from '@angular/core';

@Injectable({providedIn: 'root'})
export class UserContextService {
  readonly username = signal<string>(localStorage.getItem('username') || 'student');
  readonly role = signal<string>(localStorage.getItem('role') || 'user');

  setUsername(username: string) {
    this.username.set(username || 'student');
    localStorage.setItem('username', this.username());
  }

  setRole(role: string) {
    this.role.set(role || 'user');
    localStorage.setItem('role', this.role());
  }
}
