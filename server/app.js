import bcrypt from "bcrypt";
import express, { json } from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "dotenv";
import db from "./db.js";
import jwt from "jsonwebtoken";

config();

const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(json());
app.use(helmet());

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
  const currentDb = db.db();
  const { name, password } = request.body;

  const profiles = currentDb.collection("profiles");
  let result = await profiles.findOne({ name });

  if (result && (await bcrypt.compare(password, result.password))) {
    return reply.send({
      success: true,
      token: jwt.sign(
        {
          id: result._id,
          username: name,
        },
        process.env.JWT_SECRET
      ),
      username: name,
    });
  }

  return reply.status(403).send({
    success: false,
    message: "Invalid credentials",
  });
});

//register route
app.get("/register", async (request, reply) => {
  const { name, password, email } = request.body;
  const currentDb = db.db();

  const profiles = currentDb.collection("profiles");
  let result = await profiles.findOne({ name: name });
  if (result) {
    return reply.status(400).send({
      success: false,
      message: "Username already exists",
    });
  }

  let hashedpassword = await bcrypt.hash(password, 10);
  let profile = await currentDb.collection("profiles").insertOne({
    name,
    password: hashedpassword,
    email,
  });

  if (profile.acknowledged) {
    return reply.send({
      success: true,
      message: "Success",
      data: {
        token: jwt.sign(
          {
            id: profile.insertedId,
            username: name,
          },
          process.env.JWT_SECRET
        ),
        username: name,
      },
    });
  }
  return reply.status(400).send({
    success: false,
    message: "Invalid credentials",
  });
});

//google login route
app.get("/googlelogin", async (request, reply) => {
  reply.send({ message: "Hello from ficition-logs api" });
});

export default app;
