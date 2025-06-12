import express from "express";
import prisma from "@repo/db/client";
import jwt from "jsonwebtoken";
import userMiddleware from "./middleware/userMiddleware";

const app = express();


app.use(express.json());


app.get("/", (req, res)=> {
  res.send("hi there")
})


app.post("/api/v1/signup", async(req, res)=> {
  const {username, password} = req.body;

  if(!username || !password) {
    res.status(400).json({error: "username and password are required"});
    return;
  }

  try{
    const existingUser = await prisma.user.findUnique({
      where: {
        username
      }
    })
  
    if(existingUser) {
      res.status(400).json({error: "username already exists"});
      return;
    }
  
    const user = await prisma.user.create({
      data: {username, password}
    })  
  
    res.status(201).json({user});
  } catch(error) {
    console.error(error);
    res.status(500).json({error: "internal server error"});
  }
})

app.post("/api/v1/signin", async(req, res)=> {
  const {username, password} = req.body;

  if(!username || !password) {
    res.status(400).json({error: "username and password are required"});
    return;
  }

  try{
    const user = await prisma.user.findUnique({
      where: {
        username,
        password
      }
    })

    if(!user) {
      res.status(401).json({error: "invalid credentials"});
      return;
    }
    const token = jwt.sign({id: user.id}, "secret");

    res.status(200).json({token});
  } catch(error) {
    console.error(error);
    res.status(500).json({error: "internal server error"});
  }
})



app.post("/api/v1/todo", userMiddleware,async(req, res)=> {
  const {title, description, completed } = req.body;
  if(!title || !description || typeof completed !== "boolean") {
    res.status(400).json({error: "title, description and completed are required"});
    return;
  }

  try{
    const user = req.userId;
  const todo = await prisma.todo.create({
    data: {
      title,
      description,
      completed,
      userId: user!
    }
  })

  res.status(201).json({todo});
  } catch(error) {
    console.error(error);
    res.status(500).json({error: "internal server error"});
  }
})


app.get("/api/v1/todos", userMiddleware, async(req, res)=> {
  const user = req.userId;
  try{
    const todos = await prisma.todo.findMany({
      where: {
        userId: user
      }
    })
    res.status(200).json({todos});
  } catch(error) {
    console.error(error);
    res.status(500).json({error: "internal server error"});
  }
})



app.listen(3000, ()=> {
  console.log("server is running on port 3000")
})