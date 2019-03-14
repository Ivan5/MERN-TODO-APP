const express = require("express");
const mongoose = require("mongoose");
const app = express();

const bodyParser = require("body-parser");
const cors = require("cors");

const PORT = 4000;
const todoRoutes = express.Router();
let Todo = require("./todo.model");

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(
  "mongodb://127.0.0.1:27017/todos",
  { useNewUrlParser: true }
);

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

todoRoutes.route("/").get((req, res) => {
  Todo.find((err, todos) => {
    if (err) {
      console.log(err);
    } else {
      res.json(todos);
    }
  });
});

todoRoutes.route("/:id").get((req, res) => {
  let id = req.params.id;
  Todo.findById(id, (err, todo) => {
    res.json(todo);
  });
});

todoRoutes.route("/add").post((req, res) => {
  let todo = new Todo(req.body);
  todo
    .save()
    .then(todo => {
      res.status(200).json({ todo: "Todo added successfully" });
    })
    .catch(err => {
      res.status(400).json("adding new todo failed");
    });
});

todoRoutes.route("/update/:id").put((req, res) => {
  let id = req.params.id;
  Todo.findById(id, (err, todo) => {
    if (!todo) {
      res.status(404).send("data is not found");
    } else {
      todo.todo_description = req.body.todo_description;
      todo.todo_responsable = req.body.todo_responsable;
      todo.todo_priority = req.body.todo_priority;
      todo.todo_completed = req.body.todo_completed;

      todo
        .save()
        .then(todo => {
          res.json("Todo updated");
        })
        .catch(err => {
          res.status(400).send("Update not possible");
        });
    }
  });
});

app.use("/todos", todoRoutes);

app.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
});
