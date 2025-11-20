import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private api = 'https://app-dc5b9476-7c25-4ae3-a9cc-09c9b50d2529.cleverapps.io/api/usuarios';

  constructor(private http: HttpClient) {}

  register(u: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.api}/register`, u);
  }

  login(username: string, password: string): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.api}/login`, { username, password });
  }

  obtenerUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.api);
  }

  agregarUsuario(u: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.api}/register`, u);
  }

  actualizarUsuario(id: number, u: Usuario) {
    return this.http.put<Usuario>(`${this.api}/${id}`, u);
  }

  eliminarUsuario(id: number) {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
