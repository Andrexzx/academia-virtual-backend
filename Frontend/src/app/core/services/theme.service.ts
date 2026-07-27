import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkMode = signal<boolean>(true);

  constructor() {
    const saved = localStorage.getItem('theme');
    if (saved !== null) {
      this.isDarkMode.set(saved === 'dark');
    } else {
      this.isDarkMode.set(true);
    }
    this.applyTheme();
  }

  toggleTheme(): void {
    this.isDarkMode.update(prev => !prev);
    localStorage.setItem('theme', this.isDarkMode() ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme(): void {
    if (this.isDarkMode()) {
      document.documentElement.classList.add('dark-theme');
      document.documentElement.classList.remove('light-theme');
    } else {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark-theme');
    }
  }
}
