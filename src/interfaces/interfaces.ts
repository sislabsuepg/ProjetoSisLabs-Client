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
  nome: string;
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
  laboratorio: ILaboratorio;
  dataHoraEntrada: Date;
}

export interface ApiResponse {
  data?: ICurso[];
  erros?: string[];
}