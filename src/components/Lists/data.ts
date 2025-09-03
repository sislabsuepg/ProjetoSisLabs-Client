import { IData } from "./types";

export const placeholderMap: Record<number, string> = {
  1: "Pesquisar acadêmico",
  2: "Pesquisar professor",
  3: "Pesquisar laboratório",
  4: "Pesquisar orientação/mestrado",
  5: "Pesquisar curso",
  6: "Pesquisar permissão",
  7: "Pesquisar usuário",
};

/**
 *   | FormAcademico
   | FormProfessor
   | FormLaboratorio
   | FormOrientacao
   | FormCurso
   | FormPermissao
   | FormUsuario;
 */

export const formMap: Record<number, IData> = {
  1: {
    id: 0,
    ra: "",
    nome: "",
    telefone: "",
    email: "",
    idCurso: 0,
    anoCurso: 0,
  }, // Acadêmico
  2: { id: 0, nome: "", email: "" }, // Professor
  3: { id: 0, nome: "", numero: "", restrito: false }, // Laboratório
  4: {
    id: 0,
    idAluno: 0,
    idProfessor: 0,
    idLaboratorio: 0,
    dataInicio: "",
    dataFim: "",
  }, // Orientação/Mestrado
  5: { id: 0, nome: "", anosMax: 0 }, // Curso
  6: {
    id: 0,
    nomePermissao: "",
    geral: false,
    cadastro: false,
    alteracao: false,
    relatorio: false,
    advertencia: false,
  }, // Permissão
  7: {
    id: 0,
    nome: "",
    login: "",
    senha: "",
    ativo: false,
    idPermissao: 0,
  }, // Usuário
};
