Goal: Graphql with code first schema generation

- nexus is used to generate the graphql schema programmically
- prisma is used to connect the graphql server to the postgresql database

notes:
the .env files must be created in the project root and include the postgres connection string to the database: "nexus"
the database must exist and be owned by user 'postgres'

the database url var in the .env file. The database type is postgres. The database name is nexus. The database owner and password is postgres:1Mysterynorpg. The db path and port are localhost:5432
DATABASE_URL="postgresql://postgres:1Mysterynorpg@localhost:5432/nexus"

to update prisma:
pnpm install prisma@latest
pnpm install @prisma/client@latest
pnpm prisma generate

add post install script to package.json
"postinstall": "prisma generate"

# Dependencies:

- node env - pnpm init -y // initializes node in the project root directory and creates the 'package.json' file
  pnpm i nexus graphql appolo-server // nexus will auto-gen types and schema from code, graphql is ths query language and runtime, appolo is a graphql compliant server. Appolo also provide a gui
  pnpm i @prisma/client //used to connect the graphql server to a database
  pnpm i --save-dev prisma //prisma is used to map our model schema data to our postgres database

  # prisma executables

  pnpm prisma generate //creates the prisma folder including the schema.prisma file where database model and relationships are defined
  pnpm prisma migrate dev --name init --preview-feature //run to syncronize the schema.prisma SDL with the attached database
  pnpm prisma migrate dev --name dev //change the name and run again to persist changes made in the schema.prisma file

# Dev Dependencies:

- pnpm i --save-dev typescript ts-node-dev
- typescript is the type safe programming language used, ts-node-dev is used to transpile and run .ts file on the fly and re-start the app after saving changes

# Schema auto generation from code:

- the nexus makeSchema function is used to generate the graphql types and schema from code

Definition of the graphql types and schema are contained in the files under /api/graphql

- /api/graphql/index.ts - the index.ts file is used to consolidate and re-export all SDL(schema definition language) types code under the graphql folder
- api/graphql/index.ts //code: export \* from "./Post";
  the types definitions are then imported into the schema.ts file
- schema.ts //code: import \* as types from "./graphql"; //types is past as param into the makeSchema function
- the schema.ts file is then imported into the server.ts file
  the server.ts file is then imported to the root level index.ts file where it is used to start the appolo server using the server schema and context.

  nexus will automatically update and expose graphql queries for Posts and User as defined in the Post.ts & User.ts files re-exported from the index.ts file in the graphql folder. All are imported in the schema.ts file and used by the nexus makeSchema function. All are autogenerate into the two files nexus-typegen.ts & schema.graphql.ts files in the root director

# File explanation and use

/api
-/graphql
--index.ts //consolidation of underlying SDL(schema definition code)
--Post.ts // SDL for creating and mutating 'Posts'
--User.ts //SDL for created and mutating 'Users'

/node_modules //npm install packages

/prisma //folder containg all prisma sdl and migration files
--/migrations //prisma migrations files
--schema.prisma //file contains the prisma generator/database connection and sdl models

/test //jest test files

.env //dotenv file containg the database url string

.gitignore //files/folders to be ignored by git (specifically the .env folder)

graphqlReq.rest // a file for testing the graphql endpoints from within vscode

nexus-typegen.ts //nexus generated file not for editing

package-lock.json //npm lock file not for editing

package.json //list of npm dependencies and scripts

README.md

schema.graphql.ts //nexus generated SDL(graphql schema) not for editing

tsconfig.json// typescript compiler configuration

how is the server run
npm run dev // runs the script in the package.json file - "dev": "ts-node-dev --transpile-only --no-notify api/index.ts"
explaination: runs the dev ts-node server, transpiles typescript code starting with the index.ts file in the api folder

import/export syntax:
typescript files and installed dependencies are imported and exported/re-exported as follows
import \* as types from './folderName' // imports the default exports as 'types' is then used as object in the importing file
import { fileName } from './folderName'// the named type 'fileName' is then used in the importing code
export _ as types from ./graphql //this imports the index.ts file. The indes.ts is used to consolidate and re-export all types files in the same directory. The syntax for export is: export _ from './Post'
all required objects are exported from the separate type files:
ex.
Post.ts
export const post = Objecttype({})

schema.prisam //this is the main file used defining the prisma db client generator. This defines how will connect from graphql to the database
the database source (postgres) and connection url are referenced in this file. The connection url is pulled from the .env file
the models in this file are used by prisma to set up the database tables in postgres.

types are objects
String, Boolean, Number
attributes are preceed with the @ symbol ex. @unique @default

@relation defines relations between models
writtenPosts is the name of the relation and is defined as a list of Posts in belonging to a user:
writtenPosts Post[] @relation("writtenPosts")

the Post model then show the relation as linked between the Post authorId and the user id. The relation also includes the onDelete: Cascade attribute that will trigger deleted of the users posts when the related user is deleted
@relation("writtenPosts", fields: [authorId], references: [id], onDelete: Cascade)

the fields are named and types defined. Attributes and relations are defined

as changed are made in the schema.prisma file, the following command is used to migrate changes to the database
npx prisma migrate dev --name init --preview-feature //first run to initialize the database
npx prisma migrate dev --name dev //to migrate new changes into the database structure

//the schema (db schema definition) & context (prisma client for db connection) are exported then imported into the server.ts and used to create the applo server
export const server = new ApolloServer({ schema, context });

ex.
export const server = new ApolloServer({ schema, context });
//the 'schema' object argument passed to the apollo server instantiatiopn method here includes all code and dependencies required to generate the graphql code and server
//the 'context' object is a simulation of an in memory database with seed data
//the server object is then imported into the index.ts file at the project root directory.
//When the index.ts file in the root directory is executed by ts-node-dev, the server is created and started listing on the default port at localhost

file explanation:
->api
->api/graphql
--index.ts //this file is used to consolidate and re-export SDL files in the same folder. Currently, it re-exports ./Post and ./User.ts. Other files could be included as needed
--Post.ts //this file is used to create SDL (schema definition languge) code used to interact with our graphql server
--User.ts //this files include the details of a user
->api/context.ts //this file is used to pass through our database context
->api/db.ts //this file is used to define and implement the database
->api/schema.ts //this file is used to auto generate the graphql schema using the defined types and database context
note: the schema.ts file imports all from the default index.ts file in the graphql folder
//import \* as types from "./graphql";
->api/server.ts //this file is used to consolidate and export the appolo server created using the defined sdl schema and database context
->node_modules //node managed dependecies and executables
--nexus-typegen.ts //nexus generated sdl type code
--package-lock.json //node managed package lock file
--package.json //node dependencies, run scripts and configuration
--README.md
--schema.graphql.ts //nexus generated sdl schema definition language
--tsconfig.json //typescript compiler configuration details

# how to run

start the postgres server that includes the 'nexus' database that will be read/written to using prisma
pnpm run dev //starts the dev script in the package.json file. ts-node-dev transpiles our typescript and runs as javascript in memory starting from the index.ts files in the api directory in our project root
the appolo graphql server is exposed a http://localhost:4000

# execute server queries

1. right click on the server url in the console window or enter the url manually in a browser. If you are connected to the internet,
   the appolo graphql web ui will open and allow your to inspect your graphql server and run queries
2. install the rest plugin into vscode, create and run a graphql query from the file inside the ide
3. run one of the curl requests including in the curl.tx file
4. run the fetch scripts.ts in the fetch folder with ts-node or deno
   deno run --allow-net ./fetch/script.ts
   or run live server to load a web page with script to query the graphql server and output returned data to the browser
   live-server --open=./fetch/index.html
