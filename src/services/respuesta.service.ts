import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Respuesta } from '../models/respuesta';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RespuestaService {
  //private api = 'https://app-dc5b9476-7c25-4ae3-a9cc-09c9b50d2529.cleverapps.io/api/respuestas';
 //private api = 'http://localhost:8080/api/respuestas';
    // private api = 'https://backend-cloudv2-production-1443.up.railway.app/api/respuestas';
private api = 'https://backend-cloudv2-production-1443.up.railway.app/api/preguntas';
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
