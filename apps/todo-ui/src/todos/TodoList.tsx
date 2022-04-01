import { type FormEventHandler, useEffect, useState, useRef } from "react";

interface CreateTodo {
  title: string;
}

interface Todo {
  title: string;
  id: string;
}

interface TodoProps {
  todos: Todo[];
  onRemove: (id: string) => void;
}

function Todos({ todos, onRemove }: TodoProps) {
  return (
    <ol>
      {todos.map((todo) => (
        <li key={todo.id}>
          <TodoItem todo={todo} onRemove={onRemove} />
        </li>
      ))}
    </ol>
  );
}

interface TodoItemProps {
  todo: Todo;
  onRemove: (id: string) => void;
}

function TodoItem({ todo: { title, id }, onRemove }: TodoItemProps) {
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (isDone) {
      onRemove(id);
    }
  }, [id, isDone, onRemove]);

  return (
    <label>
      <input
        type="checkbox"
        checked={isDone}
        onChange={(e) => setIsDone(e.target.checked)}
      />
      {title}
    </label>
  );
}

interface TodoFormProps {
  onSubmit: (todo: CreateTodo) => void;
}

function TodoForm({ onSubmit }: TodoFormProps) {
  const [value, setValue] = useState("");

  const onSubmitImpl: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    onSubmit({ title: value });
  };

  return (
    <form onSubmit={onSubmitImpl}>
      <fieldset>
        <legend>Add a new todo!</legend>
        <label>
          What needs doing?
          <input value={value} onChange={(e) => setValue(e.target.value)} />
        </label>
      </fieldset>
    </form>
  );
}

function useWebSockets(onTodosUpdated: (todos: Todo[]) => void) {
  const socket = useRef<WebSocket | null>(null);
  
  useEffect(() => {
    socket.current = new WebSocket("ws://localhost:8000/notifications");
    return () => {
      socket.current!.close()
    }
  }, [])
  
  useEffect(() => {
    function messageHandler(message: MessageEvent) {
      const todos = JSON.parse(message.data) as Todo[]
      onTodosUpdated(todos);
    }

    socket.current!.addEventListener("message", messageHandler);

    return () => {
      socket.current!.removeEventListener("message", messageHandler);
    };
  }, [onTodosUpdated]);
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useWebSockets(setTodos);

  const onRemove = (id: string) => {
    console.log('removing id', id)
  };

  const onSubmit = (todo: CreateTodo) => postTodo(todo);

  return (
    <>
      <TodoForm onSubmit={onSubmit} />
      <Todos todos={todos} onRemove={onRemove} />
    </>
  );
}

function postTodo(todo: CreateTodo) {
  fetch("http://localhost:8000/todos", {
    method: "POST",
    body: JSON.stringify(todo),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
