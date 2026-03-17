import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuBarComponent } from '../../components/menu-bar/menu-bar.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, MenuBarComponent],
  templateUrl: './admin.component.html'
})
export class AdminComponent {}
