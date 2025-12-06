# 🏟️ Arena Manager

## Descrição

`Arena Manager` é uma API construída com FastAPI para gerenciar arenas e quadras esportivas (ex.: vôlei, futvôlei, futsal, society). O projeto organiza funcionalidades em `routers`, `services`, `models` e `schemas`, fornecendo endpoints para usuários, autenticação, quadras, horários e reservas.

## Recursos principais

- Endpoints REST para usuários, autenticação, quadras, agenda e reservas
- Arquitetura modular com separação entre routers e services
- Integração com SQLAlchemy e Alembic para migrações de banco
- Documentação automática via Swagger UI e ReDoc

## Instalação (Windows PowerShell)

1. Clone o repositório e entre na pasta do projeto:

```powershell
git clone <repo-url>
cd arena_manager_server
```

2. Crie e ative um ambiente virtual e instale dependências:

```powershell
python -m venv env
.\env\Scripts\Activate.ps1
pip install -r requirements.txt
```

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com, pelo menos, as seguintes variáveis:

- `SQLALCHEMY_DATABASE_URL` — URL de conexão com o banco (ex.: `postgresql://user:pass@host:5432/dbname`)
- `SECRET_KEY` — chave secreta para geração de tokens
- `ALGORITHM` — algoritmo usado para tokens (ex.: `HS256`)

O arquivo `app/core/config.py` já utiliza `dotenv` para carregar essas variáveis.

## Migrações (Alembic)

O projeto já inclui configuração do Alembic em `app/alembic.ini`.

Gerar uma migration e aplicar:

```powershell
alembic -c app/alembic.ini revision --autogenerate -m "mensagem"
alembic -c app/alembic.ini upgrade head
```

> Observação: verifique se `SQLALCHEMY_DATABASE_URL` está configurada corretamente antes de rodar as migrações.

## Executando a aplicação (desenvolvimento)

Use `uvicorn` para executar a API em modo de desenvolvimento:

```powershell
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Após iniciado, a documentação estará disponível em:

- Swagger UI: `http://localhost:8000/docs`

## Endpoints principais (routers existentes)

- `user` — gestão de usuários
- `auth` — autenticação (login/token)
- `court` — CRUD de quadras/arenas
- `schedule` — gerenciamento de horários
- `reservation` — criar e consultar reservas
- `admin` — rotas administrativas

> Para ver os detalhes de cada rota, abra o Swagger UI (`/docs`) após iniciar o servidor.

## Estrutura do projeto (resumo)

- `app/` — código da aplicação (routers, models, schemas, services)
- `app/main.py` — ponto de entrada
- `app/alembic/` — migrações
- `requirements.txt` — dependências