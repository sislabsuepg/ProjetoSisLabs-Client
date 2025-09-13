import { IData } from "@/components/Lists/types";

export interface ICurso {
  id?: number;
  nome: string;
  anosMaximo: number;
}

export interface IAcademico {
  id?: number;
  nome: string;
  ra: string;
  email?: string;
  telefone?: string;
  idCurso: number;
  anoCurso: number;
  senha?: string;
  curso?: ICurso;
}

export interface IProfessor {
  id?: number;
  nome: string;
  email: string;
}

export interface ILaboratorio {
  id?: number;
  nome: string;
  numero: string;
  restrito: boolean;
}

export interface IPermissao {
  id?: number;
  nomePermissao: string;
  geral?: boolean;
  cadastro?: boolean;
  alteracao?: boolean;
  advertencia?: boolean;
  relatorio?: boolean;
}

export interface IOrientacao {
  id?: number;
  idAluno: number;
  idProfessor: number;
  idLaboratorio: number;
  dataInicio: Date;
  dataFim: Date;
  laboratorio?: ILaboratorio;
  professor?: IProfessor;
  aluno?: IAcademico;
}

export interface IUsuario {
  id?: number;
  nome: string;
  login: string;
  senha?: string;
  ativo?: boolean;
  permissaoUsuario?: IPermissao;
}

export interface IEmprestimo {
  id?: number;
  aluno: IAcademico;
  posseChave: boolean;
  laboratorio: ILaboratorio;
  dataHoraEntrada: Date;
}

export interface IHorario {
  id?: number;
  horario: string;
  diaSemana: number;
  idProfessor?: number;
  idLaboratorio?: number;
  professor?: IProfessor;
  laboratorio?: ILaboratorio;
}

export interface ApiResponse {
  data?: IData | IData[] | ({ [key: string]: IData[] } & { total: number });
  erros?: string[];
}
