<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

Este módulo NestJS fornece autenticação JWT para a aplicação Find My Buddy.

### Recursos

- Endpoint `/auth/login` (POST) que recebe { email, senha } e retorna um token JWT
- Endpoint `/auth/validate` (POST) que valida tokens JWT
- Usa bcrypt para hashing de senhas
- Inclui AuthGuard para proteger rotas
- DTOs para requests/responses com validação
- Swagger para documentação da API

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Testando a API

1. Inicie a aplicação com `npm run start:dev`
2. Acesse a documentação Swagger em `http://localhost:3000/api`
3. Teste o endpoint de login:
   - Use o endpoint `/auth/login` com as credenciais:
     ```json
     {
       "email": "user@example.com",
       "senha": "password123"
     }
     ```
   - Você receberá um token JWT
4. Teste o endpoint de validação:
   - Use o endpoint `/auth/validate` com o token recebido:
     ```json
     {
       "token": "seu-token-jwt"
     }
     ```
5. Teste a rota protegida:
   - Clique no botão "Authorize" no topo da página Swagger
   - Insira o token JWT no formato `Bearer seu-token-jwt`
   - Tente acessar o endpoint `/protected`

Alternativamente, você pode usar o script `test-auth.sh` para testar todos os endpoints automaticamente:

```bash
chmod +x test-auth.sh
./test-auth.sh
```

## Docker

Este projeto inclui configuração Docker para facilitar o desenvolvimento e implantação.

### Usando o Makefile

Um Makefile foi criado para simplificar as operações com Docker. Você pode usar os seguintes comandos:

```bash
# Mostrar todos os comandos disponíveis
make help

# Iniciar todos os containers em modo detached
make up

# Parar e remover containers e redes
make down

# Reiniciar todos os containers
make restart

# Ver logs de todos os containers
make logs

# Ver logs apenas da API
make logs-api

# Ver logs apenas do banco de dados
make logs-db

# Listar containers em execução
make ps

# Reconstruir todos os containers
make build

# Remover containers, redes, imagens e volumes
make clean

# Remover todos os recursos Docker não utilizados (system-wide)
make prune
```

### Usando Docker Compose Diretamente

Alternativamente, você pode usar o Docker Compose diretamente:

```bash
# Iniciar os serviços
docker-compose -f docker/docker-compose.yml up -d

# Parar os serviços
docker-compose -f docker/docker-compose.yml down
```

Para mais informações sobre a configuração Docker, consulte o arquivo [README.md](docker/README.md) na pasta docker.

## Estrutura do Projeto

- `src/auth/dto/`: DTOs para requests/responses
- `src/auth/guards/`: Guards para proteção de rotas
- `src/auth/strategies/`: Estratégias de autenticação
- `src/auth/auth.controller.ts`: Controlador com endpoints de autenticação
- `src/auth/auth.service.ts`: Serviço com lógica de autenticação
- `src/auth/auth.module.ts`: Módulo de autenticação
- `src/auth/constants.ts`: Constantes utilizadas no módulo de autenticação

## Alterações Recentes

- Adicionado script para criar um usuário administrador padrão
- Corrigido um problema de tipagem no método `validateToken` do serviço de autenticação
- Centralizado a definição da chave secreta JWT em um único arquivo de constantes
- Adicionado um script de teste para verificar todos os endpoints de autenticação

## Usuários do Sistema

### Usuário de Teste

Para fins de demonstração, o sistema inclui um usuário de teste:

- Email: user@example.com
- Senha: password123

### Usuário Administrador

O sistema também inclui um usuário administrador padrão que pode ser criado usando o script de seed:

- Email: admin@example.com
- Senha: x3_Cr2qJ;@]PBQ}T

Para criar o usuário administrador, execute um dos seguintes comandos:

```bash
# Usando npm
npm run seed:admin

# Usando o Makefile
make seed-admin
```

Nota: O banco de dados deve estar em execução para que o script de seed funcione corretamente. Se você estiver usando Docker, certifique-se de que os containers estão em execução com `make up` antes de executar o script de seed.

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
