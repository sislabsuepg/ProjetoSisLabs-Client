export interface ICurso {
  id: number;
  nome: string;
  anosMaximo: number;
}

export interface IAcademico {
  nome: string;
  ra: string;
  email?: string;
  telefone?: string;
  idCurso: number;
  anoCurso: number;
  senha: string;
}
