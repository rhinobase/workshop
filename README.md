## React and Next.js Project Setup

This project is developed using React and Next.js, a robust framework that supports server-side rendering, static site generation, and more. Below is a comprehensive guide to setting up the project and the tools used.

### Creating a New Next.js App

To create a new Next.js application, use the following command:

```bash
npx create-next-app@latest
```

## Installing Essential Dependencies

The project relies on several key dependencies. Here's a list of the essential libraries, along with installation instructions:

- @rafty/ui: A UI component library that provides customizable components adhering to best practices.
- @tanstack/react-query: A powerful library for managing server-side state in React applications, offering features like data fetching, caching, and synchronization.
- axios: A promise-based HTTP client for making API requests.
- @prisma/client: The Prisma client, an auto-generated and type-safe query builder for interacting with your database.

Install these dependencies using npm:

```bash
npm install @rafty/ui @tanstack/react-query axios @prisma/client
```

## Installing Development Dependencies

For development, you'll need additional tools like Prisma and Rafty UI plugins:

- prisma: An ORM (Object-Relational Mapping) tool for Node.js and TypeScript, facilitating database schema management and migrations.
- @rafty/plugin: A plugin for extending the capabilities of Rafty UI components.

Install the development dependencies with the following command:

```bash
npm install -D prisma @rafty/plugin
```

## Starting the Development Server

To start the development server, run the following command:

```bash
npm run dev
```

Then, open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Environment Variables

To run this project, you must configure environment variables. Create a `.env.local` file in the root of your project and add the following variables:

```bash
DATABASE_URL=your_database_url_here
DIRECT_URL=another_value_here
```

## Tailwind CSS

This project uses Tailwind CSS for styling. Tailwind is a utility-first CSS framework that allows for rapid UI development. Global styles are located in the `globals.css` file.

## Rafty UI

Rafty UI is a UI component library used in this project for building user interfaces quickly. It provides a collection of reusable and customizable components that adhere to best practices and design guidelines.

### Setup Rafty UI

For the styling to work in @rafty/ui, you need to make few changes in your tailwind.config.js file.

First, install the @rafty/plugin package as devDependency and add in your tailwind.config.js file

```bash
module.exports = {
  darkMode: "class",
  content: [
    ...,
    "./node_modules/@rafty/ui/**/*.js",
  ],
  theme: {
    extend: {
        ...,
    },
  },
  plugins: [
    ...,
    require("@rafty/plugin")
  ],
};
```

## Create UI using Rafty and Tailwind CSS

Details on creating the UI using Rafty and Tailwind CSS, with code snippets for `Home`, `Layout`, `Providers`, `Form`, `Stack`, and `TodoCard` components.

### Page

```tsx
import { Button, Checkbox, InputField } from "@rafty/ui";

const SAMPLE_DATA = [
  {
    id: 1,
    status: false,
    task: "Sample 1",
  },
  {
    id: 2,
    status: false,
    task: "Sample 2",
  },
  {
    id: 3,
    status: false,
    task: "Sample 3",
  },
  {
    id: 4,
    status: false,
    task: "Sample 4",
  },
];

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto w-full h-full py-8 flex flex-col gap-5">
      <h1 className="text-4xl text-center font-bold">Todo App</h1>
      <div className="flex justify-between items-center gap-5">
        <InputField placeholder="Enter task name" />
        <Button type="submit" colorScheme="primary">
          Add Task
        </Button>
      </div>
      <div className="border-secondary-300 rounded-md border max-h-full overflow-y-auto divide-y">
        {SAMPLE_DATA.map(({ id, status, task }) => (
          <div key={id} className="flex items-center gap-4 p-4">
            <Checkbox defaultChecked={status} />
            <p className="font-medium">{task}</p>
            <div className="flex-1" />
            <Button size="sm" colorScheme="error">
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Utility Functions

The `endpoint` utility function is an Axios instance configured with a base URL (`/api`). This setup simplifies making API requests by automatically appending the base URL to request paths.

```tsx
import axios from "axios";

export const endpoint = axios.create({
  baseURL: "/api",
});
```

Benefits:

- Consistency: Ensures all requests use the same base URL.
- Maintainability: Easier to update configuration in one place.

## Integrating API and Database

### API Integration with Axios: Implementing API for Showing All Todos

```tsx
"use client";
import { endpoint } from "@/utils";
import type { Todo } from "@prisma/client";
import { Button, Checkbox, InputField, Spinner } from "@rafty/ui";
import { useEffect, useState } from "react";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto w-full h-full py-8 flex flex-col gap-5">
      <h1 className="text-4xl text-center font-bold">Todo App</h1>
      <div className="flex justify-between items-center gap-5">
        <InputField placeholder="Enter task name" />
        <Button type="submit" colorScheme="primary">
          Add Task
        </Button>
      </div>
      <Stack />
    </div>
  );
}

