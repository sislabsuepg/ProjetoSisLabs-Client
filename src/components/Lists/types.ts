export interface FormAcademico {
  id: string;
  ra: string;
  nome: string;
  email: string;
  telefone?: string;
  curso: FormCurso;
  anoCurso: number;
}

export interface FormProfessor {
  id: number;
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

export interface FormCurso{
  id: number;
  nome: string;
  anosMax: number;
}

export type IData =
  | FormAcademico
  | FormProfessor
  | FormLaboratorio
  | FormOrientacao;

