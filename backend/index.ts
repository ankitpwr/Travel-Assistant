import express from "express";
const app = express();
app.use(express.json());

app.post("/api/v1/chat", (req, res) => {});

app.listen(3000, () => {
  console.log("server stated...");
});
