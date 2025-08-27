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
    nome: Yup.string().required('O campo "Nome da permissão" é obrigatório'),
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
  data_inicio: Yup.string().required('O campo "Data de início" é obrigatório'),
  data_fim: Yup.string().required('O campo "Data final" é obrigatório'),
  aluno: Yup.string().required('O campo "Aluno" é obrigatório'),
  professor: Yup.string().required('O campo "Professor" é obrigatório'),
  laboratorio: Yup.string().required('O campo "Laboratório" é obrigatório'),
});

export const cadastro_curso = Yup.object().shape(
  createNewSchema({
    nome: Yup.string().required('O campo "Nome do curso" é obrigatório'),
    anos: Yup.string().required(
      'O campo "Quantos anos tem o curso?" é obrigatório'
    ),
  })
);