function Stack() {
  const [data, setData] = useState<Todo[] | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    endpoint.get<Todo[]>("/todos").then((res) => {
      setData(res.data);
      setLoading(false);
    });
  }, []);

  if (isLoading)
    return (
      <div className="w-full h-full flex items-center justify-center gap-1">
        <Spinner />
        <p>Loading...</p>
      </div>
    );

  if (data)
    return (
      <div className="border-secondary-300 rounded-md border max-h-full overflow-y-auto divide-y">
        {data.length > 0 ? (
          data.map(({ id, status, task }) => (
            <div key={id} className="flex items-center gap-4 p-4">
              <Checkbox defaultChecked={status} />
              <p className="font-medium">{task}</p>
              <div className="flex-1" />
              <Button size="sm" colorScheme="error">
                Delete
              </Button>
            </div>
          ))
        ) : (
          <p className="py-6 text-center select-none font-medium text-secondary-500">
            No Data Found
          </p>
        )}
      </div>
    );
}
```

### API Integration with Tanstack React Query and Axios

```tsx
"use client";
import { endpoint } from "@/utils";
import type { Todo } from "@prisma/client";
import { Button, Checkbox, classNames, InputField, Spinner } from "@rafty/ui";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useState } from "react";

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

function Form() {
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

function Stack() {
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

function TodoCard({ status, task, id }: Todo) {
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
```

### Home Page

This is the main page that displays the task creation form and the list of tasks.

```tsx
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
```

## Layout File

This layout file wraps the entire application and includes global styles and providers.

```tsx
import { classNames } from "@rafty/ui";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { PropsWithChildren } from "react";
import "./globals.css";
import { Providers } from "./Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TODOs App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={classNames("h-screen w-full", inter.className)}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

## Providers

This component wraps the application with required providers like QueryClientProvider.

```tsx
"use client";
import type { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function Providers({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
```

## Create Task Form

This component handles task creation and interacts with the API to add new tasks.

```tsx
"use client";
import { endpoint } from "@/utils";
import { Button, InputField } from "@rafty/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function Form() {
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
```

## Todo List

This component fetches and displays the list of tasks from the API.

```tsx
"use client";
import { endpoint } from "@/utils";
import type { Todo } from "@prisma/client";
import { Spinner } from "@rafty/ui";
import { useQuery } from "@tanstack/react-query";
import { TodoCard } from "./TodoCard";

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
```

## Todo Card

This component displays individual tasks and allows for task deletion and status updating.

```tsx
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
```

## Supabase Integration

Supabase provides a powerful, open-source alternative to Firebase, offering features like authentication, real-time databases, and storage.

### Setting Up Supabase

1.  Sign Up for Supabase:

    - Go to Supabase and sign up for a free account.

2.  Create a New Project:

    - Once signed in, create a new project and set up your database by following the prompts.

3.  Get Your API Keys:

    - In the Supabase dashboard, navigate to the "Settings" > "Database" section.
    - You'll need the Connection String, both Transactional and Session Mode keys to connect your Next.js application to Supabase.
    - Add these keys in your `.env` file

```bash
DATABASE_URL="postgresql://postgres.zqfsvdftwmotdadpsdvn:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.zqfsvdftwmotdadpsdvn:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"
```

## Prisma Setup

Prisma is an ORM (Object-Relational Mapping) tool for Node.js and TypeScript that simplifies database interactions.

### Setting Up Prisma

1.  Install Prisma CLI:

    - Install the Prisma CLI as a development dependency:

      ```bash
      npm install -D prisma
      ```

2.  Initialize Prisma:

    - Initialize Prisma in your project. This will create a prisma directory with a schema.prisma file:

      ```bash
      npx prisma init
      ```

3.  Define Your Schema:

    - Open the prisma/schema.prisma file and define your database schema using Prisma's schema language. For example:

      ```ts
      generator client {
        provider = "prisma-client-js"
      }

      datasource db {
        provider  = "postgresql"
        url       = env("DATABASE_URL")
        directUrl = env("DIRECT_URL")
      }

      model Todo {
        id     String  @id @default(cuid())
        task   String
        status Boolean @default(false)
      }
      ```

4.  Generate Prisma Client:

    - Run the following command to generate the Prisma client:

      ```bash
      npx prisma generate
      ```

5.  Run Migrations:

    - Create and run migrations to apply schema changes to your database:
      ```bash
      npx prisma migrate dev --name init
      ```

## API Routes

Code for handling API routes related to todos, including fetching all todos `(GET)`, creating a new todo `(POST)`, updating a todo `(PUT)`, and deleting a todo `(DELETE)`.

### Todos

This route handles fetching all tasks and creating a new task.

```ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  // Get all todos
  const todos = await prisma.todo.findMany();

  // Return the todos
  return Response.json(todos);
}

export async function POST(req: Request) {
  // Parse the JSON body
  const body = await req.json();

  // Create a new todo
  const todo = await prisma.todo.create({
    data: {
      task: body.task,
    },
  });

  // Return the new todo
  return Response.json(todo);
}
```

## Todo

This route handles updating and deleting a specific task.

```ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  // Parse the JSON body
  const body = await req.json();

  // Update the todo
  await prisma.todo.update({
    where: {
      id: params.id,
    },
    data: {
      status: body.status,
    },
  });

  // Return an empty response
  return Response.json({});
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  // Delete the todo
  await prisma.todo.delete({
    where: {
      id: params.id,
    },
  });

  // Return an empty response
  return Response.json({});
}
```

## Resources

- [React](https://reactjs.org/)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Rafty UI](https://rafty.rhinobase.io/)
- [Prisma](https://www.prisma.io/)
- [Supabase](https://supabase.com/)
- [Axios](https://axios-http.com/)
- [Tanstack Query](https://tanstack.com/query/latest)
- [TypeScript](https://www.typescriptlang.org/)
