import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterOutlet, RouterLink, RouterLinkActive} from '@angular/router';
import {DataService} from './services/data';
import {MatIconModule} from '@angular/material/icon';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  public dataService = inject(DataService);

  toggleUserRole() {
    const current = this.dataService.currentUser();
    if (current.role === 'traveler') {
      this.dataService.switchUserRole('guide', 'g-chloe');
    } else {
      this.dataService.switchUserRole('traveler');
    }
  }
}
