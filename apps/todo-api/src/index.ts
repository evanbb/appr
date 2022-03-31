import express from "express";
import cors from "cors";
import value from "@appr/domain";

const app = express();

app.use(cors());

app.get("/:id", (req, res) => {
  res.send({ value, something: 'that is incredibly special', body: req.params.id });
});

app.listen(8000, () => {
  console.error("Listening on port 8000");
});
