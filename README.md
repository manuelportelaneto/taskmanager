# Task Manager com IA

Este projeto é um gerenciador de tarefas fullstack que incorpora funcionalidades de Inteligência Artificial para otimizar a gestão de tarefas. Ele permite aos usuários criar, organizar e gerenciar suas tarefas de forma eficiente, com o auxílio de IA para sumarização, priorização e busca semântica.

## Screenshots

![Tela de Login](docs/login.png)
_Tela de Login_

![Tela de Registro](docs/register.png)
_Tela de Registro_

![Dashboard Principal](docs/dashboard.png)
_Dashboard Principal_

## Tecnologias Utilizadas

### Backend (task-manager-api)
- **Framework:** NestJS (Node.js)
- **Linguagem:** TypeScript
- **Banco de Dados:** (Assumindo PostgreSQL ou similar, pode ser ajustado se houver mais informações)

### Frontend (task-manager-ui)
- **Framework:** React
- **Linguagem:** TypeScript
- **Estilização:** (Assumindo CSS Modules ou TailwindCSS, pode ser ajustado)

## Rodando o Projeto Localmente

Siga os passos abaixo para configurar e rodar o projeto em sua máquina local:

1.  **Clonar o repositório:**
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO>
    cd task-manager
    ```

2.  **Configurar Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz do projeto, copiando o arquivo de exemplo `.env.example`.
    ```bash
    cp .env.example .env
    ```
    Após copiar, **edite o arquivo `.env`** e preencha as variáveis com suas credenciais e chaves de API.
    
    - `POSTGRES_*`: Credenciais para o banco de dados PostgreSQL.
    - `JWT_SECRET`: Uma chave secreta para gerar tokens de autenticação.
    - `OPENAI_API_KEY`: Sua chave de API da OpenAI.

3.  **Iniciar os serviços com Docker Compose:**
    Certifique-se de ter o Docker e o Docker Compose instalados.
    ```bash
    docker compose up --build -d
    ```

    Este comando irá construir as imagens do Docker para o backend e frontend, e iniciar os contêineres em segundo plano.

4.  **Acessar as aplicações:**
    -   **Backend API:** `http://localhost:3000`
    -   **Frontend UI:** `http://localhost:5173`

## Estrutura do Projeto

-   `task-manager-api/`: Contém o código-fonte da API backend, desenvolvida com NestJS. Responsável pela lógica de negócios, persistência de dados e integração com serviços de IA.
-   `task-manager-ui/`: Contém o código-fonte da interface do usuário frontend, desenvolvida com React. Responsável pela interação do usuário e consumo da API backend.

## Funcionalidades de IA

O projeto incorpora as seguintes funcionalidades de Inteligência Artificial:

-   **Sumarização de Tarefas:** Gera resumos concisos de descrições de tarefas longas.
-   **Priorização de Tarefas:** Ajuda a priorizar tarefas com base em critérios definidos ou análise de conteúdo.
-   **Busca Semântica:** Permite buscar tarefas usando linguagem natural, entendendo o contexto e o significado por trás das palavras-chave.