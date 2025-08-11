import { fullNameRegex } from '@/constants/regex';
import { createNewSchema } from '@/utils/deafult_create_schema';
import * as Yup from 'yup';

export const cadastro_academico = Yup.object().shape(
  createNewSchema({
    nome: Yup.string()
      .required('O campo "Nome" é obrigatório')
      .matches(fullNameRegex, 'O campo "Nome" deve conter nome e sobrenome'),

    ra: Yup.string()
      .min(8, 'RA inválido')
      .max(8, 'RA inválido')
      .required('O campo "RA" é obrigatório')
      .matches(/^\d+$/, 'O RA deve conter apenas números'),

    email: Yup.string()
      .email('E-mail inválido')
      .required('O campo "E-mail" é obrigatório'),

    telefone: Yup.string()
      .min(15, 'Telefone inválido')
      .required('O campo "Telefone" é obrigatório'),

    curso: Yup.string().required('O campo "Curso" é obrigatório'),

    ano: Yup.string()

      .matches(/^\d{4}$/, 'O campo "Ano" deve conter 4 dígitos')
      .required('O campo "Ano" é obrigatório'),
  }),
);
