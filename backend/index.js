const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/tool/save_memory", (req, res) => {
  console.log("🧠 MEMORY TOOL CALLED:", req.body);
  res.json({ success: true });
});

app.get("/", (_, res) => {
  res.json({ status: "backend alive" });
});

app.listen(4000, () => {
  console.log("🚀 Backend running on http://localhost:4000");
});

