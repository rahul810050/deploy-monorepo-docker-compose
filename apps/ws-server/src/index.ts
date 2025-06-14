import { WebSocketServer } from "ws";
import prisma from "@repo/db/client";

const wss = new WebSocketServer({port: 3002});

wss.on("connection", (sokcet)=> {
  console.log("new connection");
  sokcet.send("welcome to the server");
  sokcet.on("message", async(data)=> {
    const message = JSON.parse(data.toString());
    console.log("message", message);

    
    if(message.type === "signup"){
      const username = message.payload.username;
      const password = message.payload.password;
      const existingUser = await prisma.user.findUnique({
        where: {
          username
        }
      })
      if(existingUser) {
        sokcet.send(JSON.stringify({type: "error", payload: "username already exists"}));
        return;
      }
      const user = await prisma.user.create({
        data: {
          username,
          password
        }
      })
      sokcet.send(JSON.stringify({type: "success", payload: "user created successfully"}));
      return;
    }
    else if(message.type === "signin"){
      const username = message.payload.username;
      const password = message.payload.password;
      const user = await prisma.user.findUnique({
        where: {
          username,
          password
        }
      })
      if(!user) {
        sokcet.send(JSON.stringify({type: "error", payload: "invalid credentials"}));
        return;
      }
      sokcet.send(JSON.stringify({type: "success", payload: "user signed in successfully"}));
      return;
      }
  })
})