# Projects

This document provides an overview of the Project API endpoints, request and response formats, and error handling.

## Endpoints

- `GET /projects`: Retrieve a list of all projects.
- `GET /projects/{id}`: Retrieve a specific project by ID.
- `POST /projects`: Create a new project.
- `PUT /projects/{id}`: Update an existing project by ID.
- `DELETE /projects/{id}`: Delete a project by ID.

## Regras de Validação

As regras de validação para os dados do projeto são definidas no arquivo `project-dto.ts`. Abaixo estão as principais validações aplicadas:

- `priceBudget`: Deve ser um número válido e é obrigatório.
- `depositPaid`: Deve ser um número válido (pode ser zero) e é obrigatório.
- `paymentNote`: Deve ser uma string com no máximo 500 caracteres e é opcional.

## Estados do projeto

O projeto pode estar em um dos seguintes estados:

- `PLANNING`: O projeto está em fase de planejamento.
- `CONFIRMED`: O projeto foi confirmado.
- `PRODUCING`: O projeto está em fase de produção.
- `CANCELLED`: O projeto foi cancelado.
- `COMPLETED`: O projeto foi concluído.

## Regras de negócio

- O orçamento do preço (`priceBudget`) deve ser maior que zero.
- O valor do depósito (`depositPaid`) não pode exceder o orçamento do preço.
- O projeto nasce com status code "PLANNING".
- O status muda para `PRODUCING`ou `CONFIRMED` após o pagamento do sinal ou do valor todo.
- O status muda para `CANCELLED`. Basta que o cliente desista do projeto.
- O status muda para `COMPLETED` quando o projeto for finalizado e entregue ao cliente.

## Regras da aplicação

- Apenas usuários autenticados e autorizados podem criar, atualizar ou deletar projetos.
