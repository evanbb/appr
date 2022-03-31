import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/api/root", {
      credentials: 'same-origin'
    })
      .then((response) => response.json())
      .then((response) => {
        setMessage(JSON.stringify(response));
      });
  });

  return <header>{message}</header>;
}

export default App;
