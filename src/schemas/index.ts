import { fullNameRegex } from "@/constants/regex";
import { createNewSchema } from "@/utils/deafult_create_schema";
import * as Yup from "yup";

export const cadastro_academico = Yup.object().shape(
  createNewSchema({
    nome: Yup.string()
      .required('O campo "Nome" é obrigatório')
      .max(40, 'O campo "Nome" deve ter no máximo 40 caracteres')
      .matches(fullNameRegex, 'O campo "Nome" deve conter nome e sobrenome'),

    ra: Yup.string()
      .min(8, "RA inválido")
      .max(13, "RA inválido")
      .required('O campo "RA" é obrigatório')
      .matches(/^\d+$/, "O RA deve conter apenas números"),

    email: Yup.string()
      .optional()
      .max(40, "O campo 'E-mail' deve ter no máximo 40 caracteres")
      .email("E-mail inválido"),

    telefone: Yup.string()
      .optional()
      .test("O telefone deve ter no mínimo 11 dígitos", (value) => {
        if (!value || value.trim() === "") return true;
        return value.length >= 11;
      }),
    idCurso: Yup.number()
      .required('O campo "Curso" é obrigatório')
      .min(1, 'O campo "Curso" deve ser um número válido'),

    anoCurso: Yup.number()
      .required('O campo "Ano/Série" é obrigatório')
      .min(1, 'O campo "Ano/Série" deve ser um número válido'),

    senha: Yup.string()
      .required('O campo "Senha" é obrigatório')
      .min(4, "A senha deve ter pelo menos 4 caracteres")
      .max(6, "A senha deve ter no máximo 6 caracteres")
      .test("A senha deve conter apenas números", (value) => {
        if (!value || value.trim() === "") return false;
        return /^\d+$/.test(value);
      }),
  })
);

export const cadastro_laboratorio = Yup.object().shape(
  createNewSchema({
    nome: Yup.string()
      .max(60, 'O campo "Nome" deve ter no máximo 60 caracteres')
      .required('O campo "Nome" é obrigatório'),
    numero: Yup.string()
      .max(8, 'O campo "Número" deve ter no máximo 8 caracteres')
      .required('O campo "Número" é obrigatório'),
  })
);

export const cadastro_permissao = Yup.object().shape(
  createNewSchema({
    nomePermissao: Yup.string().required(
      'O campo "Nome da permissão" é obrigatório'
    ),
  })
);

export const cadastro_professor = Yup.object().shape(
  createNewSchema({
    nome: Yup.string()
      .max(40, 'O campo "Nome" deve ter no máximo 40 caracteres')
      .required('O campo "Nome" é obrigatório')
      .matches(fullNameRegex, 'O campo "Nome" deve conter nome e sobrenome'),
    email: Yup.string()
      .max(40, "O campo 'E-mail' deve ter no máximo 40 caracteres")
      .email("E-mail inválido")
      .required('O campo "E-mail" é obrigatório'),
  })
);

export const cadastro_orientacao = Yup.object().shape({
  dataInicio: Yup.string()
    .test("Data de início deve ser uma data válida", (value) => {
      const date = new Date(String(value));
      return !isNaN(date.getTime());
    })
    .test(
      "data-inicio",
      "Data de inicio deve ser anterior a data de fim",
      (value, context) => {
        const dataInicio = new Date(String(value));
        const dataFim = new Date(String(context.parent.dataFim));
        return dataInicio < dataFim;
      }
    )
    .required('O campo "Data de início" é obrigatório'),
  dataFim: Yup.string()
    .test("data-fim", "Data final deve ser uma data válida", (value) => {
      const date = new Date(String(value));
      return !isNaN(date.getTime());
    })
    .required('O campo "Data final" é obrigatório'),
  idAluno: Yup.number()
    .min(1, "O campo 'Aluno' deve ser um número válido")
    .required('O campo "Aluno" é obrigatório'),
  idProfessor: Yup.number()
    .min(1, "O campo 'Professor' deve ser um número válido")
    .required('O campo "Professor" é obrigatório'),
  idLaboratorio: Yup.number()
    .min(1, "O campo 'Laboratório' deve ser um número válido")
    .required('O campo "Laboratório" é obrigatório'),
});

export const cadastro_curso = Yup.object().shape(
  createNewSchema({
    nome: Yup.string()
      .max(35, 'O campo "Nome do curso" deve ter no máximo 35 caracteres')
      .required('O campo "Nome do curso" é obrigatório'),
    anosMaximo: Yup.number()
      .required('O campo "Quantos anos tem o curso?" é obrigatório')
      .min(
        1,
        'O campo "Quantos anos tem o curso?" deve ser um número maior que 0'
      )
      .max(
        8,
        'O campo "Quantos anos tem o curso?" deve ser um número menor que 9'
      ),
  })
);

