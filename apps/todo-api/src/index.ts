import express from 'express';

const app = express();

app.listen(8000, () => {
  console.error('Listening on port 8000');
});

export default 42;