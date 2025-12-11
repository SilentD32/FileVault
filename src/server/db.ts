import { env } from "~/env";

type Post = {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

type PostCreateInput = {
  name: string;
};

type InMemoryDb = {
  posts: Post[];
  nextId: number;
};

const globalForDb = globalThis as unknown as {
  __memoryDb: InMemoryDb | undefined;
};

const memoryDb: InMemoryDb =
  globalForDb.__memoryDb ??
  {
    posts: [],
    nextId: 1,
  };

if (env.NODE_ENV !== "production") {
  // persist between hot reloads in dev
  globalForDb.__memoryDb = memoryDb;
}

const postModel = {
  async create({ data }: { data: PostCreateInput }): Promise<Post> {
    const now = new Date();
    const post: Post = {
      id: memoryDb.nextId++,
      name: data.name,
      createdAt: now,
      updatedAt: now,
    };
    memoryDb.posts.push(post);
    return post;
  },
  async findFirst({
    orderBy,
  }: {
    orderBy?: { createdAt?: "desc" | "asc" };
  }): Promise<Post | null> {
    if (!memoryDb.posts.length) return null;

    if (orderBy?.createdAt === "desc") {
      return memoryDb.posts[memoryDb.posts.length - 1] ?? null;
    }

    return memoryDb.posts[0] ?? null;
  },
};

export const db = {
  post: postModel,
};
