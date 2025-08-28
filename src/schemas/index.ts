import { fullNameRegex } from "@/constants/regex";
import { createNewSchema } from "@/utils/deafult_create_schema";
import * as Yup from "yup";

export const cadastro_academico = Yup.object().shape(
  createNewSchema({
    nome: Yup.string()
      .required('O campo "Nome" é obrigatório')
      .matches(fullNameRegex, 'O campo "Nome" deve conter nome e sobrenome'),

    ra: Yup.string()
      .min(8, "RA inválido")
      .max(13, "RA inválido")
      .required('O campo "RA" é obrigatório')
      .matches(/^\d+$/, "O RA deve conter apenas números"),

    email: Yup.string().optional().email("E-mail inválido"),

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
    nome: Yup.string().required('O campo "Nome" é obrigatório'),
    numero: Yup.string().required('O campo "Número" é obrigatório'),
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
      .required('O campo "Nome" é obrigatório')
      .matches(fullNameRegex, 'O campo "Nome" deve conter nome e sobrenome'),
    email: Yup.string()
      .email("E-mail inválido")
      .required('O campo "E-mail" é obrigatório'),
  })
);

export const cadastro_orientacao = Yup.object().shape({
  dataInicio: Yup.string().required('O campo "Data de início" é obrigatório'),
  dataFim: Yup.string().required('O campo "Data final" é obrigatório'),
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
    nome: Yup.string().required('O campo "Nome do curso" é obrigatório'),
    anosMaximo: Yup.number()
      .required('O campo "Quantos anos tem o curso?" é obrigatório')
      .min(1, 'O campo "Quantos anos tem o curso?" deve ser um número válido'),
  })
);
