import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  // Get all todos
  const todos = await prisma.todo.findMany();

  // Return the todos
  return Response.json(todos);
}

export async function POST(req: Request) {
  // Parse the JSON body
  const body = await req.json();

  // Create a new todo
  const todo = await prisma.todo.create({
    data: {
      task: body.text,
    },
  });

  // Return the new todo
  return Response.json(todo);
}
