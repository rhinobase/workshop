"use client";
import { endpoint } from "@/utils";
import { Button, InputField } from "@rafty/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function CreateTaskForm() {
  const client = useQueryClient();
  const [value, setValue] = useState("");

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (task: string) =>
      endpoint.post("/todos", {
        task,
      }),
    onSuccess: () => {
      setValue("");
      client.invalidateQueries({ queryKey: ["task"] });
    },
    onError: (err) => {
      console.error(err);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();

        mutateAsync(value);
      }}
      className="flex justify-between items-center gap-4"
    >
      <InputField
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <Button type="submit" colorScheme="primary" isLoading={isPending}>
        Add Task
      </Button>
    </form>
  );
}
