import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { UsuarioFormComponent } from '../usuario-form/usuario-form.component';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatTableModule,
    MatDialogModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './usuario-list.component.html'
})
export class UsuarioListComponent implements OnInit {
  displayedColumns = ['nombre', 'email', 'acciones'];
  usuarios: Usuario[] = [];

  constructor(private dialog: MatDialog, private usuarioService: UsuarioService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuarioService.obtenerUsuarios().subscribe(data => this.usuarios = data);
  }

  nuevoUsuario() {
  //const dialogRef = this.dialog.open(UsuarioFormComponent);

  const dialogRef = this.dialog.open(UsuarioFormComponent, {
  width: '500px',   // ⬅️ ajusta el ancho
  height: 'auto',   // ⬅️ opcional
  panelClass: 'custom-dialog-container'
});


  dialogRef.afterClosed().subscribe(result => {
    console.log('Resultado recibido del diálogo:', result);
    if (result) {
      this.usuarioService.agregarUsuario(result).subscribe({
        next: () => {
          console.log('Usuario agregado correctamente');
          this.cargarUsuarios();
        },
        error: err => console.error('Error al agregar usuario:', err)
      });
    }
  });
}

  editarUsuario(usuario: Usuario) {
    //const dialogRef = this.dialog.open(UsuarioFormComponent, { data: usuario });
    const dialogRef = this.dialog.open(UsuarioFormComponent, {
      width: '500px',   // ⬅️ ajusta el ancho
      height: 'auto',   // ⬅️ opcional
      panelClass: 'custom-dialog-container',
      data: usuario
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.usuarioService.actualizarUsuario(usuario.id!, result)
          .subscribe(() => this.cargarUsuarios());
      }
    });
  }


eliminarUsuario(u: Usuario) {
  Swal.fire({
    title: '💔 ¿Eliminar usuario?',
    html: `<p style="font-size:18px; color:#6b005b;">
             ¿Seguro que deseas eliminar a <b>${u.nombre}</b>?
           </p>`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: '💗 Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#f48fb1',
    cancelButtonColor: '#bdbdbd',
    background: '#fff0f5',
    color: '#4a004e',
    backdrop: `
      rgba(255, 192, 203, 0.3)
      left top
      no-repeat
    `,
    customClass: {
      popup: 'rounded-3xl shadow-2xl animate__animated animate__fadeInDown',
      title: 'font-bold text-2xl',
      confirmButton: 'rounded-full px-4 py-2 text-white font-semibold',
      cancelButton: 'rounded-full px-4 py-2 text-gray-700 font-semibold'
    }
  }).then((result) => {
    if (result.isConfirmed) {
      this.usuarioService.eliminarUsuario(u.id!).subscribe({
        next: () => {
          Swal.fire({
            title: '✨ Usuario eliminado',
            html: `<p style="font-size:17px; color:#6b005b;">
                     El usuario <b>${u.nombre}</b> fue eliminado correctamente.
                   </p>`,
            icon: 'success',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#f48fb1',
            background: '#fff0f5',
            color: '#4a004e',
            customClass: {
              popup: 'rounded-3xl shadow-lg animate__animated animate__fadeInUp'
            }
          });
          this.cargarUsuarios();
        },
        error: () => {
          Swal.fire({
            title: '❌ Error',
            text: 'No se pudo eliminar el usuario.',
            icon: 'error',
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#f48fb1',
            background: '#fff0f5',
            color: '#4a004e'
          });
        }
      });
    }
  });
}


}
