# Brain Agriculture API

API REST para gestão de produtores, propriedades rurais, safras e culturas plantadas.

Construída com **NestJS**, **TypeScript**, **TypeORM** e **PostgreSQL**, a aplicação prioriza um domínio normalizado, integridade referencial e operações reproduzíveis por migrations.

[![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tests](https://img.shields.io/badge/tests-Jest-C21325?logo=jest&logoColor=white)](https://jestjs.io/)

## Início rápido

### 1. Instale as dependências

```bash
yarn install
```

### 2. Suba o PostgreSQL

```bash
docker compose -f .docker/docker-compose.yaml up -d
```

### 3. Configure o ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
NODE_ENV=development
DATABASE_URL=postgresql://postgres:brain-ag@localhost:5432/brainagDB
PORT=3001
```

### 4. Crie o schema e os dados de teste

```bash
yarn seed
```

O comando aplica migrations pendentes e popula o banco com dados idempotentes.

### 5. Inicie a API

```bash
yarn start:dev
```

Acesse:

- API: `http://localhost:3001/api`;
- Swagger: `http://localhost:3001/docs`.

## Arquitetura do domínio

```mermaid
erDiagram
    CUSTOMER ||--o{ ENTITY : owns
    ENTITY ||--o{ CROP_SEASON : has
    CROP_SEASON ||--o{ CROP_SEASON_CROP : contains
    CROP ||--o{ CROP_SEASON_CROP : planted_in
    ENTITY }o--o| ADDRESS : located_at

    CUSTOMER {
        uuid id PK
        string document UK
        string name
        string email UK
    }
    ENTITY {
        uuid id PK
        uuid customer_id FK
        uuid address_id FK
        string name
        decimal total_area
        decimal agriculture_area
        decimal vegetation_area
    }
    CROP_SEASON {
        uuid id PK
        uuid entity_id FK
        string year UK
    }
    CROP_SEASON_CROP {
        uuid id PK
        uuid crop_season_id FK
        uuid crop_id FK
        decimal planted_area
    }
    CROP {
        uuid id PK
        string name UK
    }
    ADDRESS {
        uuid id PK
        string city
        string state
    }
```

### Regras essenciais

- Um Customer pode possuir várias fazendas; cada fazenda pertence a um único Customer.
- Uma fazenda pode possuir várias safras.
- `CropSeason.year` representa o ano no formato `YYYY`.
- `entity_id + year` é único dentro de `crop_seasons`.
- Uma safra pode utilizar várias culturas.
- `CropSeasonCrop` representa a associação entre safra e cultura.
- `crop_season_id + crop_id` é único.
- `planted_area` pertence à associação, não à cultura.
- A soma das plantações de uma safra não pode ultrapassar a `agriculture_area` da fazenda.

### Integridade referencial

- Customer → Farm: `ON DELETE CASCADE`.
- Farm → CropSeason: `ON DELETE CASCADE`.
- CropSeason → CropSeasonCrop: `ON DELETE CASCADE`.
- Crop não exclui safras automaticamente.
- Culturas em uso não podem ser removidas pelo service.
- `synchronize` está desabilitado; alterações de schema devem passar por migrations.

## Organização do projeto

```text
src/
├── address/                  Endereços
├── customers/                Produtores
├── entities/                 Fazendas / propriedades
├── crops/                    Catálogo de culturas
├── crop_seasons/             Safras por fazenda
├── crop_season_crops/        Culturas plantadas por safra
├── dashboard/                Indicadores agregados
└── database/
    ├── data-source.ts
    ├── migrations/
    └── seeds/seed.ts
```

Cada módulo segue a estrutura NestJS de controller, service, DTOs, entidades e testes.

## Banco de dados

O PostgreSQL local está definido em [.docker/docker-compose.yaml](.docker/docker-compose.yaml).

### Operações Docker

```bash
# Subir o banco
docker compose -f .docker/docker-compose.yaml up -d

# Ver status
docker compose -f .docker/docker-compose.yaml ps

# Acompanhar logs
docker compose -f .docker/docker-compose.yaml logs -f postgres

# Parar os serviços
docker compose -f .docker/docker-compose.yaml down

# Resetar o banco local
docker compose -f .docker/docker-compose.yaml down -v
docker compose -f .docker/docker-compose.yaml up -d
```

## Migrations

As migrations são a fonte de verdade do schema.

```bash
# Aplicar migrations pendentes
yarn migration:run

# Ver status
yarn typeorm -d src/database/data-source.ts migration:show

# Reverter a última migration
yarn migration:revert

# Gerar migration após alterar entidades
yarn typeorm -d src/database/data-source.ts migration:generate src/database/migrations/DescricaoDaAlteracao
```

Fluxo recomendado:

1. alterar as entidades ou regras do domínio;
2. gerar e revisar a migration;
3. aplicar com `yarn migration:run`;
4. executar testes;
5. validar o seeder e os endpoints afetados.

## Seeder

O seeder é executado como uma aplicação standalone do Nest e usa o `DataSource` oficial do TypeORM. A execução é transacional e idempotente.

```bash
yarn seed
```

Dados gerados:

- 1 produtor;
- 5 fazendas em SC, PR, RS e GO;
- 5 culturas: Soja, Milho, Trigo, Feijão e Algodão;
- safras de 2025 e 2026 para cada fazenda;
- plantações distribuídas entre as safras.

Executar `yarn seed` novamente reutiliza os registros existentes e não cria duplicatas.

## Executar a aplicação

```bash
# Desenvolvimento
yarn start:dev

# Execução normal
yarn start

# Build e produção
yarn build
yarn start:prod
```

A aplicação utiliza o prefixo global `/api` e a porta definida em `PORT`.

## API

Todos os endpoints abaixo usam o prefixo `/api`.

| Recurso | Operações |
| --- | --- |
| Customers | `POST/GET /customers`, `GET/PATCH/DELETE /customers/:id` |
| Farms | `POST/GET /entities`, `GET/PATCH/DELETE /entities/:id`, `GET/POST /entities/:entityId/crop-seasons`, `GET/PUT /entities/:entityId/crop-seasons/:cropSeasonId`, `POST /entities/:entityId/crop-seasons/:cropSeasonId/crop-season-crops`, `GET/PUT /entities/:entityId/crop-seasons/:cropSeasonId/crop-season-crops/:cropSeasonCropId` |
| Crops | `POST/GET /crops`, `GET/PATCH/DELETE /crops/:id` |
| Crop Seasons | `POST/GET /crop-seasons`, `GET/PATCH/DELETE /crop-seasons/:id` |
| Plantings | `POST/GET /crop-season-crops`, `GET/PATCH/DELETE /crop-season-crops/:id` |

### Criar uma fazenda

```http
POST /api/entities
Content-Type: application/json
```

```json
{
  "name": "Fazenda Boqueirão",
  "customerId": "customer-uuid",
  "address": {
    "street": "Da sede",
    "number": "26",
    "city": "Lages",
    "state": "SC",
    "zipCode": "88516120"
  },
  "totalArea": 900,
  "agricultureArea": 700,
  "vegetationArea": 200
}
```

### Criar uma safra

```http
POST /api/crop-seasons
Content-Type: application/json
```

```json
{
  "entityId": "farm-uuid",
  "year": "2026"
}
```

`year` aceita exatamente quatro dígitos: `2026` é válido; `26` e `2026-01-01` são inválidos.

### Registrar uma plantação

```http
POST /api/crop-season-crops
Content-Type: application/json
```

```json
{
  "cropSeasonId": "season-uuid",
  "cropId": "crop-uuid",
  "plantedArea": 300
}
```

Os endpoints de consulta de safra carregam a fazenda e as culturas relacionadas.

## Dashboard

```http
GET /api/dashboard
```

Filtrar as métricas por ano de safra:

```http
GET /api/dashboard?year=2026
```

Quando informado, `year` filtra:

- total de fazendas;
- área total;
- distribuição por estado;
- culturas plantadas;
- uso do solo.

O parâmetro aceita somente o formato `YYYY`.

## Testes e qualidade

```bash
# Todos os testes unitários
yarn test

# Execução serial, útil para diagnóstico
yarn test --runInBand

# Um módulo específico
yarn test crop_seasons.service.spec.ts --runInBand

# Modo watch
yarn test:watch

# Cobertura
yarn test:cov

# Testes e2e
yarn test:e2e

# Lint e build
yarn lint
yarn build
```

O teste e2e atual em [test/app.e2e-spec.ts](test/app.e2e-spec.ts) valida um health check isolado. Para testar a API real com PostgreSQL, suba o Docker, aplique migrations ou execute o seed e inicie a aplicação.

## Checklist de desenvolvimento

```bash
yarn install
docker compose -f .docker/docker-compose.yaml up -d
yarn seed
yarn test --runInBand
yarn start:dev
```

Depois, consulte:

- Swagger: `http://localhost:3001/docs`;
- Dashboard: `http://localhost:3001/api/dashboard?year=2026`;
- API: `http://localhost:3001/api`.
