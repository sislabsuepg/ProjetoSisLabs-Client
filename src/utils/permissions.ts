import { Cookies } from "react-cookie";

/**
 * Helper para verificar permissões do usuário armazenadas em cookies.
 * Estrutura esperada: cookies.usuario.permissao.{geral,cadastro,alteracao,advertencia,relatorio}
 */
export interface UserPermissions {
  geral?: boolean;
  cadastro?: boolean;
  alteracao?: boolean;
  advertencia?: boolean;
  relatorio?: boolean;
}

interface CookiesLike {
  [key: string]: unknown;
  usuario?: {
    permissao?: UserPermissions;
    [k: string]: unknown;
  };
}

export function getUserPermissions(cookiesObj?: CookiesLike): UserPermissions {
  try {
    if (cookiesObj?.usuario?.permissao)
      return cookiesObj.usuario.permissao as UserPermissions;
    const cookies = new Cookies();
    const user = cookies.get("usuario");
    return (user?.permissao || {}) as UserPermissions;
  } catch {
    return {};
  }
}

export function hasPermission(
  perm: keyof UserPermissions,
  cookiesObj?: CookiesLike
): boolean {
  const p = getUserPermissions(cookiesObj);
  return p.geral === true || p[perm] === true;
}

export function canAny(
  perms: (keyof UserPermissions)[],
  cookiesObj?: CookiesLike
): boolean {
  const p = getUserPermissions(cookiesObj);
  if (p.geral) return true;
  return perms.some((perm) => p[perm]);
}

// Definição de páginas e ações específicas
type PageKey =
  | "cadastro"
  | "alterar"
  | "relatorios"
  | "advertencia"
  | "emprestimo"
  | "registros"
  | "cronograma"
  | "agenda"
  | "dashboard";

// Regras de acesso por página conforme requisitos
const pageRules: Record<PageKey, (p: UserPermissions) => boolean> = {
  dashboard: () => true, // início sempre acessível para usuários autenticados
  cadastro: (p) => !!p.geral || !!p.cadastro,
  alterar: (p) => !!p.geral || !!p.alteracao,
  relatorios: (p) => !!p.relatorio,
  advertencia: (p) => !!p.advertencia,
  emprestimo: (p) => !!p.geral || !!p.cadastro,
  registros: (p) => !!p.geral,
  cronograma: () => true, // livre
  agenda: () => true, // livre
};

// Ações internas (exemplos) - podem ser expandidas conforme necessário
type ActionKey =
  | "aprovar-emprestimo"
  | "recusar-emprestimo"
  | "encerrar-emprestimo"
  | "emitir-advertencia"
  | "gerar-relatorio"
  | "criar-usuario"
  | "editar-usuario"
  | "criar-permissao"
  | "editar-permissao"
  | "acessar-registros";

const actionRules: Record<ActionKey, (p: UserPermissions) => boolean> = {
  "aprovar-emprestimo": (p) => !!p.geral || !!p.cadastro,
  "recusar-emprestimo": (p) => !!p.geral || !!p.cadastro,
  "encerrar-emprestimo": (p) => !!p.geral || !!p.cadastro,
  "emitir-advertencia": (p) => !!p.advertencia,
  "gerar-relatorio": (p) => !!p.relatorio,
  "criar-usuario": (p) => !!p.geral,
  "editar-usuario": (p) => !!p.geral || !!p.alteracao,
  "criar-permissao": (p) => !!p.geral,
  "editar-permissao": (p) => !!p.geral || !!p.alteracao,
  "acessar-registros": (p) => !!p.geral,
};

export function canAccessPage(
  page: PageKey,
  cookiesObj?: CookiesLike
): boolean {
  const p = getUserPermissions(cookiesObj);
  const rule = pageRules[page];
  return rule ? rule(p) : false;
}

export function canExecuteAction(
  action: ActionKey,
  cookiesObj?: CookiesLike
): boolean {
  const p = getUserPermissions(cookiesObj);
  const rule = actionRules[action];
  return rule ? rule(p) : false;
}
