import { useEffect, useState } from "react";
import version from "./version";

function makeGo(stateSetterCallback: (value: string) => void, retryCount = 0) {
  const retry = () => makeGo(stateSetterCallback, retryCount + 1);

  fetch("http://localhost:8000/something", {
    credentials: "same-origin",
  })
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

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => makeGo(setMessage));

  return (
    <>
      <pre>{message}</pre>
      <pre>{JSON.stringify({ version }, null, 2)}</pre>
    </>
  );
}

export default App;
