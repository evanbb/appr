import express from "express";
import cors from "cors";
import value from "@appr/domain";

const app = express();

app.use(cors());

app.get("/api/root", (req, res) => {
  res.send({ value });
});

app.listen(8000, () => {
  console.error("Listening on port 8000");
});
