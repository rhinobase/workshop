"use client";
import { endpoint } from "@/utils";
import type { Todo } from "@prisma/client";
import { Button, Checkbox, classNames } from "@rafty/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function TodoCard({ status, task, id }: Todo) {
  const client = useQueryClient();

  const { mutateAsync: deleteTask, isPending: isDeleting } = useMutation({
    mutationFn: (task_id: string) => endpoint.delete(`/todos/${task_id}`),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["task"] });

      console.log("Task Deleted!");
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const { mutateAsync: setStatus, isPending: isSettingStatus } = useMutation({
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
        checked={status}
        onCheckedChange={(check) =>
          setStatus({
            check: check as boolean,
            task_id: id,
          })
        }
        isDisabled={isSettingStatus}
      />
      <p className={classNames(isSettingStatus && "opacity-50", "font-medium")}>
        {task}
      </p>
      <div className="flex-1" />
      <Button
        size="sm"
        colorScheme="error"
        onClick={() => deleteTask(id)}
        isLoading={isDeleting}
        loadingText="Deleting"
        isDisabled={isSettingStatus}
      >
        Delete
      </Button>
    </div>
  );
}
