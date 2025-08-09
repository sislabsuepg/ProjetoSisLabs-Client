import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface Permissao {
  nome: string;
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
}

const usuarioStore = create<Usuario>()(
  persist(
    (set) => ({
      id: 0,
      nome: "",
      login: "",
      permissao: {
        nome: "",
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
    }),
    {
      name: "aluno-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
export { usuarioStore, alunoStore };
