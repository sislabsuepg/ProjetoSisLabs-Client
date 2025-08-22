export interface FormAcademico {
  id: string;
  ra: string;
  nome: string;
  email: string;
  telefone: string;
  curso: string;
  ano: string;
}

export interface FormProfessor {
  id: string;
  nome: string;
  email: string;
}

export interface FormLaboratorio {
  id: string;
  nome: string;
  numero: string;
  restrito: boolean;
}

export interface FormOrientacao {
  id: string;
  aluno: string;
  professor: string;
  laboratorio: string;
  data_inicio: string;
  data_fim: string;
}

export type IData =
  | FormAcademico
  | FormProfessor
  | FormLaboratorio
  | FormOrientacao;
