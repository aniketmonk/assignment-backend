const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

// MongoDB Connection
mongoose.connect(
  "mongodb+srv://mohitVerma:GxyBJmyQstWaOaGo@cluster0.rsr5dl3.mongodb.net/todos",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Define Todo Schema
const todoSchema = new mongoose.Schema({
  text: String,
});

const Todo = mongoose.model("Todo", todoSchema);

// Middleware
app.use(bodyParser.json());
const allowedOrigins = [
  "http://localhost:3000",
  "https://6634f4acce069a008c5f5eb5--creative-axolotl-6cc07d.netlify.app",
]; // Add your front-end URLs here
// const corsOptions = {
//   origin: function (origin, callback) {
//     if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
// };

app.use(cors("*"));

// Routes
// Get all todos
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a todo
app.post("/todos", async (req, res) => {
  const todo = new Todo({
    text: req.body.text,
  });

  try {
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a todo
app.put("/todos/:id", async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { text: req.body.text },
      { new: true }
    );
    res.json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a todo
app.delete("/todos/:id", async (req, res) => {
  try {
    await Todo.findOneAndDelete({ _id: req.params.id });
    res.json({ message: "Todo deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/", async (req, res) => {
  res.json({ message: "backend app running" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
