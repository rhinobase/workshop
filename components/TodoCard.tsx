"use client";
import { Button, InputField } from "@rafty/ui";
import { useState } from "react";

export type TodoCard = {
  task: string;
  status: boolean;
};

export function TodoCard({ status, task }: TodoCard) {
  const [isOpen, setOpen] = useState(false);

  return (
    <div className="flex justify-between items-center gap-4 p-4">
      <div className="space-y-1">
        {isOpen ? (
          <InputField />
        ) : (
          <h3 className="text-lg font-semibold">{task}</h3>
        )}
        <p className="text-sm">
          <span className="font-medium">Status:</span>{" "}
          {status ? (
            <span className="text-green-500">Completed</span>
          ) : (
            <span className="text-red-500">Pending</span>
          )}
        </p>
      </div>
      <div className="flex-1" />
      <Button onClick={() => setOpen(true)}>Edit</Button>
      <Button colorScheme="error">Delete</Button>
    </div>
  );
}
