export interface Respuesta {
  preguntaId: number;
  usuarioId: number;
  texto: string | null;
  fotoUrl: string | null;   // ✅ ESTA ES LA PROPIEDAD CORRECTA
}



