"use client";
import { Form } from "@/components/Form";
import { Stack } from "@/components/Stack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="max-w-5xl mx-auto w-full h-full py-8 flex flex-col gap-5">
        <h1 className="text-4xl text-center font-bold">Todo App</h1>
        <Form />
        <Stack />
      </div>
    </QueryClientProvider>
  );
}
