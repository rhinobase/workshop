"use client";
import { endpoint } from "@/utils";
import type { Todo } from "@prisma/client";
import { Button, Checkbox, Label } from "@rafty/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function TodoCard({ status, task, id }: Todo) {
  const client = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: (task_id: string) => endpoint.delete(`/todos/${task_id}`),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["task"] });

      console.log("Task Deleted!");
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const { mutateAsync: mutateAsyncStatus } = useMutation({
    mutationFn: (values: { task_id: string; check: boolean }) =>
      endpoint.put(`/todos/${values.task_id}`, {
        status: values.check,
      }),

    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["task"] });

      console.log("Task Checked!");
    },
    onError: (err) => {
      console.error(err);
    },
  });

  return (
    <div className="flex items-center gap-4 p-4">
      <Checkbox
        id={id}
        checked={status}
        onCheckedChange={(check) =>
          mutateAsyncStatus({
            check: check as boolean,
            task_id: id,
          })
        }
      />
      <Label className="text-lg font-semibold" htmlFor={id}>
        {task}
      </Label>
      <div className="flex-1" />
      <Button colorScheme="error" onClick={() => mutateAsync(id)}>
        Delete
      </Button>
    </div>
  );
}
