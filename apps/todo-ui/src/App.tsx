import { useEffect, useState } from "react";
import version from './version'

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/something", {
      credentials: 'same-origin'
    })
      .then((response) => response.json())
      .then((response) => {
        setMessage(JSON.stringify(response, null, 2));
      });
  });

  return <>
  <pre>{message}</pre>
  <pre>{JSON.stringify({version}, null, 2)}</pre></>;
}

export default App;
