import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PreguntaService } from '../../../services/pregunta.service';
import { RespuestaService } from '../../../services/respuesta.service';
import { Pregunta } from '../../../models/pregunta';
import { Respuesta } from '../../../models/respuesta';
import { MenuBarComponent } from '../../components/menu-bar/menu-bar.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-slam',
  standalone: true,
  imports: [CommonModule, FormsModule, MenuBarComponent],
  templateUrl: './slam.component.html',
  styleUrls: ['./slam.component.css']
})
export class SlamComponent implements OnInit {
  preguntas: Pregunta[] = [];
 respuestas: Respuesta[] = [];
  preguntaActual = 0;
  respuestaActual = '';
  fotoFile: File | null = null;
  fotoPreview: string | null = null;
  completado = false;
  usuarioId?: number;

  constructor(private preguntaService: PreguntaService, private respuestaService: RespuestaService) {}

  ngOnInit(): void {
    const u = localStorage.getItem('usuario');
    if (!u) { alert('Debes iniciar sesión'); return; }
    this.usuarioId = JSON.parse(u).id;

    this.preguntaService.obtenerPreguntas().subscribe({
      next: p => {
        this.preguntas = p;
        this.respuestas = p.map(q => ({
        preguntaId: q.id,
        usuarioId: this.usuarioId!,
        texto: null,
        fotoUrl: null
      }));
        if (this.preguntas.length) {
          this.preguntaActual = 0;
          this.respuestaActual = this.respuestas[0].texto || '';
        }
      },
      error: err => console.error(err)
    });
  }

  onFotoSeleccionada(ev: any) {
    const f: File = ev.target.files && ev.target.files[0];
    if (!f) return;
    this.fotoFile = f;
    const reader = new FileReader();
    reader.onload = (e) => this.fotoPreview = (e.target as any).result;
    reader.readAsDataURL(f);
  }

  anterior() {
    this.respuestas[this.preguntaActual].texto = this.respuestaActual || null;
    if (this.preguntaActual > 0) {
      this.preguntaActual--;
      this.respuestaActual = this.respuestas[this.preguntaActual].texto || '';
    }
  }

  pasar() {
    this.respuestas[this.preguntaActual].texto = null;
    this.siguiente();
  }

  siguiente() {
    this.respuestas[this.preguntaActual].texto = this.respuestaActual || null;
    if (this.preguntaActual < this.preguntas.length - 1) {
      this.preguntaActual++;
      this.respuestaActual = this.respuestas[this.preguntaActual].texto || '';
      // simple "chipotas" bounce by toggling class in DOM via CSS animation if needed
      const title = document.querySelector('.slam-title');
      if (title) {
        title.classList.add('bounce');
        setTimeout(() => title.classList.remove('bounce'), 300);
      }
    } else {
      this.guardarTodo();
    }
  }

  async guardarTodo() {
  try {
    if (this.fotoFile) {
      // subir foto y asignar a la primera respuesta
      const fotoUrl = await firstValueFrom(
        this.respuestaService.subirFoto(this.fotoFile)
      );
    console.log("foto subida:", fotoUrl);
      if (this.respuestas[0]) {
        this.respuestas[0].fotoUrl = fotoUrl;
      }
    }
  } catch (err) {
    console.error('Error subiendo la foto:', err);
    alert('Error subiendo la foto');
    return;
  }

 const payload: Respuesta[] = this.respuestas.map(r => ({
    preguntaId: r.preguntaId,
    usuarioId: this.usuarioId!,
    texto: r.texto,
    fotoUrl: r.fotoUrl || null
  }));

  this.respuestaService.guardarRespuestas(payload).subscribe({
    next: () => {
      this.completado = true;
      alert('Gracias! Tus respuestas fueron guardadas');
    },
    error: err => {
      console.error(err);
      alert('Error guardando respuestas');
    }
  });
}
}
