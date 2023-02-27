import { objectType } from "nexus";
import { extendType, stringArg, nonNull, intArg } from "nexus";
import { context } from "../context";
import { User } from "./User";

export const Post = objectType({
  name: "Post", //name of your type
  definition(t) {
    t.nonNull.string("id"); //field name 'id' of type integer
    t.string("title"); //field name of 'title' of type string
    t.string("body"); //field name of 'body' of type string
    t.boolean("published"); //field name of 'published' of type boolean
    t.string("authorId");
  },
});

export const PostQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.field("drafts", {
      type: "Post",
      resolve(_root, _args, ctx) {
        return ctx.db.post.findMany({ where: { published: false } });
      },
    });
    t.nonNull.list.field("published", {
      type: "Post",
      resolve(_root, _args, ctx) {
        return ctx.db.post.findMany({ where: { published: true } });
      },
    });
    t.nonNull.list.field("allPosts", {
      type: "Post",
      resolve(_root, _args, ctx) {
        return ctx.db.post.findMany();
      },
    });
    t.list.field("getPostsById", {
      type: "Post",
      args: {
        id: nonNull(stringArg()),
      },
      resolve(_root, args, ctx) {
        return ctx.db.post.findMany({ where: { id: args.id } });
      },
    });
  },
});

export const PostMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createDraft", {
      type: "Post",
      args: {
        id: nonNull(stringArg()),
        title: nonNull(stringArg()),
        body: nonNull(stringArg()),
      },
      resolve(_root, args, ctx) {
        const draft = {
          title: args.title,
          body: args.body,
          published: false,
          author: User,
          authorId: args.id,
        };
        const user = ctx.db.user.findUnique({ where: { id: args.id } });
        return ctx.db.post.create({
          data: {
            title: args.title,
            body: args.body,
            published: false,
            authorId: args.id,
          },
        });
      },
    }),
      t.field("publish", {
        type: "Post",
        args: {
          draftId: nonNull(stringArg()),
        },
        resolve(_root, args, ctx) {
          return ctx.db.post.update({
            where: { id: args.draftId },
            data: {
              published: true,
            },
          });
        },
      }),
      t.list.field("posts", {
        type: "Post",
        resolve(_root, _args, ctx) {
          return ctx.db.post.findMany({ where: { published: false } });
        },
      });
  },
});
