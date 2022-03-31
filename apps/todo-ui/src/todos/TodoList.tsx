import { type FormEventHandler, useEffect, useState } from "react";

function generateId() {
  return Date.now().toString();
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
  }, [id, isDone]);

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
  onSubmit: (todo: Todo) => void;
}

function TodoForm({ onSubmit }: TodoFormProps) {
  const [value, setValue] = useState("");

  const onSubmitImpl: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    onSubmit({ title: value, id: generateId() });
    setValue("");
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

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const onRemove = (id: string) => {
    setTodos((todos) => todos.filter((todo) => todo.id !== id));
  };

  const onSubmit = (todo: Todo) => setTodos((todos) => todos.concat(todo));

  return (
    <>
      <TodoForm onSubmit={onSubmit} />
      <Todos todos={todos} onRemove={onRemove} />
    </>
  );
}
