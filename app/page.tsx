"use client";
import { TodoCard } from "@/components/TodoCard";
import type { Todo } from "@prisma/client";
import { Button, InputField } from "@rafty/ui";
import { useState } from "react";

const DATA = Array.from({ length: 10 }).fill({
  task: "Lorem Ipsum",
  status: true,
}) as Todo[];

export default function Home() {
  const [value, setValue] = useState("");
  const [tasks, setTasks] = useState(DATA);

  const onAdd = () => {
    const newTask = { id: "123", task: value, status: false };
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setValue("");
  };

  return (
    <div className="max-w-5xl mx-auto w-full h-full py-8 flex flex-col gap-8">
      <h1 className="text-4xl text-center font-semibold">Todo App</h1>
      <div className="flex justify-between items-center gap-4">
        <InputField
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <Button colorScheme="primary" onClick={onAdd}>
          Add Task
        </Button>
      </div>
      <div className="border-secondary-300 dark:border-secondary-700 rounded-md border divide-y h-full overflow-y-auto">
        {tasks.map((item, index) => (
          <TodoCard key={`${index}-${item.task}`} {...item} />
        ))}
      </div>
    </div>
  );
}
