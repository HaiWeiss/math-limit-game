export interface Question {
  tipo: "funcion" | "imagen"; 
  funcion?: string;             
  imagenUrl?: string;           
  punto?: string;             
  lado?: "+" | "-" | "";        
  pregunta: string;
  respuestas: string[];
  respuestaCorrecta: string;
}