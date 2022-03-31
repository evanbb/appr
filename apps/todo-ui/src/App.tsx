import './index.css'
import { useEffect, useState } from "react";
import version from "./version";
import TodoList from './todos/TodoList';

function makeGo(stateSetterCallback: (value: string) => void, retryCount = 0) {
  const retry = () => makeGo(stateSetterCallback, retryCount + 1);

  fetch("http://localhost:8000/something")
    .then((response) => response.json())
    .then((response) => {
      stateSetterCallback(JSON.stringify(response, null, 2));
    })
    .catch((error) => {
      if (retryCount >= 3) {
        throw error;
      }

      setTimeout(retry, retryCount * 500 + 500);
    });
}

function useWebSockets() {
  useEffect(() => {
    const webSocket = new WebSocket('ws://localhost:8000/notifications');

    return () => {
      webSocket.close()
    }
  }, [])
}

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => makeGo(setMessage));
  useWebSockets();

  return (
    <>
      <header>{message}</header>
      <main>
        <TodoList />
      </main>
      <footer>Version: { version }</footer>
    </>
  );
}

export default App;
