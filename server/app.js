import express from "express";
import { config } from "dotenv";
import db from "./db.js";

config();

const app = express();

app.get("/nasaimage", async (request, reply) => {
  const currentDb = db.db();
  const img = currentDb.collection("meta");
  let result = await img.findOne({ key: "nasaimage" });
  let value = result?.value;

  if (!value) {
    let x = await fetch("https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY");
    let value = await x.json();

    await img.insertOne({ key: "nasaimage", value });
  }

  reply.json(value);
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
