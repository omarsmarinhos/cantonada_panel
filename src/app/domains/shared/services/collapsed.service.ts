import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CollapsedService {

  isCollapsed = signal(false);

  toggleCollapsed() {
    this.isCollapsed.update(prevState => !prevState)
  }

  constructor() { }
}
