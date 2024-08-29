## React and Next.js Project Setup

This project is developed using React and Next.js, a robust framework that supports server-side rendering, static site generation, and more. Below is a comprehensive guide to setting up the project and the tools used.

### Creating a New Next.js App

To create a new Next.js application, use the following command:

```bash
npx create-next-app@latest
```

## Starting the Development Server

To start the development server, run the following command:

```bash
npm run dev
```

Then, open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Rafty UI

Rafty UI is a UI component library used in this project for building user interfaces quickly. It provides a collection of reusable and customizable components that adhere to best practices and design guidelines.

### Setup Rafty UI

For the styling to work in @rafty/ui, you need to make few changes in your tailwind.config.js file.

First, install the @rafty/plugin package as devDependency and add in your tailwind.config.js file

```tsx
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@rafty/ui/**/*.js",
  ],
  plugins: [require("@rafty/plugin")],
};
export default config;
```

## Create UI using Rafty and Tailwind CSS

Here's an example of creating a Todo App using Rafty UI and Tailwind CSS:

```ts
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
```

```tsx
import { Button, Checkbox, InputField } from "@rafty/ui";

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

## Supabase Integration

Steps to integrate supabase in your application:

1.  Sign Up for Supabase:

    - Go to Supabase and sign up for a free account.

2.  Create a New Project:

    - Once signed in, create a new project and set up your database by following the prompts.

3.  Get Your API Keys:

    - In the Supabase dashboard, navigate to the "Settings" > "Database" section.
    - You'll need the Connection String, both Transactional and Session Mode keys to connect your Next.js application to Supabase.
    - To run this project, you must configure environment variables. Add the following variables in your `.env` file:

      ```bash
      DATABASE_URL="postgresql://postgres.zqfsvdftwmotdadpsdvn:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
      DIRECT_URL="postgresql://postgres.zqfsvdftwmotdadpsdvn:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"
      ```

## Prisma Setup

Steps to setup prisma in your application:

1.  Install Prisma CLI:

    - Install the Prisma CLI as a development dependency:

      ```bash
      npm install -D prisma
      ```

    - Install Prisma client:
      ```bash
      npm install @prisma/client
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

### /api/todos/route.ts

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

### /api/todos/[id]/route.ts

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

## Axios Setup

Steps to install and setup axios:

1. Install Axios :

   ```bash
   npm install axios
   ```

2. Create an Axios Instance:
   The `endpoint` utility function is an Axios instance configured with a base URL (`/api`). This setup simplifies making API requests by automatically appending the base URL to request paths.

   ```tsx
   import axios from "axios";

   export const endpoint = axios.create({
     baseURL: "/api",
   });
   ```

## Integrating API with front-end

### API Integration using Axios: Implementing API for Showing All Todos

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
        <Button colorScheme="primary">Add Task</Button>
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

### API Integration using Tanstack React Query and Axios

Steps to setup Tanstack React Query:

- Install Tanstack React Query

  ```bash
  npm install @tanstack/react-query
  ```

Details on creating the UI using Rafty and Tailwind CSS, with code snippets for `Home`, `Layout`, `Providers`, `Form`, `Stack`, and `Card` components.

- Create Query Client and add it to Query Client Provider.

  ```tsx
  "use client";
  import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

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

  Create Form to add task:

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

  Create Stack to display list if tasks:

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

  TodoCard component used in Stack component:

  ```tsx
  "use client";
  import { endpoint } from "@/utils";
  import type { Todo } from "@prisma/client";
  import { Button, Checkbox, classNames } from "@rafty/ui";
  import { useMutation, useQueryClient } from "@tanstack/react-query";

  export function Card({ status, task, id }: Todo) {
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
        <p
          className={classNames(isSettingStatus && "opacity-50", "font-medium")}
        >
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
