import express from "express";
import dotenv from "dotenv";
import { TodoSchema } from "./types.js";
import cors from "cors";

import moongose from "mongoose";
import mongoose from "mongoose";

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors());

const DATABASE_URL = process.env.DATABASE_URL;
const PORT = process.env.PORT;
moongose.connect(DATABASE_URL);

app.get("/Indiviual/AllTodos", async function (req, res) {
  //Used Stack overflow to slove this problem lol
  const collectiossn = mongoose.connection.db.collection("todos");
  const allTodosWithIndiviualType = collectiossn.find({
    type: "Indiviual",
  });
  const allTodosWithIndiviualTypeArray =
    await allTodosWithIndiviualType.toArray();
  res.json({ allTodosWithIndiviualTypeArray });
});

app.post("/Indiviual/CreateTodo", async function (req, res) {
  const { title, description, username } = req.body;
  //Make input Valdaition for Login Work under this logic
  const ParsedUserInputs = TodoSchema.safeParse(req.body);
  if (!ParsedUserInputs.success) {
    return res.json({
      msg: "Invalid Title or Description length",
    });
  }

  const connectionsz = mongoose.connection.db.collection("todos");
  const creatingIndivualTodo = await connectionsz.insertOne({
    username: username,
    type: "Indivual",
    title: title,
    description: description,
    isCompleted: false,
  });

  console.log(creatingIndivualTodo);

  if (!creatingIndivualTodo) {
    res.status(401).json({
      msg: "UnFortunately Cannot add into DataBase",
    });
    return;
  }
  res.json({ msg: "Todo has been SuccessFully added to DataBase" });
});

// app.put("/GlobalTodos/Completed", async function (req, res) {
//   const updateTodoId = req.body.id;
//   const Parsingid = UserId.safeParse(updateTodoId);
//   if (!Parsingid.success) {
//     return res.json({
//       msg: "Incorrect Id",
//     });
//   }
//   try {
//     const UpdateingTodoToCompleted = await TodoDatabase.findOneAndUpdate(
//       { _id: updateTodoId },
//       {
//         isCompleted: true,
//       }
//     );
//     if (!UpdateingTodoToCompleted) {
//       return res.status(401).json({
//         msg: "Unable to Update Todo To Completed ",
//       });
//     }
//   } catch (err) {
//     return res.json({ msg: err });
//   }

//   //Some Logic To Update the status of the todo to be completed.
//   res.json({ msg: "Todo Has been updated To Completed in Db" });
// });

// app.put("/GlobalTodos/NotCompleted", async function (req, res) {
//   const updateTodoId = req.body.id;

//   const Parsingid = UserId.safeParse(updateTodoId);

//   if (!Parsingid.success) {
//     return res.json({
//       msg: "Incorrect Id",
//     });
//   }

//   try {
//     const UpdateingTodoToCompleted = await TodoDatabase.findOneAndUpdate(
//       { _id: updateTodoId },
//       {
//         isCompleted: false,
//       }
//     );
//     if (!UpdateingTodoToCompleted) {
//       res.status(401).json({
//         msg: "Unable to Update Todo To Completed ",
//       });
//     }
//   } catch (err) {
//     return res.json({
//       msg: err,
//     });
//   }

//   //Some Logic To Update the status of the todo to be completed.
//   res.json({ msg: "Todo Has been updated to NotCompleted in Db" });
// });

app.listen(PORT, function () {
  console.log("Server is up and runnig");
});
