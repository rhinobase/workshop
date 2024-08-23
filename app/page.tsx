"use client";
import { CreateTaskForm } from "@/components/CreateTaskForm";
import { TodoCard } from "@/components/TodoCard";
import { endpoint } from "@/utils";
import type { Todo } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data } = useQuery({
    queryKey: ["task"],
    queryFn: () => endpoint.get<Todo[]>("/todos").then((res) => res.data),
  });

  return (
    <div className="max-w-5xl mx-auto w-full h-full py-8 flex flex-col gap-8">
      <h1 className="text-4xl text-center font-semibold">Todo App</h1>
      <CreateTaskForm />
      <div className="border-secondary-300 dark:border-secondary-700 rounded-md border divide-y h-full overflow-y-auto">
        {data ? (
          data.map((item, index) => (
            <TodoCard key={`${index}-${item.task}`} {...item} />
          ))
        ) : (
          <p className="p-4">Loading...</p>
        )}
      </div>
    </div>
  );
}
