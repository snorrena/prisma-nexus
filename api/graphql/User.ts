import { argsToArgsConfig } from "graphql/type/definition";
import { arg, booleanArg, list, objectType } from "nexus";
import { extendType, stringArg, nonNull, intArg } from "nexus";
import { context } from "../context";
import { Post } from "./Post";

export const User = objectType({
  name: "User",
  description: "a representation of a single user",
  definition(t) {
    t.nonNull.string("id");
    t.string("firstName");
    t.string("lastName");
    t.list.field("writtenPosts", {
      type: Post,
      resolve(_root, _args, ctx) {
        const userPosts = ctx.db.post.findMany({
          where: { authorId: _root.id },
        });
        userPosts.then((post) => console.log(post));
        return userPosts;
      },
    });
  },
});

export const addUser = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("addUser", {
      type: User,
      args: {
        firstName: nonNull(stringArg()),
        lastName: nonNull(stringArg()),
      },
      resolve(_root, args, ctx) {
        const user = {
          firstName: args.firstName,
          lastName: args.lastName,
        };
        return ctx.db.user.create({ data: user });
      },
    });
  },
});

export const deleteUser = extendType({
  type: "Mutation",
  definition(t) {
    t.field("deleteUserById", {
      type: User,
      args: {
        id: nonNull(stringArg()),
      },
      resolve(_root, args, ctx) {
        const user = ctx.db.user.findUnique({
          where: { id: args.id },
        });
        if (!user) {
          return new Error(`no user found with id: ${args.id}`);
        }
        return ctx.db.user.delete({
          where: { id: args.id },
        });
      },
    });
  },
});

export const queryUsers = extendType({
  type: "Query",
  definition(t) {
    t.list.field("users", {
      type: User,
      resolve(_root, _args, ctx) {
        return ctx.db.user.findMany();
      },
    });
  },
});
