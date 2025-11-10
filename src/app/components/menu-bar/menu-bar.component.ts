import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UsuarioListComponent } from '../../components/usuario-list/usuario-list.component';




@Component({
  selector: 'app-menu-bar',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatToolbarModule, UsuarioListComponent],
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class MenuBarComponent {}
