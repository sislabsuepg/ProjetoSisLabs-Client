import { ILaboratorio } from "@/interfaces/interfaces";

export interface FormAcademicoType {
  id: number;
  ra: string;
  nome: string;
  email: string;
  telefone?: string;
  idCurso: number;
  anoCurso: number;
  curso?: FormCursoType;
  ativo?: boolean;
}

export interface FormProfessorType {
  id: number;
  nome: string;
  email: string;
  ativo?: boolean;
}

export interface FormLaboratorioType {
  id: number;
  nome: string;
  numero: string;
  restrito: boolean;
  ativo?: boolean;
}

export interface FormOrientacaoType {
  id: number;
  idAluno: number;
  idProfessor: number;
  idLaboratorio: number;
  dataInicio: string;
  dataFim: string;
  laboratorio?: FormLaboratorioType;
  aluno?: FormAcademicoType;
  professor?: FormProfessorType;
}

export interface FormCursoType {
  id: number;
  nome: string;
  anosMaximo: number;
  ativo?: boolean;
}

export interface FormPermissaoType {
  id: number;
  nomePermissao: string;
  geral?: boolean;
  cadastro?: boolean;
  alteracao?: boolean;
  relatorio?: boolean;
  advertencia?: boolean;
  ativo?: boolean;
}

export interface FormUsuarioType {
  id: number;
  nome: string;
  login: string;
  senha: string;
  ativo?: boolean;
  idPermissao: number;
  permissaoUsuario?: FormPermissaoType;
}

export interface ILog {
  id: number;
  idUsuario: number;
  dataHora: Date;
  descricao: string;
}

export interface ApiResponse<T> {
  data: T;
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
  laboratorio?: ILaboratorio;
}

export type IData =
  | FormAcademicoType
  | FormProfessorType
  | FormLaboratorioType
  | FormOrientacaoType
  | FormCursoType
  | FormPermissaoType
  | FormUsuarioType;
