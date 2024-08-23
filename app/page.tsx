"use client";
import { CreateTaskForm } from "@/components/CreateTaskForm";
import { TodoList } from "@/components/TodoList";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto w-full h-full py-8 flex flex-col gap-5">
      <h1 className="text-4xl text-center font-bold">Todo App</h1>
      <CreateTaskForm />
      <TodoList />
    </div>
  );
}
