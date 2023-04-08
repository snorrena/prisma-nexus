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

/fetch //folder containing a sub project that uses a script to fetch data from our graphql server and display in a web page

/node_modules //npm install packages

/prisma //folder containg all prisma sdl and migration files
--/migrations //prisma migrations files
--schema.prisma //file contains the prisma generator/database connection and sdl models

/Rest-Requests //folder containing files that include graphql queries and mutations that use the vscode rest extention to call our graphql database

/test //jest test files

.env //dotenv file containg the database url string

.gitignore //files/folders to be ignored by git (specifically the .env folder)

.graphqlconfig //???

curl.txt //file including format for curl queries to our graphql db including formating of the return data with jq & python json-tool

nexus-typegen.ts //nexus generated file not for editing

package.json //list of npm dependencies and scripts

package-lock.json //npm lock file not for editing// file is deleted after update to use pnpm

pnpm-lock.yaml // new package lock file after update to use pnpm instead of npm

pnpm-workspace.yaml - replaces workspaces in package.json file when using pnpm

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

schema.prisam //this is the main file used defining the prisma db client generator. This defines how graphql will connect to our postgres database
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

nexus code generation explanation
nexus uses the makeSchema method in the schema.ts file to generate code for connections to our graphql database.

the schema.ts file imports all the nexus object types and extended object types that define queries into our graphql database
the exported schema create inludes types imported from the .api folder, outputs from the generated nexus/prisma code files: schema.graphql.ts & nexus-typegen.ts and context from the database .context.ts

the server.ts file creates the apollo server object passing in the schema and context object as input parameters to the constructor method

Nexus magic query code generation
all obj related code is contained in the /api/graphql dir. The index.ts file is used to export sibling files of User.ts and Post.ts.
Nexus uses object type and extended object type to defined queries and mutations of our database as per the schema definintion /prisma/schema.prisma client, datasource and model definitions (Post and User)

nexus syntax
the object type is at the top and includes all fields as represented in our prisma schema definition
ex. in our prisma schema definition we have defined obects of User and Post with associated fields and relations. These fields and relations are migrated to our database by prisma.

the exported object type includes the following fields
name
description
definition

all are passed into the object type constructor method as an obect parameter

the definition field includes the object type definition block
't' is passed in as type and all fields are defined.
field types and attributes are applied in the definition ex. t.nonnull.string('id'); t is non null of type string and is name 'id'
if an object has a one to many relation to another object type defined in the schema.prisma file then it is represented in the object type as a field list ex. t.list.field("writtenPosts")
the list field method takes in a string for the field name and object that defined the object type ex. Post and resolve method to return the associated field objects
the object param include the 'Type' and a resolve method. The type must be imported into the file in order to be used here ex. Post type in a User object
the resolve method takes in three parameters: \_root, args & ctx. The \_root is used to access field values in the root obejct. The args represent input query values and the ctx is the prisma database object connector. The list object is returned in the resolve method by making a database query on the associated object type

const userPosts = ctx.db.post.findMany({
where: { authorId: \_root.id },
});
userPosts.then((post) => console.log(post));
return userPosts;

the resolve method returns the list of user posts for a user object where the authorId field on the post matched the \_root.id field on the user object

the extend type is used to defined queries and mutations on the base user object type
the extend type constructor method takes in an object that include the type name and a definition method
The type name is either query or mutation
the definition method takes in t as the object block defintion
the definition method body include the t.field method
the field method. The method takes in a string representing the name of the query or mutation and an object definition
the object defintion includes the type (object to be queried or mutated), args (arguments to be used in the mutation or query) and the resolve methhod
the resolve method takes in the root object, args and ctx (context) to be used to query or mutate
the root obj param can be used to collect parameters on the root obj, args is used to reference parameters passed in with the query or mutation, the ctx/context is used to the make the query/mutation on the database object

a user is create using the addUser mutation query. A user is created using only two fields: firstName & LastName. A user obect is created and passed into the user create method to complete the action

export const addUser = extendType({ //extension of the base User object
type: "Mutation", //query is a mutation of our database
definition(t) {//definition of the mutation action
t.nonNull.field("addUser", {
type: User, //the query is on type User
args: { // arguments passed in via the query as key values pairs include attribute specifications ie not null string etc.
firstName: nonNull(stringArg()),
lastName: nonNull(stringArg()),
},
resolve(\_root, args, ctx) { //resolve method including params (args: passed in via the query/mutation, ctx: the database context and object methods)
const user = {
firstName: args.firstName,
lastName: args.lastName,
};
return ctx.db.user.create({ data: user }); //passes in a user object to the create method of the user object
},
});
},
});

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
