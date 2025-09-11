export interface FormAcademico {
  id: number;
  ra: string;
  nome: string;
  email: string;
  telefone?: string;
  idCurso: number;
  anoCurso: number;
  curso?: FormCurso; 
  ativo?: boolean;
}

export interface FormProfessor {
  id: number;
  nome: string;
  email: string;
  ativo?: boolean;
}

export interface FormLaboratorio {
  id: number;
  nome: string;
  numero: string;
  restrito: boolean;
  ativo?: boolean;
}

export interface FormOrientacao {
  id: number;
  idAluno: number;
  idProfessor: number;
  idLaboratorio: number;
  dataInicio: string;
  dataFim: string;
  laboratorio?: FormLaboratorio;
  aluno?: FormAcademico;
  professor?: FormProfessor;
}

export interface FormCurso {
  id: number;
  nome: string;
  anosMaximo: number;
  ativo?: boolean;
}

export interface FormPermissao {
  id: number;
  nomePermissao: string;
  geral?: boolean;
  cadastro?: boolean;
  alteracao?: boolean;
  relatorio?: boolean;
  advertencia?: boolean;
  ativo?: boolean;
}

export interface FormUsuario {
  id: number;
  nome: string;
  login: string;
  senha: string;
  ativo?: boolean;
  idPermissao: number;
  permissaoUsuario?: FormPermissao;
}

export interface IRecado {
  id: number;
  texto: string;
}

export interface IEvento {
  id: number;
  nome: string;
  data: Date;
  duracao: number;
  responsavel: string;
  idLaboratorio: number;
}

export type IData =
  | FormAcademico
  | FormProfessor
  | FormLaboratorio
  | FormOrientacao
  | FormCurso
  | FormPermissao
  | FormUsuario;
