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

  if (!value || new Date(value.date).getDate() !== new Date().getDate()) {
    let x = await fetch("https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY");
    let value = await x.json();

    await img.replaceOne(
      { key: "nasaimage" },
      { key: "nasaimage", value },
      { upsert: true }
    );
  }

  reply.json(value);
});

//login route
app.post("/login", async (request, reply) => {
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
app.post("/register", async (request, reply) => {
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
app.post("/googlelogin", async (request, reply) => {
  let { code } = request.body;
  const currentDb = db.db();
  const profiles = currentDb.collection("profiles");

  //get the access token from google
  let token = await fetch(`https://oauth2.googleapis.com/token`, {
    method: "POST",
    body: JSON.stringify({
      code,
      client_id:
        "370903540691-il70h6047bp1c2hc79fmo1sgql1hst82.apps.googleusercontent.com",
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: "http://localhost:3000/googlelogin",
      grant_type: "authorization_code",
    }),
  });
  let tokenJson = await token.json();

  let result = await profiles.findOne({
    client_access_token: tokenJson.access_token,
  });
  if (result) {
    return reply.send({
      success: true,
      token: jwt.sign(
        {
          id: result._id,
          username: result.name,
        },
        process.env.JWT_SECRET
      ),
      username: result.name,
    });
  }

  //get the user profile from google
  let profile = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: {
      Authorization: `Bearer ${tokenJson.access_token}`,
    },
  });
  let profileJson = await profile.json();

  result = await profiles.insertOne({
    name: profileJson.name,
    password: null,
    email: profileJson.email,
    client_id: profileJson.id,
    client_access_token: tokenJson.access_token,
  });

  //get the user from the database
  if (result) {
    return reply.send({
      success: true,
      token: jwt.sign(
        {
          id: result._id,
          username: result.name,
        },
        process.env.JWT_SECRET
      ),
      username: result.name,
    });
  }

  return reply.status(403).send({
    success: false,
    message: "Invalid credentials",
  });
});

export default app;
