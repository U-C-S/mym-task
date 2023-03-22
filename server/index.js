import express from "express";
import { config } from "dotenv";

config();

const app = express();

app.get("/nasaimage", async (request, reply) => {
  let x = await fetch("https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY");
  let y = await x.json();

  reply.json(y);
});

//login route
app.get("/login", async (request, reply) => {
  reply.send({ message: "Hello from ficition-logs api" });
});

//register route
app.get("/register", async (request, reply) => {
  reply.send({ message: "Hello from ficition-logs api" });
});

//google login route
app.get("/googlelogin", async (request, reply) => {
  reply.send({ message: "Hello from ficition-logs api" });
});

export default app;
