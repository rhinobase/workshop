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

        mutateAsync(value.trim());
      }}
      className="flex justify-between items-center gap-5"
    >
      <InputField
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Enter task name"
      />
      <Button
        type="submit"
        colorScheme="primary"
        isLoading={isPending}
        isDisabled={value.trim() === ""}
      >
        Add Task
      </Button>
    </form>
  );
}
