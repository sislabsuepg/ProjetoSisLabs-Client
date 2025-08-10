import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface Permissao {
  nomePermissao: string;
  geral: boolean;
  cadastro: boolean;
  alteracao: boolean;
  relatorio: boolean;
  advertencia: boolean;
}

interface Usuario {
  id: number;
  nome: string;
  login: string;
  permissao: Permissao;
  setUsuarioId: (id: number) => void;
  setUsuarioNome: (nome: string) => void;
  setUsuarioLogin: (login: string) => void;
  setUsuarioPermissao: (permissao: Permissao) => void;
  resetUsuario: () => void;
}

interface Aluno {
  ra: string;
  nome: string;
  email: string;
  numero: string;
  nomeCurso: string;
  setAlunoRa: (ra: string) => void;
  setAlunoNome: (nome: string) => void;
  setAlunoEmail: (email: string) => void;
  setAlunoNumero: (numero: string) => void;
  setAlunoNomeCurso: (nomeCurso: string) => void;
  resetAluno: () => void;
}

const usuarioStore = create<Usuario>()(
  persist(
    (set) => ({
      id: 0,
      nome: "",
      login: "",
      permissao: {
        nomePermissao: "",
        geral: false,
        cadastro: false,
        alteracao: false,
        relatorio: false,
        advertencia: false,
      },
      setUsuarioId: (id: number) => set({ id }),
      setUsuarioNome: (nome: string) => set({ nome }),
      setUsuarioLogin: (login: string) => set({ login }),
      setUsuarioPermissao: (permissao: Permissao) => set({ permissao }),
      resetUsuario: () =>
        set({
          id: 0,
          nome: "",
          login: "",
          permissao: {
            nomePermissao: "",
            geral: false,
            cadastro: false,
            alteracao: false,
            relatorio: false,
            advertencia: false,
          },
        }),
    }),
    {
      name: "usuario-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

const alunoStore = create<Aluno>()(
  persist(
    (set) => ({
      ra: "",
      nome: "",
      email: "",
      numero: "",
      nomeCurso: "",
      setAlunoRa: (ra: string) => set({ ra }),
      setAlunoNome: (nome: string) => set({ nome }),
      setAlunoEmail: (email: string) => set({ email }),
      setAlunoNumero: (numero: string) => set({ numero }),
      setAlunoNomeCurso: (nomeCurso: string) => set({ nomeCurso }),
      resetAluno: () =>
        set({
          ra: "",
          nome: "",
          email: "",
          numero: "",
          nomeCurso: "",
        }),
    }),
    {
      name: "aluno-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
export { usuarioStore, alunoStore };
