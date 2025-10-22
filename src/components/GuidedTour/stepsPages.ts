import { StepType } from "@reactour/tour";

export const toursByPage: Record<string, StepType[]> = {
"/dashboard": [
  {
    selector: ".status-column",
    content: "O Status de acesso pode indicar o regime de uso da sala: 'com chave' significa que um aluno de mestrado/iniciação está responsável pela chave; 'sem chave' indica que a sala foi aberta para um usuário geral e a chave permanece com os laboratoristas.",
  },
  {
    selector: ".laboratorio-column",
    content: "Aqui você vê o Laboratório ao qual o aluno solicitou acesso ou está atualmente.",
  },
  {
    selector: ".aluno-column",
    content: "O nome do Aluno responsável pela solicitação ou acesso.",
  },
  {
    selector: ".data-hora-entrada-column",
    content: "Esta informação registra a Data/Hora de Entrada, ou seja, quando a solicitação foi criada ou quando o acesso foi iniciado.",
  },
  {
    selector: ".acoes-column", 
    content: "A coluna Ações contém o ícone de lixeira que é usado para encerrar o uso do laboratório.",
  },
],
  "/dashboard/perfil": [
  {
    selector: ".nome-usuario",
    content: "Aqui é exibido o nome de usuário atualmente logado no sistema.",
  },
  {
    selector: ".permissao-usuario",
    content: "Mostra o tipo de permissão ou nível de acesso que este usuário possui.",
  },
  {
    selector: ".atualizar-senha",
    content: "Neste formulário, você pode alterar a sua senha com segurança.",
  },
],
"/dashboard/alterar": [
  {
    selector: ".navigation-tabs-listas",
    content: "Estas abas permitem que você alterne entre os diferentes módulos do sistema, como listagem e cadastro de Professores, de Laboratórios ou Usuários gerais.",
  },
  {
    selector: ".search-bar-listas",
    content: "Utilize este campo para pesquisar algum usuário. Após digitar, clique no botão 'Buscar' ao lado.",
  },
  {
    selector: ".toggle-inativo",
    content: "Use este botão para Mostrar ou ocultar os usuários que estão atualmente com o status Inativo no sistema.",
  },
  {
    selector: ".add-button",
    content: "Clique neste botão para Cadastrar um novo usuário no sistema.",
  },
{
  selector: ".tabela-listas",
  content: "Esta tabela exibe a lista de itens, que pode ser de usuários, cursos ou laboratórios, dependendo da seção selecionada nas abas acima.",
}
],
"/dashboard/advertencia": [
  {
    selector: ".dropdown-academico",
    content: "Neste campo, selecione o acadêmico que receberá a advertência. A lista mostra os estudantes que possuem empréstimos ativos no momento.",
  },
  {
    selector: ".radio-advertencia",
    content: "Selecione uma opção se o motivo for a não devolução da chave de um laboratório, ou quando o acadêmico não registrou a sua saída do laboratório ou área, conforme exigido pelo sistema. Escolha 'Outro' para advertências que não se encaixam nas opções predefinidas. Esta opção libera um campo de texto adicional para descrição.",
  },
{
    selector: ".input-assunto-email", 
    content: "Neste campo, Especifique o Assunto do E-mail. Ele será usado na notificação formal enviada ao acadêmico.",
  },
  {
    selector: ".textarea-corpo-email",
    content: "Escreva o Corpo do E-mail detalhando a razão da advertência. Este texto será enviado diretamente ao aluno.",
  },
],
};
