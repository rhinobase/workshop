import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  // Parse the JSON body
  const body = await req.json();

  // Update the todo
  await prisma.todo.update({
    where: {
      id: params.id,
    },
    data: {
      status: body.status,
    },
  });

  // Return an empty response
  return Response.json({});
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  // Delete the todo
  await prisma.todo.delete({
    where: {
      id: params.id,
    },
  });

  // Return an empty response
  return Response.json({});
}
