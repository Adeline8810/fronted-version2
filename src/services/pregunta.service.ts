import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pregunta } from '../models/pregunta';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PreguntaService {
  private api = 'https://app-dc5b9476-7c25-4ae3-a9cc-09c9b50d2529.cleverapps.io/api/preguntas';

  constructor(private http: HttpClient) {}

  obtenerPreguntas(): Observable<Pregunta[]> {
    return this.http.get<Pregunta[]>(this.api);
  }
}
