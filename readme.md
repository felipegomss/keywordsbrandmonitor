# Documentação - Brand Monitor Dashboard

O Brand Monitor Dashboard é uma aplicação web que permite aos usuários acompanhar o desempenho das palavras-chave de sua marca em várias métricas, como cliques, impressões e CTR. A aplicação é construída utilizando o framework Next.js e o kit de design Material-UI.

## Funcionalidades Implementadas

### Dashboard

1. **Cards de Resumo de Desempenho:**
   - Cliques: Exibe o total de cliques das palavras-chave no último dia, juntamente com a porcentagem de crescimento em relação ao dia anterior e a porcentagem para bater a meta.
   - Impressões: Exibe o total de impressões das palavras-chave no último dia, juntamente com a porcentagem de crescimento em relação ao dia anterior e a porcentagem para bater a meta.
   - CTR: Exibe a taxa de cliques (CTR) das palavras-chave no último dia, juntamente com a porcentagem de crescimento em relação ao dia anterior e a porcentagem para bater a meta.

2. **Gráfico de Desempenho:**
   - Exibe um gráfico de barras mostrando as top 7 palavras-chave com base em cliques, impressões e CTR. As palavras-chave são exibidas no eixo x e as métricas no eixo y.

### Página de Palavras-Chave

1. **Tabela de Palavras-Chave:**
   - Lista todas as palavras-chave em uma tabela com colunas para Palavra-Chave, Cliques, Impressões e CTR.
   - Permite a ordenação ascendente ou descendente das palavras-chave com base nas métricas.
   - Permite o download da tabela em formato CSV.

2. **Paginação:**
   - Divide a lista de palavras-chave em páginas para facilitar a visualização e navegação.

### Página de Detalhes de Palavra-Chave

1. **Detalhes de Desempenho:**
   - Exibe detalhes do desempenho da palavra-chave selecionada, incluindo cliques, impressões e CTR nos últimos 3 dias.
   - Mostra a porcentagem de crescimento ou queda em relação ao dia anterior para cada métrica.

### Exportação para CSV

1. **Exportação da Tabela de Palavras-Chave para CSV:**
   - Permite ao usuário fazer o download da tabela de palavras-chave em formato CSV para análise externa.

## Backend em Go Lang

O backend da aplicação é desenvolvido em Go Lang e utiliza o MongoDB como banco de dados para armazenar os dados de desempenho das palavras-chave.

### Estrutura do Banco de Dados

O banco de dados possui uma coleção chamada "keyword_performance" que armazena os seguintes dados para cada palavra-chave:

- Palavra-Chave (string)
- Métricas (array de objetos contendo data, cliques, impressões, CTR e taxa de conversão)

### Passo a Passo para Configuração do Banco de Dados e Backend

1. Instale o MongoDB em sua máquina ou utilize um serviço de hospedagem de banco de dados MongoDB.

2. Clone o repositório do backend:

```
git clone [URL do Repositório do Backend]
```

3. Importe o arquivo "keywords.json" no MongoDB para preencher a coleção "keyword_performance" com dados de exemplo.

4. Acesse a pasta do backend e instale as dependências:

```
cd [Pasta do Backend]
go mod download
```

5. Inicie o servidor backend:

```
go run main.go
```

6. O servidor backend estará rodando em http://localhost:8080. Certifique-se de configurar o CORS para permitir as requisições da aplicação frontend.

## Como Executar a Aplicação Frontend

1. Clone este repositório.

2. Instale as dependências:

```
npm install
```

3. Execute a aplicação:

```
npm run dev
```

4. A aplicação frontend estará rodando em http://localhost:3000.

## Tecnologias Utilizadas

- Next.js
- Material-UI
- Axios (para fazer requisições à API)
- Go Lang (backend)
- MongoDB (banco de dados)

## Autor

Felipe Gomes

## Licença

Este projeto está licenciado sob a Licença MIT.

## Agradecimentos

Agradecemos a assistência do Assistente Virtual da OpenAI na criação da documentação e na geração do arquivo "keywords.json" para importação no banco de dados MongoDB.

---