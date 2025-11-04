import { StepType } from "@reactour/tour";

export const toursByPage: Record<string, StepType[] | Record<string, StepType[]>> = {
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
 "/dashboard/agenda": [
    {
      selector: ".add-evento-button",
      content:
        "Clique neste botão para cadastrar um novo evento, como palestras, defesas, treinamentos ou reuniões do laboratório.",
    },
    {
    selector: ".add-recado-button",
    content:
      "Clique aqui para adicionar um novo recado. Essa função permite que você publique comunicados, lembretes ou avisos que serão exibidos a todos os usuários do sistema.",
  },
  ],
  "/dashboard/emprestimo": {
    chave: [
      {
        selector: ".EntregaChave-button",
        content: "Clique neste botão para registrar a entrega de chaves aos alunos.",
      },
      {
        selector: "#ra",
        content: "Digite aqui o RA do aluno.",
      },
      {
        selector: "#senha",
        content: "Digite a senha do aluno para validar seu acesso.",
      },
      {
        selector: "#lab-select",
        content:
          "Selecione o laboratório que será utilizado pelo aluno. Essa seleção só é habilitada após a validação do RA e senha.",
      },
    ],
    pesquisa: [
      {
        selector: ".LabPesquisa-button",
        content:
          "Clique aqui para registrar o empréstimo de laboratórios para pesquisas acadêmicas.",
      },
      {
        selector: ".ra-guia",
        content: "Digite o RA do aluno.",
      },
      {
        selector: ".senha-guia",
        content: "Digite a senha do aluno para validar seu acesso.",
      },
      {
        selector: ".lab-select-guia",
        content: "Selecione o laboratório disponível para pesquisa. Só é possível selecionar após validar o aluno.",
      },

    ],
  },
  "/dashboard/relatorios": {
    laboratorio: [
      {
        selector: ".lab-relatorio-button",
        content: "Clique neste botão para gerar relatório dos laboratórios.",
      },
      {
        selector: ".tipo-entrada",
        content: "Aqui você escolhe o *tipo de entrada* que deseja incluir no relatório. Pode ser 'Empréstimo de chave', 'Orientação/Pesquisa' ou 'Ambos', conforme o tipo de uso do laboratório.",
      },
      {
        selector: ".lab-escolher",
        content: "Selecione o *laboratório* que deseja incluir no relatório.",
      },
      {
        selector: ".data-inicio",
        content:
          "Informe a *data inicial* para filtrar os registros. O relatório mostrará apenas as entradas a partir dessa data.",
      },
      {
        selector: ".data-final",
        content:
          "Informe a *data final* do período desejado. Apenas os registros até essa data serão exibidos.",
      },
    ],
    academico: [
      {
        selector: ".academico-relatorio-button",
        content:
          "Clique neste botão para gerar relatório dos acadêmicos.",
      },
      {
        selector: ".ra-aluno",
        content: "Digite o RA do aluno para incluir no relatório.",
      },
    ],
    curso: [
      {
        selector: ".curso-relatorio-button",
        content:
          "Clique neste botão para gerar relatório dos acadêmicos por curso.",
      },
      {
        selector: ".escolher-curso",
        content: "Escolha o curso para incluir no relatório.",
      },
    ],
  },
   "/dashboard/registros": [
     {
    selector: ".usuario-filtro",
    content:
      "Aqui você pode selecionar um *usuário específico* para visualizar apenas as ações realizadas por ele. Caso não selecione, serão exibidos os registros de todos os usuários.",
  },
  {
    selector: ".data-inicio",
    content:
      "Defina a *data inicial* do período que deseja consultar. O sistema listará apenas os registros a partir dessa data.",
  },
  {
    selector: ".data-final",
    content:
      "Defina a *data final* do período desejado. Assim, você limita os resultados até essa data.",
  },
  {
    selector: ".botao-buscar",
    content:
      "Clique em *Buscar* para aplicar os filtros e visualizar os registros de acordo com o usuário e o período selecionados.",
  },
  {
    selector: ".botao-limpar",
    content:
      "Use o botão *Limpar* para remover todos os filtros e exibir novamente todos os registros do sistema.",
  },
  {
    selector: ".tabela-registros",
    content:
      "Nesta tabela são exibidos os registros do sistema. Cada linha mostra o *login do usuário*, *nome*, *data/hora da ação* e uma *descrição detalhada* do que foi feito (como criação, remoção ou alteração de dados).",
  },
  ],
  "/login": [
    {
    selector: "body",
    content:
      "Bem-vindo(a) ao *SisLabs*! 👋 Este é o sistema de controle e gerenciamento dos laboratórios do DEINFO. Aqui você realiza o acesso de acordo com o seu perfil.",
  },
 {
    selector: ".input-login",
    content:
      "No campo *Login*, insira o seu identificador de acesso:\n\n• Se você é ACADÊMICO, digite o seu **RA**.\n• Se você é LABORATORISTA ou ADMINISTRADOR, digite o seu **nome de usuário** cadastrado no sistema.",
  },
  {
    selector: ".input-senha",
    content:
      "Insira sua *senha pessoal* associada ao seu login.",
  },
  {
    selector: ".botao-entrar",
    content:
      "Após preencher os campos de login e senha, clique em *Entrar* para acessar o sistema SisLabs.",
  },
  ],
  "/academico": [
    {
    selector: ".perfil-header",
    content:
      "👋 Bem-vindo(a) à sua área acadêmica!\n\nAqui você pode visualizar e atualizar suas informações, alterar sua senha e solicitar o uso dos laboratórios do DEINFO.",
  },
  {
    selector: ".editar-perfil-section",
    content:
      "Atualize seus dados pessoais, como e-mail e telefone, para manter suas informações sempre atualizadas.\n\nApós realizar as alterações, clique em **'Atualizar perfil'** para salvar.",
  },
  {
    selector: ".alterar-senha-section",
    content:
      "Por segurança, você pode trocar sua senha de acesso.\n\nInforme sua senha atual, digite a nova senha e confirme antes de clicar em **'Atualizar senha'**.",
  },
  {
    selector: ".solicitar-sala-section",
    content:
      "Aqui você pode solicitar o uso de um dos laboratórios disponíveis.\n\n1️⃣ Selecione o laboratório desejado no menu.\n2️⃣ Clique em **'Solicitar sala'** para enviar o pedido.\n3️⃣ Aguarde a confirmação do setor responsável.",
  },
  {
    selector: ".perfil-info-card",
    content:
      "Nesta seção você vê seus dados cadastrados: nome, RA, curso e e-mail.\n\nTambém pode conferir o horário do seu último login no sistema.",
  },
  {
    selector: ".logout-button",
    content:
      "Ao terminar o uso do sistema, clique em **'Sair'** para encerrar sua sessão com segurança — especialmente em computadores compartilhados.",
  },
  ],
  "/dashboard/cronograma": [
  {
    selector: ".aulas-hoje-section",
    content: "Nesta seção você visualiza as aulas agendadas para o dia atual. Caso não haja aulas, será exibida uma mensagem informando isso.",
  },
  {
    selector: ".contador-aulas",
    content: "Este indicador mostra a quantidade total de aulas cadastradas para o dia em questão.",
  },
  {
    selector: ".lab-select",
    content: "Use este seletor para alternar entre os diferentes laboratórios ou salas, visualizando o cronograma específico de cada um.",
  },
  {
    selector: "#tabela-cronograma",
    content: "Esta tabela exibe os horários de aula, os dias da semana e os respectivos professores cadastrados para cada horário.",
  },

],
};
