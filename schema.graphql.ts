### This file was generated by Nexus Schema
### Do not make changes to this file directly


type Mutation {
  addUser(firstName: String!, lastName: String!): User!
  createDraft(body: String!, id: String!, title: String!): Post!
  deleteUserById(id: String!): User!
  posts: [Post]
  publish(draftId: String!): Post
}

type Post {
  authorId: String
  body: String
  id: String!
  published: Boolean
  title: String
}

type Query {
  allPosts: [Post]!
  drafts: [Post]!
  getPostsById(id: String!): [Post]
  published: [Post]!
  users: [User]
}

"""a representation of a single user"""
type User {
  firstName: String
  id: String!
  lastName: String
  writtenPosts: [Post]
}