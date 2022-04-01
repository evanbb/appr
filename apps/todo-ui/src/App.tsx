import "./index.css";
import version from "./version";
import TodoList from "./todos/TodoList";

function App() {
  return (
    <>
      <header>Version: {version}</header>
      <main>
        <TodoList />
      </main>
      <footer>Version: {version}</footer>
    </>
  );
}

export default App;
