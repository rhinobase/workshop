"use client";
import { endpoint } from "@/utils";
import type { Todo } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { TodoCard } from "./Card";
import { Spinner } from "@rafty/ui";

export function Stack() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["task"],
    queryFn: () => endpoint.get<Todo[]>("/todos").then((res) => res.data),
  });

  if (isLoading)
    return (
      <div className="w-full h-full flex items-center justify-center gap-1">
        <Spinner />
        <p>Loading...</p>
      </div>
    );

  if (isError)
    return (
      <div className="flex w-full h-full items-center justify-center gap-1">
        <p className="font-medium text-red-500">Error</p>
      </div>
    );

  if (data)
    return (
      <div className="border-secondary-300 rounded-md border max-h-full overflow-y-auto divide-y">
        {data.length > 0 ? (
          data.map((item, index) => (
            <TodoCard key={`${index}-${item.task}`} {...item} />
          ))
        ) : (
          <p className="py-6 text-center select-none font-medium text-secondary-500">
            No Data Found
          </p>
        )}
      </div>
    );
}
