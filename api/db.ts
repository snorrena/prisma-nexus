//api/db.ts

import { PrismaClient } from "@prisma/client";
export const db = new PrismaClient();

export interface Context {
  db: PrismaClient;
}
export const context = {
  db,
};

// export interface Post {
//   id: number;
//   title: string;
//   body: string;
//   published: boolean;
// }

// export interface Db {
//   posts: Post[];
// }

// export const db: Db = {
//   posts: [],
// };
