import express from "express";
import dotenv from "dotenv";
import TodoDatabase from "./db.js";
import cors from "cors";
import { TodoSchema, UserId } from "./type.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors());

const PORT = process.env.PORT;
app.get("/Indiviual/AllTodos", async function (req, res) {
  //some logic to retrive all todos which type is indivial todos
  const allTodosWithGlobalType = await TodoDatabase.find({ type: "Indiviual" });
  if (!allTodosWithGlobalType) {
    res.status(401).json({
      msg: "Cannot get the Todos with Global type",
    });
  }
  res.json({ allTodosWithGlobalType });
});

app.post("/GlobalTodos/CreateTodo", async function (req, res) {
  const { title, description } = req.body;
  const ParsedUserInputs = TodoSchema.safeParse(req.body);
  if (!ParsedUserInputs.success) {
    return res.json({
      msg: "Invalid Title or Description length",
    });
  }

  const CreatingTodo = await TodoDatabase.create({
    type: "Global",
    title: title,
    description: description,
    username: "Global",
    isCompleted: false,
  });

  if (!CreatingTodo) {
    res.status(401).json({
      msg: "UnFortunately Cannot add into DataBase",
    });
    return;
  }
  res.json({ msg: "Todo has been SuccessFully added to DataBase" });
});

app.put("/GlobalTodos/Completed", async function (req, res) {
  const updateTodoId = req.body.id;
  const Parsingid = UserId.safeParse(updateTodoId);
  if (!Parsingid.success) {
    return res.json({
      msg: "Incorrect Id",
    });
  }
  try {
    const UpdateingTodoToCompleted = await TodoDatabase.findOneAndUpdate(
      { _id: updateTodoId },
      {
        isCompleted: true,
      }
    );
    if (!UpdateingTodoToCompleted) {
      return res.status(401).json({
        msg: "Unable to Update Todo To Completed ",
      });
    }
  } catch (err) {
    return res.json({ msg: err });
  }

  //Some Logic To Update the status of the todo to be completed.
  res.json({ msg: "Todo Has been updated To Completed in Db" });
});

app.put("/GlobalTodos/NotCompleted", async function (req, res) {
  const updateTodoId = req.body.id;

  const Parsingid = UserId.safeParse(updateTodoId);

  if (!Parsingid.success) {
    return res.json({
      msg: "Incorrect Id",
    });
  }

  try {
    const UpdateingTodoToCompleted = await TodoDatabase.findOneAndUpdate(
      { _id: updateTodoId },
      {
        isCompleted: false,
      }
    );
    if (!UpdateingTodoToCompleted) {
      res.status(401).json({
        msg: "Unable to Update Todo To Completed ",
      });
    }
  } catch (err) {
    return res.json({
      msg: err,
    });
  }

  //Some Logic To Update the status of the todo to be completed.
  res.json({ msg: "Todo Has been updated to NotCompleted in Db" });
});

app.listen(PORT, function () {
  console.log("Server is up and runnig");
});