export const cadastro_usuario = Yup.object().shape(
  createNewSchema({
    nome: Yup.string()
      .max(40, 'O campo "Nome" deve ter no máximo 40 caracteres')
      .required('O campo "Nome" é obrigatório')
      .matches(fullNameRegex, 'O campo "Nome" deve conter nome e sobrenome'),
    login: Yup.string()
      .max(20, 'O campo "Login" deve ter no máximo 20 caracteres')
      .required('O campo "Login" é obrigatório'),
    senha: Yup.string()
      .required('O campo "Senha" é obrigatório')
      .min(6, "A senha deve ter pelo menos 6 caracteres")
      .max(12, "A senha deve ter no máximo 12 caracteres"),
    idPermissao: Yup.number()
      .required('O campo "Permissão" é obrigatório')
      .min(1, 'O campo "Permissão" deve ser um número válido'),
  })
);

// FUNÇÕES DE VALIDAÇÃO DE FORMULÁRIOS DE EDIÇÃO
export const edicao_academico = Yup.object().shape(
  createNewSchema({
    nome: Yup.string()
      .required('O campo "Nome" é obrigatório')
      .max(40, 'O campo "Nome" deve ter no máximo 40 caracteres')
      .matches(fullNameRegex, 'O campo "Nome" deve conter nome e sobrenome'),

    email: Yup.string()
      .optional()
      .max(40, "O campo 'E-mail' deve ter no máximo 40 caracteres")
      .email("E-mail inválido"),

    telefone: Yup.string()
      .optional()
      .test("O telefone deve ter no mínimo 11 dígitos", (value) => {
        if (!value || value.trim() === "") return true;
        return value.length >= 11;
      }),
    idCurso: Yup.number()
      .required('O campo "Curso" é obrigatório')
      .min(1, 'O campo "Curso" deve ser um número válido'),

    anoCurso: Yup.number()
      .required('O campo "Ano/Série" é obrigatório')
      .min(1, 'O campo "Ano/Série" deve ser um número válido'),
  })
);

export const edicao_laboratorio = Yup.object().shape(
  createNewSchema({
    nome: Yup.string()
      .max(60, 'O campo "Nome" deve ter no máximo 60 caracteres')
      .required('O campo "Nome" é obrigatório'),
    numero: Yup.string()
      .max(8, 'O campo "Número" deve ter no máximo 8 caracteres')
      .required('O campo "Número" é obrigatório'),
  })
);

export const edicao_permissao = Yup.object().shape(
  createNewSchema({
    nomePermissao: Yup.string().required(
      'O campo "Nome da permissão" é obrigatório'
    ),
  })
);

export const edicao_professor = Yup.object().shape(
  createNewSchema({
    nome: Yup.string()
      .max(40, 'O campo "Nome" deve ter no máximo 40 caracteres')
      .required('O campo "Nome" é obrigatório')
      .matches(fullNameRegex, 'O campo "Nome" deve conter nome e sobrenome'),
    email: Yup.string()
      .max(40, "O campo 'E-mail' deve ter no máximo 40 caracteres")
      .email("E-mail inválido")
      .required('O campo "E-mail" é obrigatório'),
  })
);

export const edicao_orientacao = Yup.object().shape({
  dataInicio: Yup.string()
    .test("Data de início deve ser uma data válida", (value) => {
      const date = new Date(String(value));
      return !isNaN(date.getTime());
    })
    .test(
      "data-inicio",
      "Data de inicio deve ser anterior a data de fim",
      (value, context) => {
        const dataInicio = new Date(String(value));
        const dataFim = new Date(String(context.parent.dataFim));
        return dataInicio < dataFim;
      }
    )
    .required('O campo "Data de início" é obrigatório'),
  dataFim: Yup.string()
    .test("data-fim", "Data final deve ser uma data válida", (value) => {
      const date = new Date(String(value));
      return !isNaN(date.getTime());
    })
    .required('O campo "Data final" é obrigatório'),
});

export const edicao_curso = Yup.object().shape(
  createNewSchema({
    nome: Yup.string()
      .max(35, 'O campo "Nome do curso" deve ter no máximo 35 caracteres')
      .required('O campo "Nome do curso" é obrigatório'),
    anosMaximo: Yup.number()
      .required('O campo "Quantos anos tem o curso?" é obrigatório')
      .min(
        1,
        'O campo "Quantos anos tem o curso?" deve ser um número maior que 0'
      )
      .max(
        8,
        'O campo "Quantos anos tem o curso?" deve ser um número menor que 9'
      ),
  })
);

export const edicao_usuario = Yup.object().shape(
  createNewSchema({
    nome: Yup.string()
      .max(40, 'O campo "Nome" deve ter no máximo 40 caracteres')
      .required('O campo "Nome" é obrigatório')
      .matches(fullNameRegex, 'O campo "Nome" deve conter nome e sobrenome'),
    idPermissao: Yup.number()
      .required('O campo "Permissão" é obrigatório')
      .min(1, 'O campo "Permissão" deve ser um número válido'),
  })
);
