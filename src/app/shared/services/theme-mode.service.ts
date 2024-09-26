import { Injectable, effect, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeModeService {
  themeModeSignal = signal<string>(
    JSON.parse(window.localStorage.getItem('themeModeSignal') || 'null')
  );
  updateThemeMode() {
    this.themeModeSignal.update((value) => (value === 'dark' ? 'light' : 'dark'));
  }
  constructor() {
    effect(() => {
      window.localStorage.setItem('themeModeSignal', JSON.stringify(this.themeModeSignal()));
      const themeModeClass = this.themeModeSignal() === 'dark' ? 'dark' : 'light';
      document.body.classList.add(themeModeClass);
    })
  }


}
