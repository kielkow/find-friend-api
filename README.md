# App

Find a friend API.

## RFs (Requisitos funcionais)

- [X] Deve ser possível cadastrar um pet;
- [X] Deve ser possível listar todos os pets disponíveis para adoção em uma cidade;
- [X] Deve ser possível filtrar pets por suas características;
- [X] Deve ser possível visualizar detalhes de um pet para adoção;
- [X] Deve ser possível se cadastrar como uma ORG;
- [X] Deve ser possível realizar login como uma ORG;

## RNs (Regras de negócio)

- [X] Para listar os pets, obrigatoriamente precisamos informar a cidade;
- [X] Uma ORG precisa ter um endereço e um número de WhatsApp;
- [X] Um pet deve estar ligado a uma ORG;
- [X] O usuário que quer adotar, entrará em contato com a ORG via WhatsApp;
- [X] Todos os filtros, além da cidade, são opcionais;
- [X] Para uma ORG acessar a aplicação como admin, ela precisa estar logada;

## RNFs (Requisitos não-funcionais)

- [X] A senha do usuário precisa estar criptografada;
- [X] Os dados da aplicação precisam estar persistidos em um banco PostgreSQL;
- [X] Todas listas de dados precisam estar paginadas com 20 itens por página;
- [X] O usuário deve ser identificado por um JWT (JSON Web Token);
- [ ] Os dados de listagem devem ser salvos em cache, e só buscados no banco caso haja alguma alteração;
- [ ] Todos os logs de erro da aplicação devem ser salvos no Sentry;
