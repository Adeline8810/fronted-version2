import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Respuesta } from '../models/respuesta';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RespuestaService {
  private api = 'http://localhost:8080/api/respuestas';

  constructor(private http: HttpClient) {}

  guardarRespuestas(respuestas: Respuesta[]): Observable<Respuesta[]> {
    return this.http.post<Respuesta[]>(this.api, respuestas);
  }

 subirFoto(file: File): Observable<string> {
  const fd = new FormData();
  fd.append('file', file);

return this.http.post(`${this.api}/upload`, fd, {
  responseType: 'text' as 'text'
});

}
}
