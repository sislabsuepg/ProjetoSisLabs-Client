# Projeto SisLabs Client

Aplicacao Next.js com suporte a execucao web e desktop (Electron), mantendo as mesmas rotas e funcionalidades.

## Requisitos

- Node.js 20+
- npm 10+

## Instalacao

```bash
npm install
```

## Executar em modo Web

Desenvolvimento:

```bash
npm run dev
```

Producao:

```bash
npm run build
npm run start
```

## Executar em modo Electron

Desenvolvimento (abre janela desktop e roda o Next em modo dev internamente):

```bash
npm run electron:dev
```

Producao local (gera build do Next e abre o app desktop):

```bash
npm run electron:start
```

Gerar pacote desktop sem instalador:

```bash
npm run electron:pack
```

Gerar instalador Windows (NSIS):

```bash
npm run electron:dist
```

## Observacoes

- O app desktop carrega a mesma aplicacao Next em `/sislabs/` para manter compatibilidade com o comportamento atual.
- O preload do Electron esta em `electron/preload.cjs` com isolamento de contexto habilitado.
