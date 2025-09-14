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