### env

Run `npx dotenv-vault@latest pull` to authenticate on https://vault.dotenv.org and get `.env` file. Don't forget to use the latest node version.

### database

Run `docker-compose up -d` to up the postgre database container.

Run `yarn db:migrate` to create the database schema and `yarn db:seed` to initialize it.

Run `psql -h localhost -p 1 -U user -d el-metrics-db` to aceess the database via the postgre cli.

### dev

Use `yarn setup` to install the project node version and [nvshim](https://github.com/iamogbz/nvshim?tab=readme-ov-file#installation) to automagically use it on your sheels.

Install [VSCode GraphQL](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql) extension to validade your `.graphql` files against github schema.