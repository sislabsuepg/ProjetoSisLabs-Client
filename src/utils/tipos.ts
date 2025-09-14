export interface ApiError {
  response?: {
    data?: {
      erros?: string[];
    };
  };
  message?: string;
}

export interface Curso {
  id: number;
  nome: string;
  anosMaximo: number;
  ativo: boolean;
}

export interface Aluno {
  id: number;
  ra: string;
  nome: string;
  idCurso: number;
}

export interface Laboratorio {
  id: number;
  nome: string;
  numero: string;
}