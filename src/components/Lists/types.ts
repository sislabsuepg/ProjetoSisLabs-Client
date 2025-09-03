export interface FormAcademico {
  id: number;
  ra: string;
  nome: string;
  email: string;
  telefone?: string;
  idCurso: number;
  anoCurso: number;
}

export interface FormProfessor {
  id: number;
  nome: string;
  email: string;
}

export interface FormLaboratorio {
  id: number;
  nome: string;
  numero: string;
  restrito: boolean;
}

export interface FormOrientacao {
  id: number;
  idAluno: number;
  idProfessor: number;
  idLaboratorio: number;
  data_inicio: string;
  data_fim: string;
}

export interface FormCurso {
  id: number;
  nome: string;
  anosMax: number;
}

export interface FormPermissao {
  id: number;
  nomePermissao: string;
  geral?: boolean;
  cadastro?: boolean;
  alteracao?: boolean;
  relatorio?: boolean;
  advertencia?: boolean;
}

export interface FormUsuario {
  id: number;
  nome: string;
  login: string;
  senha: string;
  ativo?: boolean;
  idPermissao: number;
}

export type IData =
  | FormAcademico
  | FormProfessor
  | FormLaboratorio
  | FormOrientacao
  | FormCurso
  | FormPermissao
  | FormUsuario;
