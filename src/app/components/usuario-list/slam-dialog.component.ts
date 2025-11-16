import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PreguntaService } from '../../../services/pregunta.service';
import { RespuestaService } from '../../../services/respuesta.service';

import { Pregunta } from '../../../models/pregunta';
import { Usuario } from '../../../models/usuario';
import { Respuesta } from '../../../models/respuesta';

@Component({
  selector: 'app-slam-dialog',
  standalone: true,
  templateUrl: './slam-dialog.component.html',
  styleUrls: ['./slam-dialog.component.css'],
  imports: [CommonModule]
})
export class SlamDialogComponent implements OnInit {

  preguntas: Pregunta[] = [];
  respuestas: { pregunta: Pregunta; texto: string | null; foto?: string | null }[] = [];

  preguntaActual = 0;
  respuestaActual = '';
  foto: File | null = null;
  usuarioId!: number;

  usuario!: Usuario;
  completado = false;


  constructor(
    private preguntaService: PreguntaService,
    private respuestaService: RespuestaService
  ) {}

  ngOnInit(): void {
    this.preguntaService.obtenerPreguntas().subscribe(data => {
      this.preguntas = data;

      this.respuestas = data.map(p => ({
        pregunta: p,
        texto: null,
        foto: null
      }));
    });
  }

  // ⏭️ SIGUIENTE
  siguientePregunta(): void {
    this.respuestas[this.preguntaActual].texto = this.respuestaActual;

    // Guardar foto solo en la primera pregunta
    if (this.preguntaActual === 0 && this.foto) {
      this.respuestas[this.preguntaActual].foto = this.foto.name;
    }

    if (this.preguntaActual < this.preguntas.length - 1) {
      this.preguntaActual++;
      this.respuestaActual = this.respuestas[this.preguntaActual].texto || '';
    } else {
      this.guardarTodo();
    }
  }

  // ⏮️ ANTERIOR
  anteriorPregunta(): void {
    this.respuestas[this.preguntaActual].texto = this.respuestaActual;

    if (this.preguntaActual > 0) {
      this.preguntaActual--;
      this.respuestaActual = this.respuestas[this.preguntaActual].texto || '';
    }
  }

  // ⏩ PASAR SIN RESPONDER
  pasarSinResponder(): void {
    this.respuestas[this.preguntaActual].texto = null;
    this.siguientePregunta();
  }

  // 📸 FOTO
  onFotoSeleccionada(event: any): void {
    this.foto = event.target.files[0];
  }

  // 💾 GUARDAR TODAS LAS RESPUESTAS
  guardarTodo(): void {
    const respuestasAEnviar = this.preguntas.map(p => ({
  preguntaId: p.id!,
  usuarioId: this.usuarioId!,  // 👈 LE DICES A ANGULAR QUE ES NUMBER SIEMPRE
  texto: this.respuestas[p.id]?.texto ?? null,
  fotoUrl: this.respuestas[p.id]?.foto ?? null,
}));

    this.respuestaService.guardarRespuestas(respuestasAEnviar)
      .subscribe({
        next: () => {
          this.completado = true;
          alert("Respuestas guardadas correctamente.");
        },
        error: err => console.error(err)
      });
  }
}
